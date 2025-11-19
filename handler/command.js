const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    if (!client) throw new Error('A Discord client instance is required');

    const commandsPath = path.join(__dirname, '..', 'commands');
    const slashCommands = [];
    const rootFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

    for (const file of rootFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if (!command.name || !command.execute) {
            console.warn(`The command at ${filePath} is missing a required "name" or "execute" property.`);
            continue;
        }

        client.commands.set(command.name, command);
        if (command.data) slashCommands.push(command.data.toJSON());
        console.log(`Loaded command: ${command.name}`);
    }

    const categories = fs.readdirSync(commandsPath).filter(f => fs.statSync(path.join(commandsPath, f)).isDirectory());

    for (const category of categories) {
        const categoryPath = path.join(commandsPath, category);
        const commandFiles = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(categoryPath, file);
            const command = require(filePath);

            if (!command.name || !command.execute) {
                console.warn(`The command at ${filePath} is missing a required "name" or "execute" property.`);
                continue;
            }

            client.commands.set(command.name, command);
            if (command.data) slashCommands.push(command.data.toJSON());
            console.log(`Loaded command: ${command.name} from category: ${category}`);
        }
    }

    client.once('ready', () => {
        client.application.commands.set(slashCommands);
        console.log(`Registered ${slashCommands.length} slash commands`);
    });

    client.commandHandler = (commandName, ...args) => {
        const command = client.commands.get(commandName);
        if (!command) {
            console.error(`No command found with the name: ${commandName}`);
            return;
        }
        command.execute(...args);
    };
};