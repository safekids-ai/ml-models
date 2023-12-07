const { createServer } = require('vite');
const { resolve } = require('path');

async function start() {
  // Specify the path to your Vite project (dist folder)
  const rootDir = resolve(__dirname, 'dist');

  // Create a Vite server
  const server = await createServer({
    root: rootDir,
    server: {
      host: 'localhost',
    },
  });

  // Start the server
  await server.listen();
}

start().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
