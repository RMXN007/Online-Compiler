import type { Express } from "express";
import { createServer, type Server } from "http";
import { exec } from "child_process";
import { writeFile, unlink, mkdtemp } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { z } from "zod";

const executeSchema = z.object({
  code: z.string().min(1).max(50000),
  language: z.enum(["javascript", "typescript", "c", "cpp", "python", "bash"]),
});

function runCommand(cmd: string, timeout = 10000): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    const proc = exec(cmd, { timeout, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      resolve({
        stdout: stdout || "",
        stderr: stderr || "",
        exitCode: err ? (err.code as number ?? 1) : 0,
      });
    });
  });
}

async function withTempDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), "coderunner-"));
  try {
    return await fn(dir);
  } finally {
    try {
      await runCommand(`rm -rf "${dir}"`);
    } catch {}
  }
}

async function executeJavaScript(code: string) {
  return withTempDir(async (dir) => {
    const file = join(dir, "code.js");
    await writeFile(file, code, "utf-8");
    return runCommand(`node --harmony "${file}"`, 10000);
  });
}

async function executeTypeScript(code: string) {
  return withTempDir(async (dir) => {
    const file = join(dir, "code.ts");
    await writeFile(file, code, "utf-8");
    const tsxBin = join(process.cwd(), "node_modules/.bin/tsx");
    return runCommand(`"${tsxBin}" "${file}"`, 15000);
  });
}

async function executeC(code: string) {
  return withTempDir(async (dir) => {
    const srcFile = join(dir, "code.c");
    const outFile = join(dir, "code");
    await writeFile(srcFile, code, "utf-8");

    const compileResult = await runCommand(`gcc -O2 -o "${outFile}" "${srcFile}" -lm 2>&1`, 30000);
    if (compileResult.exitCode !== 0) {
      return {
        stdout: "",
        stderr: compileResult.stdout || compileResult.stderr,
        exitCode: compileResult.exitCode,
      };
    }
    return runCommand(`"${outFile}"`, 10000);
  });
}

async function executeCpp(code: string) {
  return withTempDir(async (dir) => {
    const srcFile = join(dir, "code.cpp");
    const outFile = join(dir, "code");
    await writeFile(srcFile, code, "utf-8");

    const compileResult = await runCommand(`g++ -O2 -o "${outFile}" "${srcFile}" 2>&1`, 30000);
    if (compileResult.exitCode !== 0) {
      return {
        stdout: "",
        stderr: compileResult.stdout || compileResult.stderr,
        exitCode: compileResult.exitCode,
      };
    }
    return runCommand(`"${outFile}"`, 10000);
  });
}

async function executePython(code: string) {
  const { stdout: checkStdout, stderr: checkStderr } = await runCommand("which python3 || which python 2>&1", 3000);
  const pythonBin = checkStdout.trim() || "python3";

  if (!checkStdout.trim()) {
    return {
      stdout: "",
      stderr: "Python 3 is not installed in this environment. Try JavaScript, TypeScript, C++, or Bash instead.",
      exitCode: 127,
    };
  }

  return withTempDir(async (dir) => {
    const file = join(dir, "code.py");
    await writeFile(file, code, "utf-8");
    return runCommand(`${pythonBin} "${file}"`, 10000);
  });
}

async function executeBash(code: string) {
  return withTempDir(async (dir) => {
    const file = join(dir, "code.sh");
    await writeFile(file, code, "utf-8");
    return runCommand(`bash "${file}"`, 10000);
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/execute", async (req, res) => {
    const parse = executeSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid request", details: parse.error.format() });
    }

    const { code, language } = parse.data;
    const startTime = Date.now();

    try {
      let result: { stdout: string; stderr: string; exitCode: number };

      switch (language) {
        case "javascript":
          result = await executeJavaScript(code);
          break;
        case "typescript":
          result = await executeTypeScript(code);
          break;
        case "c":
          result = await executeC(code);
          break;
        case "cpp":
          result = await executeCpp(code);
          break;
        case "python":
          result = await executePython(code);
          break;
        case "bash":
          result = await executeBash(code);
          break;
        default:
          return res.status(400).json({ error: "Unsupported language" });
      }

      const executionTime = Date.now() - startTime;

      return res.json({
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        executionTime,
        language,
      });
    } catch (err: any) {
      return res.status(500).json({
        error: "Execution failed",
        message: err.message,
      });
    }
  });

  return httpServer;
}
