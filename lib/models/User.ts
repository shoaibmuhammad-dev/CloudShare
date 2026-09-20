import { Schema, model, models, Document, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  image?: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // select: false -> password is never returned unless explicitly requested
    // with .select("+password"), so it never accidentally leaks in API responses.
    password: { type: String, required: true, select: false },
    image: { type: String, default: null },
    emailVerified: { type: Date, default: null },
  },
  { timestamps: true },
);

// Prevents "OverwriteModelError" during Next.js hot reload in dev.
export default (models.User as Model<IUser>) ||
  model<IUser>("User", UserSchema);
