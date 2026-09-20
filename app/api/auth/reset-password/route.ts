import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Token from "@/lib/models/Token";
import { findValidToken, consumeToken } from "@/lib/tokens";
import { resetPasswordSchema } from "@/lib/validations/auth";

// GET /api/auth/reset-password?token=xxx
// Lets the reset-password page validate the token the moment it loads
// (without consuming it) so it can show the "set new password" form or
// an "this link is invalid/expired" state before the user types anything.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Missing token" },
        { status: 400 },
      );
    }

    await connectDB();
    const tokenDoc = await findValidToken(token, "reset-password");

    if (!tokenDoc) {
      return NextResponse.json(
        { valid: false, error: "This reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (err) {
    console.error("RESET_PASSWORD_TOKEN_CHECK_ERROR", err);
    return NextResponse.json(
      { valid: false, error: "Something went wrong." },
      { status: 500 },
    );
  }
}

// POST /api/auth/reset-password  { token, password }
// Actually resets the password and invalidates the token.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { token, password } = parsed.data;
    await connectDB();

    const tokenDoc = await findValidToken(token, "reset-password");
    if (!tokenDoc) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    await consumeToken(tokenDoc._id.toString());
    await Token.deleteMany({ userId: user._id, type: "reset-password" });

    return NextResponse.json(
      { message: "Password reset successfully. You can now log in." },
      { status: 200 },
    );
  } catch (err) {
    console.error("RESET_PASSWORD_ERROR", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
