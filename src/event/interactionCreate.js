module.exports = {
  name: 'interactionCreate',
  once: false,
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    command.execute(interaction).catch(console.error);
  }
};