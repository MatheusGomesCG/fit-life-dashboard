
import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  className = "",
}) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-3",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-t-fitness-primary border-r-transparent border-b-fitness-primary border-l-transparent animate-spin`}
        role="status"
        aria-label="Carregando..."
      >
        <span className="sr-only">Carregando...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
