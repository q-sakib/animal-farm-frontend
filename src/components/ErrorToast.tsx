import React, { useEffect } from "react";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="text-sm underline mt-2 hover:text-gray-200"
      >
        Dismiss
      </button>
    </div>
  );
};

export default ErrorToast;
