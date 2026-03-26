import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
}

export function CodeEditor({ value, onChange, language, placeholder, className }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = (value || "").split("\n").length;
    setLineCount(Math.max(lines, 1));
  }, [value]);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : "";

      let extraIndent = "";
      const trimmed = currentLine.trimEnd();
      if (trimmed.endsWith("{") || trimmed.endsWith("(") || trimmed.endsWith("[") || trimmed.endsWith(":")) {
        extraIndent = "  ";
      }

      const newValue = value.substring(0, start) + "\n" + indent + extraIndent + value.substring(start);
      onChange(newValue);
      requestAnimationFrame(() => {
        const newPos = start + 1 + indent.length + extraIndent.length;
        textarea.selectionStart = textarea.selectionEnd = newPos;
      });
    }
  };

  return (
    <div className={cn("relative flex overflow-hidden rounded-md", className)}>
      <div
        ref={lineNumbersRef}
        className="line-numbers flex-shrink-0 text-right px-3 py-4 text-muted-foreground bg-muted/30 select-none overflow-hidden border-r border-border min-w-[3.5rem]"
        style={{ lineHeight: "1.6" }}
        aria-hidden="true"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} className="text-xs leading-6">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-testid="code-editor-textarea"
        className={cn(
          "code-editor flex-1 resize-none bg-transparent outline-none px-4 py-4 text-foreground placeholder:text-muted-foreground/50 overflow-auto",
          "min-h-full w-full"
        )}
        style={{ lineHeight: "1.6", tabSize: 2 }}
      />
    </div>
  );
}
