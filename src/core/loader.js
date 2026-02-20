const commandHandler   = require('../handler/commandHandler.js');
const eventHandler     = require('../handler/eventHandler.js');
const terminal         = require('./terminal.js');

module.exports = (client) => {
  commandHandler(client);
  eventHandler(client);
  terminal(client);
};