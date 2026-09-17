"use client";

import { createPortal } from "react-dom";

const Logout = () => {
  return (
    <>
      <button
        type="button"
        className="whitespace-nowrap px-1 py-4 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
      >
        Logout
      </button>

      {/* <LogoutModal /> */}
    </>
  );
};

export default Logout;

export function LogoutModal() {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <main className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl flex flex-col items-start justify-center gap-3 p-10">
        <h3>Are you sure you want to logout?</h3>

        <div className="w-full flex items-center justify-end gap-3">
          <button type="button" className="">
            Cancel
          </button>
          <button type="button">Logout</button>
        </div>
      </div>
    </main>,
    document.body,
  );
}
