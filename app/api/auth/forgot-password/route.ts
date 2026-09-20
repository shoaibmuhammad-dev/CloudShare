import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { createToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { forgotPasswordSchema } from "@/lib/validations/auth";

const GENERIC_MESSAGE = {
  message:
    "If an account with that email exists, you'll receive a password reset link.",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const { email } = parsed.data;
    await connectDB();

    const user = await User.findOne({ email });
    console.log({ found: !!user, verified: user?.emailVerified });

    // Only actually send an email if the account exists and is verified,
    // but ALWAYS return the same generic response either way — this stops
    // this endpoint from being used to enumerate registered emails.
    if (user && user.emailVerified) {
      const rawToken = await createToken(
        user._id.toString(),
        "reset-password",
        30,
      );
      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;
      await sendPasswordResetEmail(user.email, user.fullName, resetLink);
    }

    return NextResponse.json(GENERIC_MESSAGE, { status: 200 });
  } catch (err) {
    console.error("FORGOT_PASSWORD_ERROR", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
