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

import { join } from 'path';
import { RVL } from 'rvl-node';
import * as express from 'express';
import { json } from 'body-parser';
import { IWaveParameters } from 'rvl-node';

const WEB_SERVER_PORT = 80;
const RAVER_LIGHTS_INTERFACE = 'wifi0';
const RAVER_LIGHTS_CHANNEL = 5;

enum Source {
  TV = 0,
  Kitchen = 1
}

interface IMessage {
  source: Source;
  waves: IWaveParameters;
}

const rvl = new RVL({
  networkInterface: RAVER_LIGHTS_INTERFACE,
  port: 4978,
  mode: 'controller',
  logLevel: 'debug',
  channel: RAVER_LIGHTS_CHANNEL
});

rvl.on('initialized', () => {
  rvl.start();

  const app = express();

  app.use(express.static(join(__dirname, '..', '..', 'public')));
  app.use(json());

  app.post('/api/animation', (req, res) => {
    const message: IMessage = req.body;
    rvl.setWaveParameters(message.waves);
    res.send('ok');
  });

  app.listen(WEB_SERVER_PORT, () => {
    console.log(`Home Lights server running on port ${WEB_SERVER_PORT}!`);
  });
});
