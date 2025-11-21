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

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import WebSocket, { WebSocketServer } from 'ws';
import { setUpdateListener, updateClients } from './clients.js';
import { ActionType } from './common/actions.js';
import { AppState, Notification } from './common/types.js';
import { getLights } from './db/lights.js';
import { getPatterns } from './db/patterns.js';
import { getScenes } from './db/scenes.js';
import { getSchedules } from './db/schedule.js';
import { getSettings } from './db/settings.js';
import { getZones } from './db/zones.js';
import { getSystemState } from './device.js';
import { createLightHandlers } from './endpoints/lights.js';
import { createPatternHandlers } from './endpoints/patterns.js';
import { createScenesHandlers } from './endpoints/scenes.js';
import { createScheduleHandlers } from './endpoints/schedules.js';
import { createSettingsHandlers } from './endpoints/settings.js';
import { createStateHandlers } from './endpoints/state.js';
import { createZoneHandlers } from './endpoints/zones.js';
import { reconcile } from './reconcile.js';
import { getEnvironmentVariable } from './util.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

let version = 1;

function getAppState(): AppState {
  return {
    zones: getZones(),
    schedules: getSchedules(),
    scenes: getScenes(),
    patterns: getPatterns(),
    lights: getLights(),
    systemState: getSystemState(),
    settings: getSettings(),
    version
  };
}

export async function init(): Promise<void> {
  const port = parseInt(getEnvironmentVariable('PORT', '3000'));
  const app = Fastify();

  app.register(fastifyStatic, {
    root: join(__dirname, '..', '..', 'public')
  });

  const handlers = {
    ...createZoneHandlers(),
    ...createScheduleHandlers(),
    ...createScenesHandlers(),
    ...createPatternHandlers(),
    ...createLightHandlers(),
    ...createStateHandlers(),
    ...createSettingsHandlers()
  };

  const address = await app.listen({ port, host: '0.0.0.0' });
  console.log(`Endpoints initialized at ${address}`);

  const server = new WebSocketServer({
    server: app.server
  });

  setUpdateListener(() => {
    for (const client of server.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: ActionType.AppStateUpdated,
            data: getAppState()
          })
        );
      }
    }
  });

  let isProcessing = false;
  const processingQueue: {
    message: WebSocket.Data;
    connection: WebSocket;
  }[] = [];
  server.on('connection', (connection) => {
    connection.on('message', async (message) => {
      processingQueue.push({ message, connection });
      if (isProcessing) {
        return;
      }
      isProcessing = true;
      processQueue();
    });
    connection.send(
      JSON.stringify({
        type: ActionType.Hello,
        data: getAppState()
      })
    );
  });

  async function processQueue() {
    const nextEntry = processingQueue.shift();
    if (!nextEntry) {
      isProcessing = false;
      return;
    }
    const { message, connection } = nextEntry;

    // Handle the action itself
    const action = JSON.parse(message.toString());
    if (!handlers[action.type]) {
      const data: Notification = {
        severity: 'error',
        message: `Invalid message "${action.type}"`
      };
      connection.send(
        JSON.stringify({
          type: ActionType.Notify,
          data
        })
      );
      return;
    }

    // Run the handler, and check if the operation has a return action
    const returnNotification = await handlers[action.type].handler(action.data);
    if (returnNotification) {
      const type = Object.keys(returnNotification)[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (returnNotification as any)[type];
      connection.send(
        JSON.stringify({
          type,
          data
        })
      );
      if (data[ActionType.Notify]?.severity === 'error') {
        return;
      }
    }

    // Reconcile data after the transaction, and increment the version
    if (handlers[action.type].reconcile) {
      await reconcile();
    }
    version++;

    // Notify all connected clients of the change
    updateClients();

    processQueue();
  }
}
