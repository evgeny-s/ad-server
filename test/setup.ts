import {execSync} from 'child_process';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

export const waitForMs = (timeout: number) =>
  of(1)
    .pipe(delay(timeout))
    .toPromise();

export default async function init(): Promise<void> {
  execSync('docker-compose -f docker-compose.e2e.yml --env-file .env.test -p e2e-test up -d');

  await waitForMs(5000);
}
