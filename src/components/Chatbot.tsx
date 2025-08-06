import React, { useState, useRef, useEffect } from "react";
import imageLogo from "../assets/image_logo.webp";
import { useTranslation } from "react-i18next";
import TamkeenChatService from "../services/chatService";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant Tamkeen. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = useRef(TamkeenChatService.getInstance());

  // Réponses contextuelles remplacées par l'intégration OpenAI
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    // Délai pour permettre au DOM de se mettre à jour
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Envoi du message via le service OpenAI
      const response = await chatService.current.sendMessage(inputValue);

      // Le nouveau service n'a plus de contexte à récupérer
      // ChatGPT gère tout automatiquement

      // La réponse ChatGPT est déjà complète, aucun traitement supplémentaire nécessaire
      const botResponse = response;

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Désolé, je rencontre des difficultés techniques. Veuillez réessayer.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (action: string, actionKey: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: action,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Mapping des actions vers les clés internes
      const actionMapping: { [key: string]: string } = {
        "Je souhaite avoir des informations sur Tamkeen": "info_tamkeen",
        "Quels sont les programmes de subventions disponibles ?":
          "info_programmes",
        "Je veux faire un test d'éligibilité": "test_eligibilite",
        "Comment puis-je vous contacter ?": "contact",
      };

      const mappedAction = actionMapping[action] || actionKey;
      const response = await chatService.current.sendMessage(
        action,
        mappedAction
      );

      // Plus besoin de contexte - ChatGPT gère tout automatiquement

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur lors de l'action rapide:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Désolé, je rencontre des difficultés techniques. Veuillez réessayer.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    {
      text: "📢 Informations sur Tamkeen",
      action: "Je souhaite avoir des informations sur Tamkeen",
    },
    {
      text: "📋 Nos programmes disponibles",
      action: "Quels sont les programmes de subventions disponibles ?",
    },
    {
      text: "✅ Tester mon éligibilité",
      action: "Je veux faire un test d'éligibilité",
    },
    {
      text: "📞 Contact & Support",
      action: "Comment puis-je vous contacter ?",
    },
  ];

  const resetConversation = () => {
    chatService.current.resetConversation();
    setMessages([
      {
        id: 1,
        text: "Bonjour ! Je suis l'assistant Tamkeen. Comment puis-je vous aider aujourd'hui ?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Bouton du chatbot - Style Tamkeen authentique */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <div className="relative">
          {/* Notification pulse pour attirer l'attention */}
          {!isOpen && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="relative">
              <img
                src={imageLogo}
                alt="Assistant Tamkeen"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30"
              />

              {/* Overlay avec icône de chat */}
              <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75"></div>
          </button>

          {/* Bulle d'invitation contextuelle */}
          {!isOpen && (
            <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-2 hidden sm:block">
              <div className="relative bg-white rounded-2xl shadow-xl p-4 max-w-xs border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm mb-1">
                      Assistant en ligne
                    </p>
                    <p className="text-gray-600 text-xs">
                      Besoin d'aide ? Je suis là pour vous !
                    </p>
                  </div>
                </div>

                {/* Flèche */}
                <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interface du chat - Responsive avec style authentique Tamkeen */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] max-w-[420px] h-[95vh] sm:h-[750px] bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl z-50 overflow-hidden border border-white/20 animate-in slide-in-from-right-8 duration-500 flex flex-col">
          {/* En-tête avec gradient Tamkeen */}
          <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-4 sm:p-6 flex-shrink-0">
            {/* Motif géométrique de fond */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rotate-45"></div>
              <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-4 left-12 w-6 h-6 bg-white/10 transform rotate-45"></div>
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  <img
                    src={imageLogo}
                    alt="Assistant Tamkeen"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white/50 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg">
                    Assistant Tamkeen
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Spécialiste en ligne
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Bouton Reset */}
                <button
                  onClick={resetConversation}
                  title="Nouvelle conversation"
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 bg-transparent">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 bg-transparent">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Zone des messages avec style Tamkeen */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-blue-50/30 min-h-0 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}>
                  <div
                    className={`max-w-[80%] ${
                      message.isBot ? "flex items-start space-x-3" : ""
                    }`}>
                    {message.isBot && (
                      <img
                        src={imageLogo}
                        alt="Tamkeen"
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-blue-200 flex-shrink-0 mt-1"
                      />
                    )}
                    <div
                      className={`px-3 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-lg ${
                        message.isBot
                          ? "bg-white border border-blue-100 text-gray-800 rounded-tl-sm"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-sm"
                      }`}>
                      <div className="text-xs sm:text-sm leading-relaxed">
                        {message.text}
                      </div>
                      <p
                        className={`text-xs mt-2 ${
                          message.isBot ? "text-gray-500" : "text-blue-100"
                        }`}>
                        {message.timestamp.toLocaleTimeString(i18n.language, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicateur de frappe élégant */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <img
                      src={imageLogo}
                      alt="Tamkeen"
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-blue-200 flex-shrink-0 mt-1"
                    />
                    <div className="bg-white border border-blue-100 px-3 py-2 sm:px-5 sm:py-3 rounded-2xl rounded-tl-sm shadow-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Actions rapides - Style authentique */}
          {messages.length <= 1 && (
            <div className="px-3 py-3 sm:px-6 sm:py-4 border-t border-gray-200 bg-white/80 flex-shrink-0">
              <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 font-medium">
                Actions rapides pour commencer :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleQuickAction(item.action, `action_${index}`)
                    }
                    className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 px-2 py-2 sm:px-3 sm:py-2 rounded-xl border border-blue-200 transition-all duration-200 text-left font-medium">
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zone de saisie moderne */}
          <div className="p-3 sm:p-6 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex space-x-2 sm:space-x-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  rows={1}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm resize-none bg-gray-50 hover:bg-white transition-colors duration-200"
                  style={{ minHeight: "40px", maxHeight: "80px" }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ""}
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
        </div>
      )}
    </>
  );
};

export default Chatbot;
