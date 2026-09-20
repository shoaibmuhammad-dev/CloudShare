import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { createToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mailer";
import { signupSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { fullName, email, password } = parsed.data;

    await connectDB();

    const existingUser = await User.findOne({ email });

    // Already exists AND verified -> block signup, this email is taken.
    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let userId: string;

    if (existingUser && !existingUser.emailVerified) {
      // They started signup before but never verified — refresh their
      // details and resend the link instead of erroring out on them.
      existingUser.fullName = fullName;
      existingUser.password = hashedPassword;
      await existingUser.save();
      userId = existingUser._id.toString();
    } else {
      const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
      });
      userId = newUser._id.toString();
    }

    const rawToken = await createToken(userId, "verify-email", 60);
    const verifyLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${rawToken}`;

    await sendVerificationEmail(email, fullName, verifyLink);

    return NextResponse.json(
      {
        message:
          "Account created. Please check your email to verify your account before logging in.",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("SIGNUP_ERROR", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
