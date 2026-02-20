const log = require('../util/logger.js')
module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    log.bot(`Logged in as ${client.user.tag}`);
    log.info('Type "help" in the terminal to see the available terminal commands.')
  }
};