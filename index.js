const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const eventHandler = require('./handler/event');
const cmdHandler = require('./handler/command');
const msgHandler = require('./handler/message');

const client = new Client( {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
} );

client.commands = new Collection();

cmdHandler(client);
eventHandler(client);
msgHandler(client);
client.login(process.env.BOT_TOKEN);