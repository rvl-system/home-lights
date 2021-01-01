#!/usr/bin/env node
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

/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const { mkdirSync, rmSync, writeFileSync } = require('fs');
const { join } = require('path');

const startTime = Date.now();

// Build the server
console.log('Building the server...');
execSync('npm run build', {
  cwd: join(__dirname, 'server')
});

// Build the client
console.log('\nBuilding the client...');
execSync('npm run build', {
  cwd: join(__dirname, 'client')
});

// Copy the artifacts over
console.log('\nBundling the build artifacts...');
rmSync(join(__dirname, 'bundle'), { recursive: true, force: true });
mkdirSync(join(__dirname, 'bundle'));
execSync('cp -r server/dist bundle/server/', { cwd: __dirname });
execSync('cp -r server/bin bundle/server/', { cwd: __dirname });
execSync('cp -r public bundle/', { cwd: __dirname });
execSync('cp -r LICENSE README.md CHANGELOG.md bundle/', { cwd: __dirname });

// Generate the package.json file
console.log('\nGenerating the package.json file...');
writeFileSync(
  join(__dirname, 'bundle', 'package.json'),
  JSON.stringify(
    {
      name: 'home-lights',
      description: 'Web application for controlling programmable lights',
      keywords: [
        'Philips Hue',
        'LIFX',
        'Programmable Lighting',
        'Home Automation'
      ],
      engines: {
        node: '>= 14.15.0'
      },
      bin: {
        'home-lights': './server/bin/server.js'
      },
      scripts: {
        start: 'node ./server/bin/server.js'
      },
      author: 'Bryan Hughes <bryan@nebri.us>',
      license: 'GPL-3.0',
      dependencies: require('./server/package.json').dependencies,
      version: require('./package.json').version
    },
    null,
    '  '
  )
);

console.log(
  `\nCompleted in ${((Date.now() - startTime) / 1000).toFixed(1)} seconds`
);
