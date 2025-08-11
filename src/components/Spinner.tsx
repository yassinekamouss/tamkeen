import React from "react";

const Spinner: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = "",
}) => {
  const border = Math.max(2, Math.floor(size / 8));
  return (
    <div
      className={`w-full flex items-center justify-center py-10 ${className}`}>
      <div
        className="animate-spin rounded-full border-t-blue-600 border-gray-200"
        style={{ width: size, height: size, borderWidth: border }}
        aria-label="loading"
      />
    </div>
  );
};

export default Spinner;
