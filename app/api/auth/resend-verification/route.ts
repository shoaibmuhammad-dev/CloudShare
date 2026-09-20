import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { createToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mailer";
import { resendVerificationSchema } from "@/lib/validations/auth";

const GENERIC_MESSAGE = {
  message:
    "If an account with that email exists and isn't verified yet, we've sent a new verification link.",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resendVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const { email } = parsed.data;
    await connectDB();

    const user = await User.findOne({ email });

    // Always respond identically whether the user exists, is already
    // verified, or not found at all — this prevents attackers from using
    // this endpoint to discover which emails are registered.
    if (!user || user.emailVerified) {
      return NextResponse.json(GENERIC_MESSAGE, { status: 200 });
    }

    const rawToken = await createToken(user._id.toString(), "verify-email", 60);
    const verifyLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${rawToken}`;
    await sendVerificationEmail(user.email, user.name, verifyLink);

    return NextResponse.json(GENERIC_MESSAGE, { status: 200 });
  } catch (err) {
    console.error("RESEND_VERIFICATION_ERROR", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
