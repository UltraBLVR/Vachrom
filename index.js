const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const eventHandler = require('./handler/event');
const cmdHandler = require('./handler/command');

const client = new Client( {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
} );

client.commands = new Collection();

cmdHandler(client);
eventHandler(client);
client.login(process.env.BOT_TOKEN);