module.exports = {
    name: 'info',
    description: 'Gives you information about the bot.',
    async execute(client, args) {
        const { log, colors } = require('../util/logger');
        const { name, version } = require('../../package.json');
        const djsv = require('discord.js').version;
        const nodev = process.version;

        console.log(`\x1b[1m● BOT INFORMATION \x1b[0m`);
        console.log(`\x1b[32mName:\x1b[0m ${name}`);
        console.log(`\x1b[32mVersion:\x1b[0m ${version}`);
        console.log(`\x1b[34mDiscord.js Version:\x1b[0m ${djsv}`);
        console.log(`\x1b[33mNode.js Version:\x1b[0m ${nodev}`);
    }
}