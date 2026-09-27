import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import Folder, { IFolder } from "@/lib/models/Folder";

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

function toFolderItem(folder: IFolder): FolderItem {
  return {
    id: folder._id.toString(),
    name: folder.name,
    parentId: folder.parentId ? folder.parentId.toString() : null,
    createdAt: folder.createdAt.toISOString(),
    updatedAt: folder.updatedAt.toISOString(),
  };
}

/** Lists folders directly inside parentId (null = root) for a given owner. */
export async function listFolders(
  ownerId: string,
  parentId: string | null,
): Promise<FolderItem[]> {
  await connectDB();

  const folders = await Folder.find({ ownerId, parentId })
    .collation({ locale: "en", strength: 2 }) // case-insensitive alphabetical sort
    .sort({ name: 1 });

  return folders.map(toFolderItem);
}

/** Fetches a single folder by id, or null if it doesn't exist / bad id. */
export async function getFolderById(folderId: string) {
  if (!Types.ObjectId.isValid(folderId)) return null;
  await connectDB();
  return Folder.findById(folderId);
}
