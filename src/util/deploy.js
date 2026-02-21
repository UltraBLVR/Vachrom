require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs   = require('fs');
const path = require('path');
const log  = require('../util/logger');

const commands = [];
const basePath = path.join(__dirname, '../command');

// Load all commands
const categories = fs.readdirSync(basePath);
for (const category of categories) {
  const files = fs.readdirSync(path.join(basePath, category)).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(basePath, category, file));
    if (!command.data || !command.execute) continue;
    commands.push(command.data.toJSON());
    log.cmd(`Queued: ${command.data.name}`);
  }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    log.info(`Deploying ${commands.length} command(s)...`);

    // This overwrites ALL registered commands with only the current ones
    // meaning removed commands are automatically cleared
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    log.success('Commands deployed successfully!');
  } catch (err) {
    log.error('Failed to deploy commands:', err.message);
  }
})();