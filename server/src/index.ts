/*
Copyright (c) Bryan Hughes <bryan@nebri.us>

This file is part of Home Lights.

Home Lights is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Home Lights is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Home Lights.  If not, see <http://www.gnu.org/licenses/>.
*/

import { fork } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createInternalError } from './common/util.js';
import { ProcessMessage } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

let child = fork(join(__dirname, 'server'));
let exiting = false;
child.on('message', (msg: ProcessMessage) => {
  switch (msg.type) {
    case 'reboot': {
      console.log('Rebooting server');
      exiting = true;
      if (!child.kill()) {
        throw createInternalError('Failed to kill child process');
      }
      // Give the exit handler plenty of time to run
      setTimeout(() => {
        exiting = false;
        child = fork(join(__dirname, 'server'));
      }, 100);
      break;
    }
    default: {
      throw createInternalError(`Unknown message type: "${msg.type}"`);
    }
  }
});

child.on('exit', (code) => {
  if (!exiting) {
    process.exit(code || 0);
  }
});
