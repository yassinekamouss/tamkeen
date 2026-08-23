import React from "react";
import type { SuggestedAction } from "../types";

interface QuickActionsProps {
  actions: SuggestedAction[];
  onActionClick: (action: SuggestedAction) => void;
  disabled?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
  disabled = false,
}) => {
  if (!actions || actions.length === 0) return null;

  const getButtonStyle = (actionType: string) => {
    const type = actionType?.toUpperCase().trim();
    switch (type) {
      case "CONTACT_ADVISOR":
        return "bg-[#1E5ED8] hover:bg-[#111827] text-white border border-[#1E5ED8]";
      case "EDIT_FORM":
        return "bg-amber-600 hover:bg-amber-700 text-white border border-amber-600";
      case "SIMULATE":
        return "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600";
      case "VISIT_PROGRAM":
        return "bg-white hover:bg-gray-50 text-[#111827] border border-gray-300";
      case "NEW_TEST":
      default:
        return "bg-gray-100 hover:bg-gray-200 text-[#111827] border border-gray-200";
    }
  };

  const getIcon = (actionType: string) => {
    const type = actionType?.toUpperCase().trim();
    switch (type) {
      case "CONTACT_ADVISOR":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case "EDIT_FORM":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case "SIMULATE":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "VISIT_PROGRAM":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        );
      case "NEW_TEST":
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  return (
    <div className="pt-4 border-t border-gray-200">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Actions suggérées :
      </p>
      <div className="flex flex-wrap gap-2.5">
        {actions.map((act, idx) => (
          <button
            key={idx}
            onClick={() => onActionClick(act)}
            disabled={disabled}
            className={`inline-flex items-center gap-2 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider rounded-none transition-all duration-200 shadow-sm ${getButtonStyle(
              act.actionType
            )} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow"}`}
          >
            {getIcon(act.actionType)}
            <span>{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
