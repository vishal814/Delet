const createApp = require('./app');
const config = require('./config/env');
const { connectToDatabase } = require('./config/database');

async function start() {
  try {
    await connectToDatabase();
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
