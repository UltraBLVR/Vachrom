const readline       = require('readline');
const log            = require('../util/logger');
const terminalHandler = require('../handler/terminalHandler');

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
  prompt: '\x1b[31mV\x1b[0mterminal \x1b[32m$\x1b[0m '
});

module.exports = (client) => {
  const commands = terminalHandler(client);

  rl.prompt();

  rl.on('line', async (line) => {
    const [name, ...args] = line.trim().split(' ');
    if (!name) return rl.prompt();

    const cmd = commands.get(name);

    if (!cmd) {
      log.error(`Unknown command: "${name}" — type help for a list`);
      return rl.prompt();
    }

    await cmd.execute(client, args);
    rl.prompt();
  });

  rl.on('close', async () => {
    log.info('Terminal closed. Shutting down...');
    await client.destroy();
    process.exit(0);
  });
};

module.exports.rl = rl;