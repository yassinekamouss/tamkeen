import React from "react";

interface Props {
  value: string;
  onChange(v: string): void;
  onSend(): void;
  onEnterKey(e: React.KeyboardEvent): void;
}

const InputBar: React.FC<Props> = ({ value, onChange, onSend, onEnterKey }) => {
  return (
    // Ajout de rounded-b-2xl/3xl pour matcher le parent
    <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0 rounded-b-2xl sm:rounded-b-3xl">
      <div className="flex space-x-2 sm:space-x-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onEnterKey}
            placeholder="Tapez votre message..."
            rows={1}
            // Changement CRITIQUE : text-base sur mobile pour éviter le zoom iOS, text-sm sur desktop
            className="w-full px-3 py-2 sm:px-3 sm:py-2 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm resize-none bg-gray-50 hover:bg-white transition-colors duration-200"
            style={{ minHeight: "40px", maxHeight: "80px" }}
          />
        </div>
        <button
          onClick={onSend}
          disabled={value.trim() === ""}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white p-2 sm:p-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 hidden sm:block">
        Appuyez sur Entrée pour envoyer
      </p>
    </div>
  );
};

export default React.memo(InputBar);
