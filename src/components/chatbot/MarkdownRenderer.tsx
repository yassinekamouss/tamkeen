import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  const renderMarkdown = (text: string): React.ReactElement => {
    // Traitement séquentiel du markdown
    const elements: React.ReactElement[] = [];

    // Diviser en lignes pour traiter les blocs
    const lines = text.split("\n");

    lines.forEach((line, index) => {
      const key = `line-${index}`;

      // Gestion des titres
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={key}
            className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            {renderInlineMarkdown(line.substring(4))}
          </h3>
        );
        return;
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={key} className="text-xl font-bold text-gray-900 mt-4 mb-3">
            {renderInlineMarkdown(line.substring(3))}
          </h2>
        );
        return;
      }

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={key} className="text-2xl font-bold text-gray-900 mt-4 mb-3">
            {renderInlineMarkdown(line.substring(2))}
          </h1>
        );
        return;
      }

      // Gestion des listes
      if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <ul key={key} className="ml-4 mb-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>{renderInlineMarkdown(line.substring(2))}</span>
            </li>
          </ul>
        );
        return;
      }

      // Gestion des listes numérotées
      if (/^\d+\. /.test(line)) {
        const match = line.match(/^(\d+)\. (.*)$/);
        if (match) {
          elements.push(
            <ol key={key} className="ml-4 mb-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-medium">
                  {match[1]}.
                </span>
                <span>{renderInlineMarkdown(match[2])}</span>
              </li>
            </ol>
          );
          return;
        }
      }

      // Gestion des blocs de code
      if (line.startsWith("```")) {
        elements.push(
          <div
            key={key}
            className="bg-gray-100 border border-gray-300 rounded-lg p-3 mt-2 mb-2 font-mono text-sm">
            <code className="text-gray-800">Code Block</code>
          </div>
        );
        return;
      }

      // Ligne vide
      if (line.trim() === "") {
        elements.push(<br key={key} />);
        return;
      }

      // Paragraphe normal
      elements.push(
        <p key={key} className="mb-2 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });

    return <div className={className}>{elements}</div>;
  };

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Gras **text**
      const boldMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*(.*)$/);
      if (boldMatch) {
        if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
        parts.push(
          <strong key={key++} className="font-semibold text-gray-900">
            {boldMatch[2]}
          </strong>
        );
        remaining = boldMatch[3];
        continue;
      }

      // Italique *text*
      const italicMatch = remaining.match(/^(.*?)\*(.*?)\*(.*)$/);
      if (italicMatch && !remaining.includes("**")) {
        if (italicMatch[1])
          parts.push(<span key={key++}>{italicMatch[1]}</span>);
        parts.push(
          <em key={key++} className="italic">
            {italicMatch[2]}
          </em>
        );
        remaining = italicMatch[3];
        continue;
      }

      // Code inline `code`
      const codeMatch = remaining.match(/^(.*?)`(.*?)`(.*)$/);
      if (codeMatch) {
        if (codeMatch[1]) parts.push(<span key={key++}>{codeMatch[1]}</span>);
        parts.push(
          <code
            key={key++}
            className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
            {codeMatch[2]}
          </code>
        );
        remaining = codeMatch[3];
        continue;
      }

      // Liens [text](url)
      const linkMatch = remaining.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)$/);
      if (linkMatch) {
        if (linkMatch[1]) parts.push(<span key={key++}>{linkMatch[1]}</span>);
        parts.push(
          <a
            key={key++}
            href={linkMatch[3]}
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer">
            {linkMatch[2]}
          </a>
        );
        remaining = linkMatch[4];
        continue;
      }

      // Emails simples (auto-link) - capture la première occurrence
      const emailMatch = remaining.match(
        /^(.*?)([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})(.*)$/i
      );
      if (emailMatch) {
        if (emailMatch[1]) parts.push(<span key={key++}>{emailMatch[1]}</span>);
        const email = emailMatch[2];
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          email
        )}`;
        parts.push(
          <a
            key={key++}
            href={gmailUrl}
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
            title="Envoyer un email via Gmail">
            {email}
          </a>
        );
        remaining = emailMatch[3];
        continue;
      }

      // URLs simples (http/https) auto-link
      const urlMatch = remaining.match(
        /^(.*?)(https?:\/\/[\w.-]+(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?)(.*)$/i
      );
      if (urlMatch) {
        if (urlMatch[1]) parts.push(<span key={key++}>{urlMatch[1]}</span>);
        const url = urlMatch[2];
        parts.push(
          <a
            key={key++}
            href={url}
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir le lien">
            {url}
          </a>
        );
        remaining = urlMatch[3];
        continue;
      }

      // Emojis de base
      const emojiMatch = remaining.match(
        /^(.*?)(✅|❌|📋|💼|🏢|👤|📍|📊|💰)(.*)$/
      );
      if (emojiMatch) {
        if (emojiMatch[1]) parts.push(<span key={key++}>{emojiMatch[1]}</span>);
        parts.push(
          <span key={key++} className="text-lg">
            {emojiMatch[2]}
          </span>
        );
        remaining = emojiMatch[3];
        continue;
      }

      // Aucune correspondance, ajouter le reste
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  return renderMarkdown(content);
};

export default MarkdownRenderer;
