const colors = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  gray:    '\x1b[90m',
};

const timestamp = () => {
  const now = new Date();
  return `${colors.gray}[${now.toLocaleTimeString()}]${colors.reset}`;
};

const label = (text, color) => `${color}${colors.bold}[${text}]${colors.reset}`;

const print = (fn, ...msg) => {
  fn(timestamp(), ...msg);

  // Re-prompt after logging if terminal is active
  try {
    const { rl } = require('../core/terminal');
    if (rl) rl.prompt(true); // true = keeps current line clean
  } catch (_) {}
};

const log = {
  info:    (...msg) => print(console.log,   label('INFO', colors.cyan),    ...msg),
  success: (...msg) => print(console.log,   label('SUCCESS',   colors.green),   ...msg),
  warn:    (...msg) => print(console.warn,  label('WARN', colors.yellow),  ...msg),
  error:   (...msg) => print(console.error, label('ERROR',  colors.red),     ...msg),
  event:   (...msg) => print(console.log,   label('EVENT',  colors.magenta), ...msg),
  bot:     (...msg) => print(console.log,   label('BOT',  colors.blue),    ...msg),
  cmd:     (...msg) => print(console.log,   label('CMD',  colors.blue),    ...msg),
};

module.exports = log;