import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IFolder extends Document {
  name: string;
  ownerId: Types.ObjectId;
  parentId: Types.ObjectId | null; // null = lives at the dashboard root
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true, trim: true, maxlength: 255 },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

// Speeds up the most common query pattern: "list everything directly
// inside this folder, for this owner" — which is exactly what both the
// dashboard root (parentId: null) and every nested folder view will run.
FolderSchema.index({ ownerId: 1, parentId: 1 });

// Prevents "OverwriteModelError" during Next.js hot reload in dev.
export default (models.Folder as Model<IFolder>) ||
  model<IFolder>("Folder", FolderSchema);
