import { BookOpen, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const SNIPPETS = [
  {
    title: "Hello World",
    language: "javascript",
    label: "JS",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    code: `console.log("Hello, World!");`,
    description: "The classic first program",
    url: "/",
  },
  {
    title: "Fibonacci Sequence",
    language: "javascript",
    label: "JS",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    code: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nfor (let i = 0; i <= 10; i++) {\n  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);\n}`,
    description: "Recursive Fibonacci numbers",
    url: "/",
  },
  {
    title: "Type-Safe Function",
    language: "typescript",
    label: "TS",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    code: `interface User {\n  name: string;\n  age: number;\n}\n\nfunction greet(user: User): string {\n  return \`Hello, \${user.name}! You are \${user.age} years old.\`;\n}\n\nconst user: User = { name: "Alice", age: 30 };\nconsole.log(greet(user));`,
    description: "TypeScript interfaces and types",
    url: "/typescript",
  },
  {
    title: "Vector Operations",
    language: "cpp",
    label: "C++",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    code: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n  std::vector<int> v = {5, 3, 8, 1, 9, 2};\n  std::sort(v.begin(), v.end());\n  \n  std::cout << "Sorted: ";\n  for (int x : v) {\n    std::cout << x << " ";\n  }\n  std::cout << std::endl;\n  return 0;\n}`,
    description: "STL vectors and algorithms",
    url: "/cpp",
  },
  {
    title: "List Comprehension",
    language: "python",
    label: "PY",
    color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    code: `# List comprehension examples\nsquares = [x**2 for x in range(1, 11)]\nprint("Squares:", squares)\n\nevens = [x for x in range(1, 21) if x % 2 == 0]\nprint("Evens:", evens)`,
    description: "Python list comprehensions",
    url: "/python",
  },
  {
    title: "File Listing",
    language: "bash",
    label: "SH",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    code: `#!/bin/bash\n\necho "Current directory: $(pwd)"\necho "Files:"\nls -la 2>/dev/null | head -20\necho ""\necho "System info:"\nuname -a`,
    description: "Basic shell scripting",
    url: "/bash",
  },
];

export default function SnippetsPage() {
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-semibold text-base">Code Snippets</h1>
            <p className="text-xs text-muted-foreground">Ready-to-use examples for each language</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {SNIPPETS.map((snippet, i) => (
            <Card
              key={i}
              className="p-4 cursor-pointer hover-elevate"
              data-testid={`snippet-${snippet.language}-${i}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{snippet.title}</h3>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${snippet.color}`}>
                      {snippet.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{snippet.description}</p>
                </div>
              </div>
              <pre className="text-xs bg-muted/50 rounded-md p-3 overflow-hidden text-muted-foreground font-mono line-clamp-3 leading-relaxed">
                {snippet.code}
              </pre>
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => navigate(snippet.url)}
                  data-testid={`button-open-snippet-${i}`}
                >
                  <Code2 className="h-3 w-3" />
                  Open in Editor
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
