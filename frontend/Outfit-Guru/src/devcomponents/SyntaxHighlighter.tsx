import React from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code }) => {
  const highlightJSON = (jsonString: string) => {
    return jsonString
      .replace(/(".*?")(\s*:)/g, '<span class="text-blue-400">$1</span><span class="text-white">$2</span>')
      .replace(/:\s*(".*?")/g, ': <span class="text-green-300">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-yellow-300">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-300">$1</span>')
      .replace(/([{}[\]])/g, '<span class="text-gray-300">$1</span>')
      .replace(/(,)/g, '<span class="text-gray-400">$1</span>');
  };

  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto max-h-[600px] overflow-y-auto">
      <code dangerouslySetInnerHTML={{ __html: highlightJSON(code) }} />
    </pre>
  );
};

export default SyntaxHighlighter;