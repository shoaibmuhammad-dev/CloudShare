import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

// GET /api/user/me
// Returns the logged-in user's fresh profile data from the database
// (not just what's cached in the JWT) — used to populate the dashboard
// top bar and the profile page.
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id).select("-password");

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    image: user.image ?? null,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  });
}
