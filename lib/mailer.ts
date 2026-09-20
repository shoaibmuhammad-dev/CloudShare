import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use Resend's shared test domain until you verify your own domain in the
// Resend dashboard. Once verified, set EMAIL_FROM to something like
// "Your App <no-reply@yourdomain.com>" in .env.local.
const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

export async function sendVerificationEmail(
  to: string,
  fullName: string,
  link: string,
) {
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Hi ${fullName},</h2>
        <p>Thanks for signing up. Please verify your email address to activate your account.</p>
        <p>
          <a href="${link}" style="background:#111;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">
            Verify Email
          </a>
        </p>
        <p>This link expires in 60 minutes. If you didn't create this account, you can safely ignore this email.</p>
        <p style="color:#888;font-size:12px;">Or paste this link into your browser: ${link}</p>
      </div>
    `,
  });

  if (error) {
    console.error("RESEND_VERIFICATION_EMAIL_ERROR", error.message);
    throw new Error("Failed to send verification email.");
  }
}

export async function sendPasswordResetEmail(
  to: string,
  fullName: string,
  link: string,
) {
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 100%; background: #fff;">
        <h2>Hi ${fullName},</h2>
        <p style="width: 100%; max-width: 480px;">We received a request to reset your password. Click below to choose a new one.</p>
        <p>
          <a href="${link}" style="background:#111;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">
            Reset Password
          </a>
        </p>
        <p style="width: 100%; max-width: 480px;">This link expires in 30 minutes. If you didn't request this, you can safely ignore this email — your password won't change.</p>
        <p style="color:#888;font-size:12px;">Or paste this link into your browser: ${link}</p>
      </div>
    `,
  });

  if (error) {
    console.error("RESEND_PASSWORD_RESET_EMAIL_ERROR", error);
    throw new Error("Failed to send password reset email.");
  }
}
