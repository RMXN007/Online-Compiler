import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
}

function getLanguageExtension(lang?: string) {
  switch (lang) {
    case "javascript":
      return javascript({ jsx: false });
    case "typescript":
      return javascript({ typescript: true });
    case "cpp":
    case "c":
      return cpp();
    case "python":
      return python();
    case "bash":
      return StreamLanguage.define(shell);
    default:
      return javascript();
  }
}

const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent",
    color: "hsl(var(--foreground))",
  },
  ".cm-content": {
    caretColor: "hsl(var(--foreground))",
  },
  ".cm-cursor": {
    borderLeftColor: "hsl(var(--foreground))",
  },
  ".cm-gutters": {
    backgroundColor: "hsl(var(--muted) / 0.3)",
    color: "hsl(var(--muted-foreground))",
    border: "none",
    borderRight: "1px solid hsl(var(--border))",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "hsl(var(--accent) / 0.5)",
  },
  ".cm-activeLine": {
    backgroundColor: "hsl(var(--accent) / 0.15)",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "hsl(var(--primary) / 0.2) !important",
  },
  ".cm-focused .cm-selectionBackground": {
    backgroundColor: "hsl(var(--primary) / 0.25) !important",
  },
  ".cm-tooltip": {
    backgroundColor: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    color: "hsl(var(--popover-foreground))",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "hsl(var(--accent))",
    color: "hsl(var(--accent-foreground))",
  },
});

const baseEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  ".cm-scroller": {
    overflow: "auto",
    height: "100%",
    fontFamily: "inherit",
  },
  ".cm-content": {
    padding: "12px 0",
    minHeight: "100%",
  },
  ".cm-line": {
    padding: "0 16px",
  },
  ".cm-gutters": {
    paddingRight: "4px",
    minWidth: "3.5rem",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 8px",
  },
});

export function CodeEditor({ value, onChange, language, className }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartment = useRef(new Compartment());
  const langCompartment = useRef(new Compartment());
  const isInternalChange = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const isDark = () => document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (!containerRef.current) return;

    const dark = isDark();

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        langCompartment.current.of(getLanguageExtension(language)),
        themeCompartment.current.of(dark ? oneDark : lightTheme),
        baseEditorTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            isInternalChange.current = true;
            onChangeRef.current(update.state.doc.toString());
            isInternalChange.current = false;
          }
        }),
        EditorState.tabSize.of(2),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || isInternalChange.current) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: langCompartment.current.reconfigure(getLanguageExtension(language)),
    });
  }, [language]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const view = viewRef.current;
      if (!view) return;
      const dark = isDark();
      view.dispatch({
        effects: themeCompartment.current.reconfigure(dark ? oneDark : lightTheme),
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="code-editor-textarea"
      className={cn("h-full overflow-hidden", className)}
    />
  );
}
