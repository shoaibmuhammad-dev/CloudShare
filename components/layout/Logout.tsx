"use client";

import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const Logout = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="whitespace-nowrap px-1 py-4 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
      >
        Logout
      </button>

      {showModal && <LogoutModal setShowModal={setShowModal} />}
    </>
  );
};

export default Logout;

interface LogoutModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LogoutModal({ setShowModal }: LogoutModalProps) {
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape, and lock page scroll while the modal is open.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoggingOut) {
        setShowModal(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLoggingOut, setShowModal]);

  async function handleLogout() {
    setIsLoggingOut(true);
    queryClient.clear();
    await signOut({ callbackUrl: "/login" });
  }

  function handleClose() {
    if (isLoggingOut) return;
    setShowModal(false);
  }

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 animate-in fade-in"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2"
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isLoggingOut}
          className="absolute right-4 top-4 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        <h3
          id="logout-modal-title"
          className="mb-1.5 text-center text-lg font-semibold text-slate-900"
        >
          Log out of CloudShare?
        </h3>

        <p className="mb-6 text-center text-sm text-slate-500">
          You'll need to sign in again to access your files and folders.
        </p>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleClose}
            disabled={isLoggingOut}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              "Log out"
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
