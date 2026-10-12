import { createApp } from './app.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const app = createApp({ webOrigin: config.webOrigin });

app.listen(config.port, '127.0.0.1', () => {
  process.stdout.write(`Dentora API listening on 127.0.0.1:${config.port}\n`);
});
