const fs   = require('fs');
const path = require('path');
const log  = require('../util/logger');

module.exports = () => {
  const commands = new Map();
  const terminalFolder = path.join(__dirname, '../terminal');
  const files = fs.readdirSync(terminalFolder).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const cmd = require(path.join(terminalFolder, file));
    if (!cmd.name || !cmd.execute) {
      log.warn(`Skipping terminal/${file} — missing name or execute`);
      continue;
    }
    commands.set(cmd.name, cmd);
    log.info(`Loaded terminal command: ${cmd.name}`);
  }

  return commands;
};