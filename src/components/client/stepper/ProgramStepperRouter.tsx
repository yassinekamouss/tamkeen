import React from 'react';
import { TpmeStepper } from './TpmeStepper';
import { AlertCircle } from 'lucide-react';

interface ProgramStepperRouterProps {
  dossierId: number;
  programId?: number | string;
  onSubmitted?: () => Promise<void> | void;
}

export const ProgramStepperRouter: React.FC<ProgramStepperRouterProps> = ({
  dossierId,
  programId,
  onSubmitted = () => {},
}) => {
  // 1 is TPME. For now, fallback to 1 to not break existing clients
  const activeProgramId = programId ? String(programId) : "1";

  switch (activeProgramId) {
    case "1":
      return <TpmeStepper dossierId={dossierId} onSubmitted={onSubmitted} />;
    
    // Future programs can be added here
    // case "2":
    //   return <Program2Stepper dossierId={dossierId} onSubmitted={onSubmitted} />;

    default:
      return (
        <div className="max-w-2xl mx-auto mt-8 p-4 rounded-xl border border-red-200 bg-red-50 text-red-900 flex items-start gap-3 shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-red-800">Erreur de Programme</h4>
            <p className="text-xs text-red-700 mt-1">
              Ce dossier est associé à un programme non supporté ou introuvable (ID: {activeProgramId}).
            </p>
          </div>
        </div>
      );
  }
};

