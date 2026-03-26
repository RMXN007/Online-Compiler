import { Settings, Moon, Sun, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ] as const;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-semibold text-base">Settings</h1>
            <p className="text-xs text-muted-foreground">Configure your editor preferences</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-xl space-y-6">
          <Card className="p-5">
            <h2 className="font-semibold text-sm mb-1">Appearance</h2>
            <p className="text-xs text-muted-foreground mb-4">Customize how the editor looks</p>
            <Separator className="mb-4" />

            <div>
              <p className="text-sm font-medium mb-3">Theme</p>
              <div className="flex gap-3">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    data-testid={`button-theme-${value}`}
                    className={cn(
                      "flex flex-col items-center gap-2 px-6 py-4 rounded-md border-2 transition-colors cursor-pointer",
                      theme === value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted/30 hover-elevate"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", theme === value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", theme === value ? "text-primary" : "text-muted-foreground")}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-sm mb-1">About</h2>
            <p className="text-xs text-muted-foreground mb-4">CodeRunner runtime environment</p>
            <Separator className="mb-4" />

            <div className="space-y-3">
              {[
                { label: "Version", value: "1.0.0" },
                { label: "JavaScript Runtime", value: "Node.js 20" },
                { label: "C++ Compiler", value: "GCC 13.2.0" },
                { label: "TypeScript", value: "5.x" },
                { label: "Shell", value: "Bash 5.2" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-mono font-medium bg-muted px-2 py-0.5 rounded">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
