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
      const response = await chatService.current.sendMessage(inputValue);
      const sanitized = sanitizeBotText(response);

      const botMessage: Message = {
        id: Date.now() + 1,
        text: sanitized,
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
      const sanitized = sanitizeBotText(response);

      const botMessage: Message = {
        id: Date.now() + 1,
        text: sanitized,
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
      text: "📋 Programmes référencés",
      action: "Quels sont les programmes de subventions référencés ?",
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

  function sanitizeBotText(text: string): string {
    if (!text) return text;
    const replacements: { pattern: RegExp; replacement: string }[] = [
      {
        pattern: /\b[Nn]os programmes disponibles\b/g,
        replacement: "programmes référencés",
      },
      {
        pattern: /\b[Nn]os programmes\b/g,
        replacement: "programmes référencés",
      },
      {
        pattern: /\b[Nn]os subventions\b/g,
        replacement: "programmes publics référencés",
      },
      {
        pattern: /our available programs/gi,
        replacement: "programs referenced by Tamkeen",
      },
      {
        pattern: /our programs/gi,
        replacement: "programs referenced by Tamkeen",
      },
    ];
    let out = text;
    replacements.forEach((r) => {
      out = out.replace(r.pattern, r.replacement);
    });
    return out;
  }

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

      {isOpen && (
        <div
          className="fixed z-50 overflow-hidden bg-white/95 backdrop-blur-lg shadow-2xl border border-white/20 animate-in slide-in-from-right-8 duration-500 flex flex-col
          /* Layout Mobile: ancré à gauche et à droite avec marges, hauteur limitée */
          bottom-4 left-4 right-4 h-[85vh] rounded-2xl
          /* Layout Desktop: largeur fixe, ancré à droite uniquement */
          sm:left-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:max-w-[420px] sm:h-[750px] sm:max-h-[calc(100vh-100px)] sm:rounded-3xl">
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
