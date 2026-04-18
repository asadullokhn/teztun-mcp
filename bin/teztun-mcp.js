#!/usr/bin/env node
/**
 * Thin launcher for the TezTun MCP server. Tries, in order:
 *
 *   1. `teztun` in $PATH → runs `teztun mcp` (natural if the CLI is installed)
 *   2. Docker → runs `docker run --rm -i -e TEZTUN_TOKEN asadullokhn/teztun:latest mcp`
 *
 * Passes stdin/stdout through so the AI client's JSON-RPC frames reach the
 * server unchanged. Exits with the child's exit code.
 */
'use strict';

const { spawn, spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');

function log(msg) {
  // stderr only — stdout is the MCP protocol channel.
  process.stderr.write(`[teztun-mcp] ${msg}\n`);
}

function has(cmd) {
  // Cross-platform "is this binary in PATH?"
  const probe = process.platform === 'win32' ? 'where' : 'which';
  const r = spawnSync(probe, [cmd], { stdio: 'ignore' });
  return r.status === 0;
}

function run(cmd, args) {
  const child = spawn(cmd, args, {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: process.env,
  });
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code == null ? 0 : code);
  });
  child.on('error', (err) => {
    log(`failed to spawn ${cmd}: ${err.message}`);
    process.exit(127);
  });
  // Forward termination signals so Ctrl+C in the client stops the server.
  ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((sig) => {
    process.on(sig, () => {
      try { child.kill(sig); } catch {}
    });
  });
}

if (has('teztun')) {
  run('teztun', ['mcp', ...process.argv.slice(2)]);
} else if (has('docker')) {
  log('teztun CLI not found in PATH — falling back to asadullokhn/teztun:latest Docker image');
  run('docker', [
    'run', '--rm', '-i',
    '-e', 'TEZTUN_TOKEN',
    '-e', 'TEZTUN_TOKEN_FILE',
    '-e', 'TEZTUN_API_BASE',
    'asadullokhn/teztun:latest', 'mcp',
    ...process.argv.slice(2),
  ]);
} else {
  log('Neither `teztun` nor `docker` is available. Install one:');
  log('  1. Install the TezTun CLI:  https://teztun.uz/download');
  log('  2. Or install Docker:       https://docs.docker.com/get-docker/');
  process.exit(127);
}
