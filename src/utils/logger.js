import chalk from "chalk";

export const info = (msg, type) => console.log(chalk.blue(`${new Date().toISOString().replace("Z", "")}: [INFO] [${type.toUpperCase()}] ${msg}`))
export const warn = (msg, type) => console.log(chalk.yellow(`${new Date().toISOString().replace("Z", "")}: [WARN] [${type.toUpperCase()}] ${msg}`))
export const error = (msg, type) => console.log(chalk.red(`${new Date().toISOString().replace("Z", "")}: [ERROR] [${type.toUpperCase()}] ${msg}`))
export const success = (msg, type) => console.log(chalk.green(`${new Date().toISOString().replace("Z", "")}: [OK] [${type.toUpperCase()}] ${msg}`))