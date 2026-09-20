import crypto from "crypto";
import Token, { TokenType } from "@/lib/models/Token";

/**
 * Generates a cryptographically random raw token.
 * This is the value that goes into the email link.
 */
export function generateRawToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hashes a raw token before storing it in the database.
 * We never store the raw token — only its hash — so that if the database
 * were ever leaked, the tokens in it could not be used to hijack accounts.
 */
export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/**
 * Creates a new token of the given type for a user, invalidating any
 * previous tokens of that same type (so an old unused reset link, for
 * example, can never be reused after a new one is requested).
 * Returns the RAW token — this is what you put in the email link.
 */
export async function createToken(
  userId: string,
  type: TokenType,
  ttlMinutes: number,
) {
  await Token.deleteMany({ userId, type });

  const raw = generateRawToken();
  const hashed = hashToken(raw);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  await Token.create({ userId, token: hashed, type, expiresAt });

  return raw;
}

/**
 * Looks up a token by its raw value + type, only returning it if it
 * hasn't expired. Does NOT delete it — callers decide when to consume it.
 */
export async function findValidToken(rawToken: string, type: TokenType) {
  const hashed = hashToken(rawToken);
  return Token.findOne({
    token: hashed,
    type,
    expiresAt: { $gt: new Date() },
  });
}

/** Deletes a single token document once it has been used. */
export async function consumeToken(tokenId: string) {
  await Token.findByIdAndDelete(tokenId);
}
