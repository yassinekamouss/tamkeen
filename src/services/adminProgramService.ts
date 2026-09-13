import api, { ADMIN_API_PREFIX } from "../api/axios";
import type { EligibilityProfile } from "../components/admin/programs/dnfCompiler";

export interface MagicRuleResponse {
  success: boolean;
  summary: string;
  profiles: EligibilityProfile[];
}

export const adminProgramService = {
  generateMagicRules: async (
    prompt: string,
    programId?: number,
    context?: Record<string, any>
  ): Promise<MagicRuleResponse> => {
    const response = await api.post<MagicRuleResponse>(
      `${ADMIN_API_PREFIX}/programs/magic-rules`,
      {
        prompt,
        programId,
        context,
      }
    );
    return response.data;
  },
};
