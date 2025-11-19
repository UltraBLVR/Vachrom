module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.content.startsWith('?')) return;
        
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = client.commands.get(commandName);
        if (!command) return;
        
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing this command!');
        }
    });
};