import React from "react";
import Modal from "./Modal";

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ 
  isOpen, 
  title = "Traitement en cours",
  message = "Veuillez patienter..." 
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}} 
      title={title}
      size="sm"
      showCloseButton={false}
    >
      <div className="flex flex-col items-center justify-center py-12">
        {/* Spinner moderne avec double cercle */}
        <div className="relative mb-8">
          {/* Cercle extérieur */}
          <div className="w-20 h-20 border-4 border-slate-200 rounded-full"></div>
          {/* Cercle intérieur rotatif */}
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
          {/* Cercle central pulse */}
          <div className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 bg-blue-500/20 rounded-full animate-pulse"></div>
        </div>
        
        {/* Message avec style amélioré */}
        {message && (
          <p className="text-slate-600 text-center font-medium text-lg mb-6 tracking-wide">
            {message}
          </p>
        )}
        
        {/* Points animés avec timing amélioré */}
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms] [animation-duration:1.4s]"></div>
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:200ms] [animation-duration:1.4s]"></div>
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:400ms] [animation-duration:1.4s]"></div>
        </div>
        
        {/* Barre de progression subtile */}
        <div className="w-full max-w-xs mt-8">
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoadingModal;