"use client";

import { EllipsisVertical } from "lucide-react";
import React, { useRef, useState } from "react";
import { CreateFolderModal } from "./CreateFolderModal";

const ButtonMenu = () => {
  const [openActions, setOpenActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    console.log("Selected file: ", Array.from(files));

    setOpenActions(false);

    event.target.value = "";
  };

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenActions((prev) => !prev)}
          className="w-10 h-10 bg-white flex items-center justify-center border border-slate-200 rounded-md shadow-sm"
        >
          <EllipsisVertical className="text-gray-600" size={20} />
        </button>

        {openActions && (
          <div className="w-40 min-h-20 bg-white rounded-md shadow-sm border border-slate-200 absolute top-11 right-0 z-20 p-1">
            <ul>
              <li>
                <CreateFolderModal setOpenActions={setOpenActions} />
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleUploadClick()}
                  className="w-full text-sm py-2 hover:bg-gray-100 text-start px-4 rounded-sm text-neutral-600 font-medium"
                >
                  Upload Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ButtonMenu;
