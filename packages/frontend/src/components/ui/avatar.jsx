import React from "react";

export function Avatar({ className = '', children }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-semibold select-none ${className}`}
      style={{ width: 36, height: 36 }}
    >
      {children}
    </div>
  );
}

export function AvatarFallback({ children }) {
  return <span>{children}</span>;
}
