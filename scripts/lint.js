const { execSync } = require("child_process");
const chalk = require("chalk");

try {
  execSync('"./node_modules/.bin/eslint" . --ext js,ts,tsx', {
    stdio: "inherit",
  });

  process.stderr.write(chalk.green("✅ Linting passed successfully!\n"));
} catch (error) {
  throw new Error(chalk.red("Linting failed with errors"));
}
