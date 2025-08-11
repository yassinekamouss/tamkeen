import React from "react";

interface Props {
  isOpen: boolean;
  imageSrc: string;
  onToggle(): void;
}

const LauncherButton: React.FC<Props> = ({ isOpen, imageSrc, onToggle }) => {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className="relative">
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}

        <button
          onClick={onToggle}
          className="relative group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="relative">
            <img
              src={imageSrc}
              alt="Assistant Tamkeen"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30"
            />
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75"></div>
        </button>
      </div>
    </div>
  );
};

export default LauncherButton;
