"use client";

import React, { useState } from "react";
import { FolderPlus, Loader2, Plus } from "lucide-react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface createFOlderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateFolderModal() {
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Creating folder:", folderName);

    setIsSubmitting(false);
    setFolderName("");
    setIsCreateFolderModalOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsCreateFolderModalOpen(true)}>
        <Plus className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Create Folder</span>
      </Button>

      <Modal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        title=""
        className=""
      >
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              placeholder="e.g. Project Documents"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                if (error) setError("");
              }}
              error={error}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateFolderModalOpen(false)}
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
