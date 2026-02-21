const fs   = require('fs');
const path = require('path');
const log  = require('../util/logger');

module.exports = (client) => {
  const basePath = path.join(__dirname, '../command');
  const categories = fs.readdirSync(basePath);

  for (const category of categories) {
    const categoryPath = path.join(basePath, category);
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const command = require(path.join(categoryPath, file));

      if (!command.data || !command.execute) {
        log.warn(`Skipping ${file} — missing data or execute`);
        continue;
      }

      client.commands.set(command.data.name, command);
      log.cmd(`Loaded: ${command.data.name}`);
    }
  }
};