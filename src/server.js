const app = require('./app');
const config = require('./config/env');
const { initializeDatabase } = require('./models/initModels');

async function start() {
  try {
    await initializeDatabase();
    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`API Empleos Inclusivos escuchando en el puerto ${config.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

start();


