import React from "react";
import type { Message } from "./types";
import MarkdownRenderer from "./MarkdownRenderer";

interface Props {
  messages: Message[];
  isTyping: boolean;
  imageSrc: string;
  locale: string;
}

const MessagesList: React.FC<Props> = ({
  messages,
  isTyping,
  imageSrc,
  locale,
}) => {
  return (
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
                  src={imageSrc}
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
                  {message.isBot ? (
                    <MarkdownRenderer
                      content={message.text}
                      className="chatbot-message"
                    />
                  ) : (
                    message.text
                  )}
                </div>
                <p
                  className={`text-xs mt-2 ${
                    message.isBot ? "text-gray-500" : "text-blue-100"
                  }`}>
                  {message.timestamp.toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <img
                src={imageSrc}
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
      <div />
    </div>
  );
};

export default React.memo(MessagesList);
