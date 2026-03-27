import React, { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'tsx', className }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function highlight() {
      try {
        const result = await codeToHtml(code, {
          lang: language,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        });

        if (isMounted) {
          setHtml(result);
        }
      } catch (error) {
        console.error('Failed to highlight code:', error);
      }
    }

    highlight();

    return () => {
      isMounted = false;
    };
  }, [code, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group rounded-md overflow-hidden border bg-muted/30", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm hover:bg-background/80"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </Button>
      {html ? (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="text-sm p-4 overflow-x-auto [&>pre]:!bg-transparent [&>pre]:m-0"
        />
      ) : (
        <pre className="p-4 text-sm font-mono overflow-x-auto m-0">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
