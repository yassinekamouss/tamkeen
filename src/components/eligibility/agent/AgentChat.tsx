import React, { useState, useEffect } from "react";
import type { FormData, AgentApiResponse, SuggestedAction } from "../types";
import { callAgent } from "../utils";
import { useTranslation } from "react-i18next";
import AgentLoadingState from "./AgentLoadingState";
import AgentMessage from "./AgentMessage";
import QuickActions from "./QuickActions";

interface AgentChatProps {
  formData: FormData;
  testId?: string | null;
  onNewTest: () => void;
  onContactAdvisor: () => void;
  onSimulate?: (fieldToAdjust?: string, suggestedValue?: string) => void;
  onEditForm?: (fieldsToClear?: string[]) => void;
}

const AgentChat: React.FC<AgentChatProps> = ({
  formData,
  testId,
  onNewTest,
  onContactAdvisor,
  onSimulate,
  onEditForm,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "fr" | "ar";

  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<AgentApiResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initAgent() {
      setLoading(true);
      const res = await callAgent({
        formData,
        lang,
        testId,
        sessionId,
      });

      if (isMounted) {
        setResponse(res);
        if (res.sessionId) {
          setSessionId(res.sessionId);
        }
        setLoading(false);
      }
    }

    initAgent();

    return () => {
      isMounted = false;
    };
  }, [formData, lang, testId]);

  const handleActionClick = (action: SuggestedAction) => {
    const actionType = action.actionType?.toUpperCase().trim();

    switch (actionType) {
      case "CONTACT_ADVISOR":
        onContactAdvisor();
        break;

      case "NEW_TEST":
        onNewTest();
        break;

      case "EDIT_FORM":
        if (onEditForm) {
          onEditForm(action.metadata?.fieldsToClear);
        } else {
          onNewTest();
        }
        break;

      case "VISIT_PROGRAM":
        if (action.metadata?.programLink) {
          window.open(action.metadata.programLink, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = "/#programs";
        }
        break;

      case "SIMULATE":
        if (action.metadata?.programLink) {
          window.open(action.metadata.programLink, "_blank", "noopener,noreferrer");
        } else if (onSimulate) {
          onSimulate(action.metadata?.fieldToAdjust, action.metadata?.suggestedValue);
        } else {
          onNewTest();
        }
        break;

      default:
        if (action.metadata?.programLink) {
          window.open(action.metadata.programLink, "_blank", "noopener,noreferrer");
        } else {
          onNewTest();
        }
        break;
    }
  };

  if (loading) {
    return <AgentLoadingState />;
  }

  if (!response || !response.data) {
    return (
      <div className="bg-white border border-[#E4E4E7] p-8 text-center space-y-4">
        <p className="text-sm text-gray-700 font-sans">
          {t("eligibility.agent.errorLoading")}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onContactAdvisor}
            className="bg-[#1E5ED8] text-white px-5 py-3 font-display font-bold text-xs uppercase tracking-wider"
          >
            {t("eligibility.agent.speakAdvisor")}
          </button>
          <button
            onClick={onNewTest}
            className="bg-gray-100 text-[#111827] px-5 py-3 font-display font-bold text-xs uppercase tracking-wider"
          >
            {t("eligibility.agent.redoEvaluation")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#111827] text-white p-6 border-b-4 border-[#1E5ED8] flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#1E5ED8] font-bold block mb-1">
            {t("eligibility.agent.smartService")}
          </span>
          <h2 className="text-xl font-bold font-display uppercase tracking-wide">
            {t("eligibility.agent.diagnosticTitle")}
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-[#1E5ED8]/20 border border-[#1E5ED8]/40 px-3 py-1.5 text-xs text-blue-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t("eligibility.agent.activeAgent")}</span>
        </div>
      </div>

      {/* Main Message & Analysis */}
      <AgentMessage data={response.data} programs={response.programs || []} />

      {/* Quick Actions */}
      <QuickActions
        actions={response.data.suggestedActions || []}
        onActionClick={handleActionClick}
      />

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 flex-wrap gap-3 font-sans">
        <button
          onClick={onNewTest}
          className="text-gray-600 hover:text-[#111827] underline uppercase tracking-wider font-semibold cursor-pointer"
        >
          {t("eligibility.agent.redoTestLink")}
        </button>

        <span>
          {t("eligibility.agent.platformSubtext")}
        </span>
      </div>
    </div>
  );
};

export default AgentChat;
