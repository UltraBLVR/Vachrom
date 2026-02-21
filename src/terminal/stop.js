module.exports = {
    name: 'stop',
    description: 'Stops the client',
    async execute(client) {
        const log = require('../util/logger');
        log.info('Stopping client...');
        client.destroy();
        log.success('\x1b[1mClient\x1b[m has stopped successfully.');
        process.exit(0);
    }
}