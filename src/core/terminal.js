const readline = require('readline');
const log      = require('../util/logger');

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
  prompt: '> '
});

module.exports = (client) => {
  rl.prompt();

  rl.on('line', async (line) => {
    const [cmd, ...args] = line.trim().split(' ');

    switch (cmd) {

      case 'help':
        console.log(`
  help          Show this menu
  info          Bot information
  stats         Bot statistics
  stop          Shut down the bot
        `);
        break;

      case 'info':
        log.info(`Name: ${client.user.tag}`);
        log.info(`ID: ${client.user.id}`);
        log.info(`Uptime: ${Math.floor(client.uptime / 60000)}m`);
        break;

      case 'stats':
        log.info(`Guilds: ${client.guilds.cache.size}`);
        log.info(`Users: ${client.users.cache.size}`);
        log.info(`Commands: ${client.commands.size}`);
        break;

      case 'stop':
        log.info('Shutting down Vachrom...');
        await client.destroy();
        log.success('Vachrom has been stopped')
        process.exit(0);
        break;
      
      case 'restart':
        log.info('Restarting Vachrom...');
        process.exit(1);
        break;


      case '':
        break;

      default:
        log.error(`Unknown command: "${cmd}" — type help for a list`);
    }

    rl.prompt();
  });

  rl.on('close', async () => {
    log.warn('Terminal closed. Shutting down...');
    await client.destroy();
    process.exit(0);
  });
};

module.exports.rl = rl;