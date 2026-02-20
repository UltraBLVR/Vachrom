require('dotenv').config();

const VachromClient = require('./src/core/client');
const loader        = require('./src/core/loader');

const client = new VachromClient();

loader(client);

client.login(process.env.TOKEN);