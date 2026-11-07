import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const wrangler = './node_modules/wrangler/bin/wrangler.js';
const configPath = 'dist/server/wrangler.json';
const databaseName = 'online-monopoly-yerevan-db';
const [mode, option, ...extra] = process.argv.slice(2);
const dryRun = mode === 'cloudflare' && option === '--dry-run';

if (!['local', 'cloudflare'].includes(mode) || (option && !dryRun) || extra.length) {
  throw new Error('Usage: node scripts/setup.mjs local | cloudflare [--dry-run]');
}

function run(command, args, capture = false) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: capture ? ['inherit', 'pipe', 'inherit'] : 'inherit',
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  return result.stdout;
}

function cloudflare(args, capture = false) {
  return run(process.execPath, [wrangler, ...args, '--config', configPath], capture);
}

if (!existsSync(new URL('../' + wrangler, import.meta.url))) run('npm', ['ci']);
run('npm', ['run', 'build']);

const generated = new URL('../' + configPath, import.meta.url);
const config = JSON.parse(readFileSync(generated, 'utf8'));
const binding = config.d1_databases?.find(({ binding }) => binding === 'DB');
if (!binding) throw new Error('The build did not produce the DB binding.');
binding.migrations_dir = '../../drizzle';
config.name = 'online-monopoly-yerevan';
config.workers_dev = true;
config.preview_urls = false;

if (mode === 'cloudflare' && !dryRun) {
  const findDatabase = () => JSON.parse(cloudflare(['d1', 'list', '--json'], true))
    .find(({ name }) => name === databaseName);
  let database = findDatabase();
  if (!database) {
    cloudflare(['d1', 'create', databaseName]);
    database = findDatabase();
  }
  if (!database?.uuid) throw new Error('Could not find the new D1 database.');
  binding.database_name = databaseName;
  binding.database_id = database.uuid;
}

writeFileSync(generated, JSON.stringify(config, null, 2) + '\n');

if (mode === 'local') {
  const persistence = ['--local', '--persist-to', '.wrangler/state'];
  cloudflare(['d1', 'migrations', 'apply', 'DB', ...persistence]);
  cloudflare(['dev', ...persistence, '--ip', '127.0.0.1', '--port', '8787', '--inspector-port', '0']);
} else if (dryRun) {
  cloudflare(['deploy', '--dry-run', '--outdir', 'dist/cloudflare-dry-run']);
} else {
  cloudflare(['d1', 'migrations', 'apply', 'DB', '--remote']);
  cloudflare(['deploy']);
}
