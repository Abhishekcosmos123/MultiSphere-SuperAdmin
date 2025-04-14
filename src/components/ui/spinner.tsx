import React from "react";

interface SpinnerProps {
  size?: number;
  color?: string; 
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 20,
  color = "text-white",
  className = "",
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${color} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
