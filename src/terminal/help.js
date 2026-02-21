module.exports = {
  name: 'help',
  description: 'Show all terminal commands',
  async execute(client, args) {
    console.log(`
  [Command]     |          [Description]           |
  ______________|__________________________________|
  help          | Show this menu.                  |
  info          | Bot information.                 |
  stats         | Bot statistics.                  |
  stop.         | Stops the client.                |
                |                                  |
  cmd <name>    | Shows info about a command.      |

    `);
  }
};