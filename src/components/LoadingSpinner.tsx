
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
    <div className={`flex justify-center items-center min-h-[200px] ${className}`}>
      <div className="text-center">
        <div
          className={`${sizeClasses[size]} mx-auto rounded-full border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent animate-spin`}
          role="status"
          aria-label="Carregando..."
        >
          <span className="sr-only">Carregando...</span>
        </div>
        <p className="mt-4 text-gray-600 text-sm">Carregando GymCloud...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
