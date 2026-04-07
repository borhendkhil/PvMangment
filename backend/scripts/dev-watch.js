const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const srcDir = path.join(__dirname, '..', 'src');
let child = null;
let restartTimer = null;

function start() {
  child = spawn(
    process.execPath,
    [
      '-r',
      'reflect-metadata',
      '-r',
      'ts-node/register/transpile-only',
      '-r',
      'tsconfig-paths/register',
      path.join('src', 'main.ts'),
    ],
    {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: false,
    },
  );

  child.on('exit', (code, signal) => {
    if (signal === 'SIGINT' || signal === 'SIGTERM') {
      process.exit(0);
    }
    if (code && code !== 0) {
      console.log(`Backend process exited with code ${code}`);
    }
  });
}

function restart() {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    if (child && !child.killed) {
      child.kill();
    }
    start();
  }, 200);
}

start();

fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
  if (!filename) {
    return;
  }
  if (filename.endsWith('.ts') || filename.endsWith('.json')) {
    restart();
  }
});

process.on('SIGINT', () => {
  if (child && !child.killed) {
    child.kill('SIGINT');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (child && !child.killed) {
    child.kill('SIGTERM');
  }
  process.exit(0);
});
