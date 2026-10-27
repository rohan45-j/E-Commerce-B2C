const { spawn, execSync } = require('child_process');
const net = require('net');
const path = require('path');

const PORT = 5433;
const DB_DIR = path.resolve(__dirname, '..', '.local_db');
const PG_BIN = 'C:\\Program Files\\PostgreSQL\\18\\bin\\postgres.exe';

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

async function ensureDb() {
  const open = await isPortOpen(PORT);
  if (open) {
    console.log(`[Database] PostgreSQL is already running on port ${PORT}.`);
    return;
  }

  console.log(`[Database] Starting dedicated PostgreSQL engine on port ${PORT}...`);
  const child = spawn(PG_BIN, ['-D', DB_DIR, '-p', String(PORT)], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();

  // Wait up to 10 seconds for DB to accept connections
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await isPortOpen(PORT)) {
      console.log(`[Database] PostgreSQL ready on port ${PORT}!`);
      return;
    }
  }
  console.warn('[Database] Database startup timed out, continuing anyway...');
}

ensureDb();
