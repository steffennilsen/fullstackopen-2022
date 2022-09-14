/* eslint-disable no-console */
const chalk = require('chalk');

const log = (...params) => {
  console.log(...params);
};

const success = (...params) => {
  console.log(chalk.green(...params));
};

const info = (...params) => {
  console.log(chalk.bgBlue.white(...params));
};

const warn = (...params) => {
  console.log(chalk.bgYellow.black(...params));
};

const error = (...params) => {
  console.error(chalk.bold.red(...params));
};

module.exports = {
  log, success, info, warn, error,
};