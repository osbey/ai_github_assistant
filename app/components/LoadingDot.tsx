import React from "react";

const LoadingDot = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-(--surface-raised) border border-(--border) rounded-xl px-3 py-2 text-sm text-(--text-muted)">
        <span className="inline-flex gap-1">
          <span className="animate-bounce [animation-delay:-0.3s]">●</span>
          <span className="animate-bounce [animation-delay:-0.15s]">●</span>
          <span className="animate-bounce">●</span>
        </span>
      </div>
    </div>
  );
};

export default LoadingDot;
