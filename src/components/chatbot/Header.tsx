import React from "react";

interface Props {
  imageSrc: string;
  onReset(): void;
  onClose(): void;
}

const Header: React.FC<Props> = ({ imageSrc, onReset, onClose }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-4 sm:p-6 flex-shrink-0">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rotate-45"></div>
        <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-4 left-12 w-6 h-6 bg-white/10 transform rotate-45"></div>
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            <img
              src={imageSrc}
              alt="Assistant Tamkeen"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white/50 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg">
              Assistant Tamkeen
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Spécialiste en ligne
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            title="Nouvelle conversation"
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 bg-transparent">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 bg-transparent">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
