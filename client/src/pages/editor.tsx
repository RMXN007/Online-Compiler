import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Square,
  Trash2,
  Copy,
  Check,
  Terminal,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Download,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface Language {
  id: string;
  name: string;
  label: string;
  defaultCode: string;
  fileExtension: string;
  color: string;
  accentColor: string;
}

interface ExecuteResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  language: string;
}

interface EditorPageProps {
  language: Language;
}

export function EditorPage({ language }: EditorPageProps) {
  const { toast } = useToast();
  const [code, setCode] = useState(language.defaultCode);
  const [output, setOutput] = useState<ExecuteResult | null>(null);
  const [outputPanelHeight, setOutputPanelHeight] = useState(220);
  const [copied, setCopied] = useState(false);
  const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);

  const executeMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/execute", {
        code,
        language: language.id,
      });
      return res.json() as Promise<ExecuteResult>;
    },
    onSuccess: (data) => {
      setOutput(data);
      setIsOutputCollapsed(false);
    },
    onError: (err: any) => {
      toast({
        title: "Execution failed",
        description: err.message || "An error occurred while running the code.",
        variant: "destructive",
      });
    },
  });

  const handleRun = useCallback(() => {
    if (!code.trim()) {
      toast({ title: "No code to run", description: "Write some code first." });
      return;
    }
    executeMutation.mutate(code);
  }, [code, executeMutation]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  const handleClear = useCallback(() => {
    setCode("");
    setOutput(null);
  }, []);

  const handleReset = useCallback(() => {
    setCode(language.defaultCode);
    setOutput(null);
  }, [language.defaultCode]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code${language.fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, language.fileExtension]);

  const hasOutput = output !== null;
  const isSuccess = output?.exitCode === 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold", language.accentColor)}>
            <span>{language.label}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {code.split("\n").length} lines · {code.length} chars
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            data-testid="button-copy"
            title="Copy code"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleReset}
            data-testid="button-reset"
            title="Reset to default"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDownload}
            data-testid="button-download"
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClear}
            data-testid="button-clear"
            title="Clear editor"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-5 mx-1" />
          <Button
            onClick={handleRun}
            disabled={executeMutation.isPending}
            data-testid="button-run"
            className="gap-1.5 px-4 font-semibold"
          >
            {executeMutation.isPending ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current animate-pulse" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor + Output split */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Code Editor */}
        <div
          className="flex-1 overflow-hidden bg-card"
          style={{ minHeight: 0 }}
        >
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language.id}
            placeholder={`// Write your ${language.name} code here...`}
            className="h-full border-none"
          />
        </div>

        {/* Output Panel */}
        <div
          className="flex-shrink-0 border-t border-border bg-card flex flex-col"
          style={{ height: isOutputCollapsed ? 40 : outputPanelHeight }}
        >
          {/* Output header */}
          <div
            className="flex items-center justify-between px-4 h-10 flex-shrink-0 border-b border-border cursor-pointer select-none"
            onClick={() => setIsOutputCollapsed((v) => !v)}
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output</span>
              {hasOutput && (
                <div className="flex items-center gap-2">
                  {isSuccess ? (
                    <Badge variant="outline" className="h-5 text-[10px] gap-1 text-green-600 dark:text-green-400 border-green-300 dark:border-green-800">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Exit 0
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="h-5 text-[10px] gap-1 text-destructive border-destructive/30">
                      <AlertCircle className="h-2.5 w-2.5" />
                      Exit {output?.exitCode}
                    </Badge>
                  )}
                  {output?.executionTime !== undefined && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {output.executionTime}ms
                    </span>
                  )}
                </div>
              )}
              {executeMutation.isPending && (
                <Badge variant="outline" className="h-5 text-[10px] animate-pulse">
                  Running...
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {hasOutput && !isOutputCollapsed && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOutput(null);
                  }}
                  data-testid="button-clear-output"
                  title="Clear output"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              {isOutputCollapsed ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Output content */}
          {!isOutputCollapsed && (
            <div className="flex-1 overflow-auto">
              {!hasOutput && !executeMutation.isPending ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 py-8">
                  <Terminal className="h-8 w-8 opacity-20" />
                  <p className="text-sm">Run your code to see output</p>
                </div>
              ) : executeMutation.isPending ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 py-8">
                  <div className="flex gap-1">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <p className="text-sm">Executing {language.name} code...</p>
                </div>
              ) : (
                <div className="p-4">
                  {output?.stdout && (
                    <div>
                      <pre className="terminal-output text-foreground whitespace-pre-wrap break-all">
                        {output.stdout}
                      </pre>
                    </div>
                  )}
                  {output?.stderr && (
                    <div className={output?.stdout ? "mt-3 pt-3 border-t border-border" : ""}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-destructive mb-1.5">
                        stderr
                      </p>
                      <pre className="terminal-output text-destructive whitespace-pre-wrap break-all">
                        {output.stderr}
                      </pre>
                    </div>
                  )}
                  {!output?.stdout && !output?.stderr && (
                    <p className="terminal-output text-muted-foreground italic">
                      (no output)
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
