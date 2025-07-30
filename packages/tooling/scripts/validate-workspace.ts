
import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, '../../../');
const WORKSPACE_FILE = join(ROOT, 'pnpm-workspace.yaml');

const content = fs.readFileSync(WORKSPACE_FILE, 'utf-8');


function readJSON(filePath: string) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    return null;
  }
}

function readYAMLPaths(): string[] {
  const content = fs.readFileSync(WORKSPACE_FILE, 'utf-8');
  const match = content.match(/packages:\s*([\s\S]+)/);
  if (!match) return [];

  const lines = match[1]
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^-\s*/, ''))
    .filter(Boolean);

  return lines;
}

function isValidTSConfig(tsconfigPath: string) {
  const tsconfig = readJSON(tsconfigPath);
  return tsconfig?.extends === './tsconfig.base.json' || tsconfig?.extends?.endsWith('/tsconfig.base.json');
}

function main() {
  const workspacePaths = readYAMLPaths();
  const projectPaths = glob.sync('{apps,packages}/*', { cwd: ROOT, onlyDirectories: true });

  const issues: string[] = [];

  for (const project of projectPaths) {
    const projectPath = path.join(ROOT, project);
    const pkgPath = path.join(projectPath, 'package.json');
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');

    // Check package.json exists and is valid
    if (!fs.existsSync(pkgPath)) {
      issues.push(`[${project}] missing package.json`);
      continue;
    }

    const pkg = readJSON(pkgPath);
    if (!pkg?.name) {
      issues.push(`[${project}] package.json missing "name" field`);
    }

    // Check tsconfig extends base
    if (!fs.existsSync(tsconfigPath)) {
      issues.push(`[${project}] missing tsconfig.json`);
    } else if (!isValidTSConfig(tsconfigPath)) {
      issues.push(`[${project}] tsconfig.json does not extend base`);
    }

    // Check workspace inclusion
    const declaredInWorkspace = workspacePaths.some((pattern) => {
      const resolved = glob.sync(pattern, { cwd: ROOT, onlyDirectories: true });
      return resolved.includes(project);
    });
    if (!declaredInWorkspace) {
      issues.push(`[${project}] is not listed in pnpm-workspace.yaml`);
    }
  }

  if (issues.length === 0) {
    console.log('✅ Workspace looks good.');
  } else {
    console.error('❌ Workspace issues found:');
    issues.forEach((issue) => console.error('-', issue));
    process.exitCode = 1;
  }
}

main();