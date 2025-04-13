import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "medium", className }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  return (
    <motion.div
      data-testid="loading-spinner"
      className={cn(
        "animate-spin rounded-full border-4 border-t-transparent",
        sizeClasses[size],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
};

export default Loader;
