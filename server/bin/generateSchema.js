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

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */

const { exec } = require('child_process');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { DB_FILE } = require('../dist/util');

exec(`sqlite3 ${DB_FILE} .schema`, (err, stdout, stderr) => {
  if (err || stderr) {
    console.error(err || stderr);
    process.exit(1);
  }
  writeFileSync(join(__dirname, '..', 'db', 'schema.sql'), stdout);
});
