import React from "react";

interface Props {
  items: { text: string; action: string }[];
  onAction(action: string, key: string): void;
  visible: boolean;
}

const QuickActions: React.FC<Props> = ({ items, onAction, visible }) => {
  if (!visible) return null;
  return (
    <div className="px-3 py-3 sm:px-4 sm:py-3 border-t border-gray-200 bg-white/80 flex-shrink-0">
      <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-2 font-medium">
        Actions rapides pour commencer :
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onAction(item.action, `action_${index}`)}
            className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 px-2 py-2 sm:px-3 sm:py-2 rounded-xl border border-blue-200 transition-all duration-200 text-left font-medium">
            {item.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(QuickActions);
