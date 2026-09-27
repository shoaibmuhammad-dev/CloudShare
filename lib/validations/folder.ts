import { z } from "zod";

// Characters that break URLs, file paths, or are reserved on Windows —
// worth blocking now since files/downloads will build on this later.
const FORBIDDEN_CHARS_REGEX = /^[^\\/:*?"<>|]+$/;

export const folderNameSchema = z
  .string()
  .trim()
  .min(1, "Folder name is required")
  .max(255, "Folder name must be under 255 characters")
  .regex(FORBIDDEN_CHARS_REGEX, "Folder name can't contain \\ / : * ? \" < > |")
  .refine((val) => val !== "." && val !== "..", {
    message: "Invalid folder name",
  });

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid folder id");

export const createFolderSchema = z.object({
  name: folderNameSchema,
  // Omit entirely, or pass null, to create at the dashboard root.
  parentId: objectIdSchema.nullable().optional(),
});
