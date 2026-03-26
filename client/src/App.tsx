import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { EditorPage } from "@/pages/editor";
import SnippetsPage from "@/pages/snippets";
import SettingsPage from "@/pages/settings";
import { useTheme } from "@/hooks/use-theme";
import { Code2, FileCode, Cpu, Zap, Terminal } from "lucide-react";

const LANGUAGES = {
  javascript: {
    id: "javascript",
    name: "JavaScript",
    label: "JavaScript",
    fileExtension: ".js",
    color: "text-yellow-500 dark:text-yellow-400",
    accentColor: "bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    defaultCode: `// Welcome to JavaScript!
// Press Run to execute your code

const greet = (name) => {
  return \`Hello, \${name}! 👋\`;
};

console.log(greet("World"));

// Try more JavaScript:
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);
`,
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    label: "TypeScript",
    fileExtension: ".ts",
    color: "text-blue-500 dark:text-blue-400",
    accentColor: "bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    defaultCode: `// Welcome to TypeScript!
// Full type safety in your code

interface Point {
  x: number;
  y: number;
}

function distance(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

const origin: Point = { x: 0, y: 0 };
const point: Point = { x: 3, y: 4 };

console.log(\`Distance: \${distance(origin, point)}\`);

// Generic functions
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const nums = [10, 20, 30];
const strs = ["hello", "world"];
console.log("First number:", first(nums));
console.log("First string:", first(strs));
`,
  },
  cpp: {
    id: "cpp",
    name: "C++",
    label: "C++",
    fileExtension: ".cpp",
    color: "text-purple-500 dark:text-purple-400",
    accentColor: "bg-purple-100/80 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    defaultCode: `// Welcome to C++!
// Compiled with GCC

#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    std::cout << "Hello from C++!" << std::endl;
    
    // Factorial examples
    for (int i = 1; i <= 8; i++) {
        std::cout << i << "! = " << factorial(i) << std::endl;
    }
    
    // STL vectors
    std::vector<int> v = {5, 2, 8, 1, 9, 3};
    std::sort(v.begin(), v.end());
    
    std::cout << "Sorted: ";
    for (int x : v) {
        std::cout << x << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
`,
  },
  python: {
    id: "python",
    name: "Python",
    label: "Python",
    fileExtension: ".py",
    color: "text-green-500 dark:text-green-400",
    accentColor: "bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    defaultCode: `# Welcome to Python!
# Simple and elegant code

def fibonacci(n):
    """Generate Fibonacci sequence up to n terms."""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print("Hello from Python!")
print()

# Fibonacci
print("Fibonacci sequence:")
fib = list(fibonacci(10))
print(fib)

# List comprehension
squares = [x**2 for x in range(1, 11)]
print("Squares:", squares)

# Dictionary
word_count = {}
text = "the quick brown fox jumps over the lazy dog"
for word in text.split():
    word_count[word] = word_count.get(word, 0) + 1

print("Word 'the' appears:", word_count.get("the", 0), "times")
`,
  },
  bash: {
    id: "bash",
    name: "Bash",
    label: "Bash / Shell",
    fileExtension: ".sh",
    color: "text-orange-500 dark:text-orange-400",
    accentColor: "bg-orange-100/80 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    defaultCode: `#!/bin/bash
# Welcome to Bash scripting!

echo "=== System Information ==="
echo "User: $(whoami)"
echo "Date: $(date)"
echo "Shell: $SHELL"
echo ""

echo "=== Simple Loop ==="
for i in {1..5}; do
    echo "Iteration $i: $(echo "scale=4; $i * 3.14159" | bc 2>/dev/null || echo "$((i * 3))")"
done

echo ""
echo "=== String Operations ==="
greeting="Hello, World!"
echo "Original: $greeting"
echo "Length: \${#greeting}"
echo "Uppercase: $(echo "$greeting" | tr '[:lower:]' '[:upper:]')"

echo ""
echo "=== Done! ==="
`,
  },
};

function AppContent() {
  useTheme();

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-3 h-10 border-b border-border bg-card flex-shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-hidden">
            <Switch>
              <Route path="/" component={() => <EditorPage language={LANGUAGES.javascript} />} />
              <Route path="/typescript" component={() => <EditorPage language={LANGUAGES.typescript} />} />
              <Route path="/cpp" component={() => <EditorPage language={LANGUAGES.cpp} />} />
              <Route path="/python" component={() => <EditorPage language={LANGUAGES.python} />} />
              <Route path="/bash" component={() => <EditorPage language={LANGUAGES.bash} />} />
              <Route path="/snippets" component={SnippetsPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
