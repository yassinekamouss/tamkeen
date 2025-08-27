import React, { useState, useRef } from "react";
import imageLogo from "../assets/image_logo.webp";
import { useTranslation } from "react-i18next";
import { TamkeenChatService } from "../services/chatService";
import type { Message } from "./chatbot/types";
import LauncherButton from "./chatbot/LauncherButton";
import Header from "./chatbot/Header";
import MessagesList from "./chatbot/MessagesList";
import QuickActions from "./chatbot/QuickActions";
import InputBar from "./chatbot/InputBar";

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
  const chatService = useRef(TamkeenChatService.getInstance());

  // Réponses contextuelles remplacées par l'intégration OpenAI
  // No manual scroll anchor needed; the messages list is self-contained

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
      <LauncherButton
        isOpen={isOpen}
        imageSrc={imageLogo}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {/* Interface du chat - Responsive avec style authentique Tamkeen */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] max-w-[420px] h-[95vh] sm:h-[750px] bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl z-50 overflow-hidden border border-white/20 animate-in slide-in-from-right-8 duration-500 flex flex-col">
          <Header
            imageSrc={imageLogo}
            onReset={resetConversation}
            onClose={() => setIsOpen(false)}
          />
          <MessagesList
            messages={messages}
            isTyping={isTyping}
            imageSrc={imageLogo}
            locale={i18n.language}
          />
          <QuickActions
            items={quickActions}
            onAction={handleQuickAction}
            visible={messages.length <= 1}
          />
          <InputBar
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onEnterKey={handleKeyPress}
          />
        </div>
      )}
    </>
  );
};

export default Chatbot;
