const fs   = require('fs');
const path = require('path');
const logger = require('../util/logger.js');

module.exports = (client) => {
  const eventsPath = path.join(__dirname, '../event');
  const files = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const event = require(path.join(eventsPath, file));

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    logger.event(`Loaded: ${event.name}`);
  }
};