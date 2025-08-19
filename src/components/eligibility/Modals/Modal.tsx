import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  showCloseButton = true 
}) => {
  const scrollPosition = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const body = document.body;
    
    if (isOpen) {
      // Sauvegarder la position de scroll actuelle
      scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;
      
      // Empêcher le scroll du body et maintenir la position
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${scrollPosition.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      
      // Démarrer l'animation d'entrée
      setTimeout(() => setIsVisible(true), 10);
    }
    
    return () => {
      if (isOpen) {
        // Restaurer le scroll quand le composant se démonte
        body.style.overflow = "";
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        
        // Restaurer la position de scroll
        window.scrollTo(0, scrollPosition.current);
      }
    };
  }, [isOpen]);

  // Gérer la fermeture avec animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Gérer la fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && showCloseButton) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, showCloseButton]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop avec animation */}
      <div 
        className={`
          absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-all duration-300 ease-out
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={showCloseButton ? handleClose : undefined}
      />
      
      {/* Modal Content avec animation */}
      <div
        className={`
          relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden
          bg-white rounded-xl shadow-2xl transition-all duration-300 ease-out z-10
          border border-slate-200/50 backdrop-blur-sm
          ${isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec design moderne */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200/60">
            {title && (
              <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                className="
                  group ml-4 p-2.5 rounded-lg hover:bg-slate-200/60 transition-all duration-200 
                  text-slate-400 hover:text-slate-600 focus:outline-none 
                  focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:bg-slate-200/60
                  flex-shrink-0 hover:scale-105 active:scale-95
                "
                aria-label="Fermer"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            )}
          </div>
        )}
        
        {/* Contenu avec scroll personnalisé */}
        <div className="
          px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)]
          scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent
          hover:scrollbar-thumb-slate-400
        ">
          {children}
        </div>
        
        {/* Effet de lumière subtil en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </div>
  );
};

export default Modal;