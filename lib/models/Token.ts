import { Schema, model, models, Document, Model, Types } from "mongoose";

export type TokenType = "verify-email" | "reset-password";

export interface IToken extends Document {
  userId: Types.ObjectId;
  token: string; // sha256 hash of the raw token — the raw value is never stored
  type: TokenType;
  expiresAt: Date;
  createdAt: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    type: {
      type: String,
      enum: ["verify-email", "reset-password"],
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// TTL index: MongoDB automatically deletes the document once expiresAt has
// passed, so expired tokens clean themselves up with zero extra code.
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
TokenSchema.index({ userId: 1, type: 1 });

export default (models.Token as Model<IToken>) ||
  model<IToken>("Token", TokenSchema);
