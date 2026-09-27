"use client";

import React, { SetStateAction, useState } from "react";
import { FolderPlus, Loader2, Plus } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { folderNameSchema } from "@/lib/validations/folder";
import { useCreateFolder } from "@/lib/hooks/useFolders";

const createFolderFormSchema = z.object({
  name: folderNameSchema,
});

type CreateFolderFormData = z.infer<typeof createFolderFormSchema>;

interface CreateFolderModalProps {
  parentId?: string | null;
  setOpenActions: React.Dispatch<SetStateAction<boolean>>;
}

export function CreateFolderModal({
  parentId = null,
  setOpenActions,
}: CreateFolderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFolderFormData>({
    resolver: zodResolver(createFolderFormSchema),
    defaultValues: { name: "" },
  });

  const { mutate: createFolder, isPending: isSubmitting } =
    useCreateFolder(parentId);

  function handleClose() {
    if (isSubmitting) return;
    setIsOpen(false);
    setFormError(null);
    setOpenActions(false);
    reset();
  }

  const onSubmit: SubmitHandler<CreateFolderFormData> = (data) => {
    setFormError(null);

    createFolder(data.name, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
      onError: (err: any) => {
        // Session died mid-use (expired cookie, logged out in another tab)
        // -> send them to login instead of showing a confusing inline error.
        if (err?.status === 401) {
          window.location.href = "/login";
          return;
        }
        // 403/404/409/500 and network failures all land here with the
        // message the API (or fetch itself) provided.
        setFormError(err?.message ?? "Something went wrong. Please try again.");
      },
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full text-sm py-2 hover:bg-gray-100 text-start px-4 rounded-sm text-neutral-600 font-medium"
      >
        Create Folder
      </button>
      <Modal isOpen={isOpen} onClose={handleClose} title="" className="">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center text-center mb-2">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
              <FolderPlus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Create New Folder
            </h3>
            <p className="text-sm text-slate-500">
              Organize your files by creating a new folder.
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {formError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              placeholder="e.g. Project Documents"
              error={errors.name?.message}
              autoFocus
              {...register("name")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Folder"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
