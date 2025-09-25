import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  language = 'bash',
  filename,
  showLineNumbers = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const lines = children.split('\n');

  return (
    <div className={`relative group ${className}`}>
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 text-sm bg-gray-800 text-gray-200 rounded-t-lg border-b border-gray-700">
          <span className="font-mono">{filename}</span>
          <span className="text-xs text-gray-400 uppercase">{language}</span>
        </div>
      )}
      
      <div className="relative">
        <pre className={`overflow-x-auto p-4 text-sm bg-gray-900 text-gray-100 ${
          filename ? 'rounded-b-lg' : 'rounded-lg'
        }`}>
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <table className="w-full">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="pr-4 text-gray-500 text-right select-none w-8 align-top">
                        {index + 1}
                      </td>
                      <td className="w-full">
                        {line || '\n'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              children
            )}
          </code>
        </pre>
        
        <button
          onClick={copyToClipboard}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-md transition-colors opacity-0 group-hover:opacity-100"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

interface InlineCodeProps {
  children: string;
  className?: string;
}

export const InlineCode: React.FC<InlineCodeProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <code className={`px-1.5 py-0.5 text-sm font-mono bg-gray-100 text-gray-800 rounded ${className}`}>
      {children}
    </code>
  );
};

export default CodeBlock;