import { spawn } from 'child_process';

export function reboot(): void {
  process.on('exit', function () {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    spawn(process.argv.shift()!, process.argv, {
      cwd: process.cwd(),
      detached: true,
      stdio: 'inherit'
    });
  });
  process.exit();
}
