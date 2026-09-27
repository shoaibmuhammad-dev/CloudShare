import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Folder from "@/lib/models/Folder";
import { createFolderSchema } from "@/lib/validations/folder";
import { listFolders, getFolderById } from "@/lib/data/folders";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// POST /api/folders   { name, parentId? }
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = createFolderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { name, parentId } = parsed.data;
    const normalizedParentId = parentId ?? null;

    await connectDB();

    // Creating inside a subfolder -> that folder must actually exist and
    // belong to this user. (Once collaborators/permissions exist, expand
    // this to "owner OR editor permission on this folder".)
    if (normalizedParentId) {
      const parentFolder = await Folder.findById(normalizedParentId);
      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found." },
          { status: 404 },
        );
      }
      if (parentFolder.ownerId.toString() !== session.user.id) {
        return NextResponse.json(
          { error: "You don't have permission to create a folder here." },
          { status: 403 },
        );
      }
    }

    // Block duplicate sibling names (case-insensitive) — mirrors how
    // Windows/Mac Finder behave, and avoids ambiguous folder listings.
    const duplicate = await Folder.findOne({
      ownerId: session.user.id,
      parentId: normalizedParentId,
      name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "A folder with this name already exists here." },
        { status: 409 },
      );
    }

    const folder = await Folder.create({
      name,
      ownerId: session.user.id,
      parentId: normalizedParentId,
    });

    return NextResponse.json(
      {
        id: folder._id.toString(),
        name: folder.name,
        parentId: folder.parentId ? folder.parentId.toString() : null,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
      },
      { status: 201 },
    );
  } catch (err: any) {
    // Malformed ObjectId reaching a query (e.g. right length but invalid hex)
    if (err?.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid parent folder id." },
        { status: 400 },
      );
    }
    if (err?.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid folder data." },
        { status: 400 },
      );
    }
    console.error("CREATE_FOLDER_ERROR", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

// GET /api/folders?parentId=xxx   (omit or "null" for the dashboard root)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rawParentId = searchParams.get("parentId");
    const normalizedParentId =
      !rawParentId || rawParentId === "null" ? null : rawParentId;

    if (normalizedParentId && !/^[0-9a-fA-F]{24}$/.test(normalizedParentId)) {
      return NextResponse.json(
        { error: "Invalid parent folder id." },
        { status: 400 },
      );
    }

    await connectDB();

    if (normalizedParentId) {
      const parentFolder = await getFolderById(normalizedParentId);
      if (!parentFolder) {
        // Handles the case where the folder was deleted (by this user or
        // a collaborator) while someone else still had it open.
        return NextResponse.json(
          { error: "Folder not found." },
          { status: 404 },
        );
      }
      if (parentFolder.ownerId.toString() !== session.user.id) {
        return NextResponse.json(
          { error: "You don't have permission to view this folder." },
          { status: 403 },
        );
      }
    }

    const folders = await listFolders(session.user.id, normalizedParentId);

    return NextResponse.json({ folders });
  } catch (err: any) {
    if (err?.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid parent folder id." },
        { status: 400 },
      );
    }
    console.error("LIST_FOLDERS_ERROR", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
