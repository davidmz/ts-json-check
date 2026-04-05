import { platform } from "node:os";
import { defineConfig } from "oxfmt";

export default defineConfig({
  $schema: "./node_modules/oxfmt/configuration_schema.json",
  trailingComma: "all",
  arrowParens: "always",
  printWidth: 80,
  sortPackageJson: false,
  ignorePatterns: [],
  endOfLine: platform() === "win32" ? "crlf" : "lf",
});
