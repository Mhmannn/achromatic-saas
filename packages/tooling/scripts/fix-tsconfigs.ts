// tooling/scripts/fix-tsconfigs.ts

import fs from "fs";
import path from "path";

const baseConfig = {
  extends: "../../tsconfig.base.json",
  compilerOptions: {
    module: "ESNext",
    moduleResolution: "Bundler",
    target: "ESNext",
    allowJs: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    skipLibCheck: true,
    resolveJsonModule: true,
    isolatedModules: true,
    allowSyntheticDefaultImports: true,
    types: ["node"]
  },
  include: ["./**/*"],
  exclude: ["node_modules", "dist", "build", ".next"]
};

const ROOT = path.resolve(__dirname, "../../..");

const workspaceDirs = ["apps", "packages"];

workspaceDirs.forEach((group) => {
  const groupPath = path.join(ROOT, group);
  if (!fs.existsSync(groupPath)) return;

  fs.readdirSync(groupPath).forEach((pkg) => {
    const pkgPath = path.join(groupPath, pkg);
    const tsconfigPath = path.join(pkgPath, "tsconfig.json");

    if (!fs.existsSync(pkgPath) || !fs.statSync(pkgPath).isDirectory()) return;

    if (!fs.existsSync(tsconfigPath)) {
      fs.writeFileSync(tsconfigPath, JSON.stringify(baseConfig, null, 2) + "\n");
      console.log(`🆕 Created tsconfig.json in ${group}/${pkg}`);
    } else {
      const existing = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
      const needsFix =
        !existing.extends || existing.extends !== "../../tsconfig.base.json";

      if (needsFix) {
        existing.extends = "../../tsconfig.base.json";
        fs.writeFileSync(tsconfigPath, JSON.stringify(existing, null, 2) + "\n");
        console.log(`✅ Updated extends in ${group}/${pkg}/tsconfig.json`);
      }
    }
  });
});
