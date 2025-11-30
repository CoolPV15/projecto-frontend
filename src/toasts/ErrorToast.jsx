/**
 * @file ErrorToast.jsx
 * @description A toast component that uses CSS animations and Tailwind 
 * transitions (no Framer Motion). Displays a dismissible toast with 
 * auto-fade and slide-in animations.
 * 
 * @author Pranav Singh
 */

import { XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

function ErrorToast({ error, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);

      // Auto-close after 3 seconds
      const timer = setTimeout(() => handleClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300); // allow fade-out animation
  };

  return (
    <div
      className={`
        fixed top-6 right-6 z-50 
        transform transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
      `}
    >
      <div className="flex items-start gap-3 bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl shadow-xl w-80 animate-slideIn">
        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />

        <div className="flex-1">
          <p className="font-semibold text-red-800">Error</p>
          <p className="text-sm">{error}</p>
        </div>

        <button onClick={handleClose} className="text-red-600 hover:text-red-800">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ErrorToast;