const { spawn } = require('child_process');
const child = spawn('npx', ['tsx', 'server.ts'], { env: process.env, stdio: 'pipe' });
child.stdout.on('data', data => console.log(data.toString()));
child.stderr.on('data', data => console.error(data.toString()));
