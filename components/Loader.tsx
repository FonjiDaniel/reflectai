import React from "react";
export default function FullPageLoader() {
    return (
      <div className="fixed inset-0 flex items-center justify-center gap-2  bg-white">
        <div className="w-3 h-3 max-sm:w-2 max-sm:h-2 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
        <p className="text-sm">Authenticating...</p>
      </div>
    );
  }