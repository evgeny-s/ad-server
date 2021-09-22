import {execSync} from 'child_process';
import {waitForMs} from './setup';

export default async function teardown(): Promise<void> {
  execSync('docker-compose -f docker-compose.e2e.yml --env-file .env.test -p e2e-test rm -f -s -v');

  await waitForMs(3000);
}
