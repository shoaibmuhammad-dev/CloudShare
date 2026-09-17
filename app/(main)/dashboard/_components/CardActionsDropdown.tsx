"use client";

import { MoreVertical } from "lucide-react";
import React, { useState } from "react";

const CardActionsDropdown = () => {
  const [openActions, setOpenActions] = useState(false);

  const handleToggleActions = () => setOpenActions((prev) => !prev);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => handleToggleActions()}
        aria-label="open folder actions dropdown"
        className="text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 rounded-md hover:bg-slate-50 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {openActions && (
        <div className="w-24 min-h-28 bg-white shadow-sm border border-slate-200 z-20 absolute top-8 right-2 rounded-lg flex flex-col items-start justify-center">
          <button
            type="button"
            onClick={() => handleToggleActions()}
            className="w-full text-sm py-1.5 hover:bg-gray-100 text-start px-4 rounded-sm text-neutral-600 font-medium"
          >
            Rename
          </button>
          <button
            type="button"
            onClick={() => handleToggleActions()}
            className="w-full text-sm py-1.5 hover:bg-gray-100 text-start px-4 rounded-sm text-neutral-600 font-medium"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => handleToggleActions()}
            className="w-full text-sm py-1.5 hover:bg-red-50 text-start px-4 rounded-sm text-red-500 font-medium"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CardActionsDropdown;
