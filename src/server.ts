import dotenv from 'dotenv';
import app from './app.js';
import { initDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT !== undefined ? process.env.PORT : 3000;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is required');
      process.exit(1);
    }
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor rodando com sucesso na porta ${PORT}`);
      console.log(`URL base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Falha ao inicializar a aplicação:', error);
    process.exit(1);
  }
}

startServer();
