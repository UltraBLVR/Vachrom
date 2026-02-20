const { Client, GatewayIntentBits, Collection } = require('discord.js');

class VachromClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ]
    });

    this.commands    = new Collection(); // slash commands
  }
}

module.exports = VachromClient;