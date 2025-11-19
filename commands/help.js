module.exports = {
    name: 'help',
    description: 'Show all available commands',
    execute(message, args) {
        const commands = message.client.commands;
        
        const embed = {
            color: 0x0099ff,
            title: 'Vachrom Bot Commands',
            fields: [
                {
                    name: '🛡️ Moderation',
                    value: '`!kick @user [reason]` - Kick a member\n`!ban @user [reason]` - Ban a member',
                    inline: false
                },
                {
                    name: '🎮 Games',
                    value: '`!8ball <question>` - Ask the magic 8-ball\n`!dice [sides]` - Roll a dice',
                    inline: false
                },
                {
                    name: '⚙️ Utility',
                    value: '`!ping` - Check bot latency\n`!help` - Show this message',
                    inline: false
                }
            ]
        };
        
        message.reply({ embeds: [embed] });
    }
};