import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Token from "@/lib/models/Token";
import { findValidToken, consumeToken } from "@/lib/tokens";
import { verifyEmailSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { token } = parsed.data;

    await connectDB();

    const tokenDoc = await findValidToken(token, "verify-email");

    if (!tokenDoc) {
      return NextResponse.json(
        { error: "This verification link is invalid or has expired." },
        { status: 400 },
      );
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    user.emailVerified = new Date();
    await user.save();

    // Clean up the used token, plus any other stale verify-email tokens
    // for this user (e.g. from a resend that was never clicked).
    await consumeToken(tokenDoc._id.toString());
    await Token.deleteMany({ userId: user._id, type: "verify-email" });

    // --- Auto-login: mint a NextAuth-compatible session JWT and set it as
    // the session cookie directly, so the user lands on /dashboard already
    // authenticated instead of having to log in again after verifying. ---
    const sessionToken = await encode({
      token: {
        id: user._id.toString(),
        sub: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        image: user.image ?? null,
        emailVerified: user.emailVerified,
      },
      secret: process.env.NEXTAUTH_SECRET as string,
      maxAge: 30 * 24 * 60 * 60,
    });

    const isProd = process.env.NODE_ENV === "production";
    const cookieName = isProd
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    const response = NextResponse.json(
      {
        message: "Email verified successfully.",
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          image: user.image ?? null,
        },
      },
      { status: 200 },
    );

    response.cookies.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("VERIFY_EMAIL_ERROR", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
