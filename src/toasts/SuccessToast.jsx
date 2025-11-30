/**
 * @file SuccessToast.jsx
 * @description Animated success toast notification component for confirming actions
 * such as sending join requests. Appears at bottom-right and auto-dismisses.
 * @module SuccessToast
 * @author Pranav Singh
 */

import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

function SuccessToast({ message, onClose }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-3
        bg-white/80 backdrop-blur-xl
        border border-green-300
        shadow-xl rounded-xl px-4 py-3
        animate-slideIn
      "
    >
      <CheckCircle className="text-green-600" size={24} />

      <p className="text-green-700 font-medium">{message}</p>

      <button
        onClick={onClose}
        className="text-green-700 hover:text-green-900 transition"
      >
        <X size={20} />
      </button>
    </div>
  );
}

export default SuccessToast;
