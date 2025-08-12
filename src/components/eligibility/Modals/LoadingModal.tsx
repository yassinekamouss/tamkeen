// LoadingModal.tsx
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
      <div className="flex flex-col items-center justify-center py-8">
        {/* Spinner moderne */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        
        {/* Message */}
        {message && (
          <p className="mt-6 text-gray-600 text-center font-medium">
            {message}
          </p>
        )}
        
        {/* Points animés */}
        <div className="flex space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </Modal>
  );
};

export default LoadingModal;