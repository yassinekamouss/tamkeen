import React from "react";
import Modal from "./Modal";
import { AlertTriangle, X } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  showRetryButton?: boolean;
  onRetry?: () => void;
  retryText?: string;
  closeText?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ 
  isOpen,
  onClose,
  title = "Une erreur s'est produite",
  message,
  showRetryButton = false,
  onRetry,
  retryText = "Réessayer",
  closeText = "Fermer"
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="md"
      showCloseButton={false}
    >
      <div className="text-center py-6">
        {/* Icône d'erreur */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        {/* Titre */}
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          {title}
        </h3>
        
        {/* Message d'erreur */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-slate-700 leading-relaxed text-left">
            {message}
          </p>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetryButton && onRetry && (
            <button 
              onClick={() => {
                onRetry();
                onClose();
              }}
              className="
                px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                font-medium transition-all duration-200 hover:scale-105 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                shadow-sm hover:shadow-md
              "
            >
              {retryText}
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="
              px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg 
              font-medium transition-all duration-200 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
              shadow-sm hover:shadow-md
            "
          >
            {closeText}
          </button>
        </div>
        
        {/* Bouton X en haut à droite */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 
            transition-all duration-200 text-slate-400 hover:text-slate-600
            focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2
            hover:scale-105 active:scale-95
          "
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
      </div>
    </Modal>
  );
};

export default ErrorModal;