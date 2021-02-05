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
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import WebSocket, { Server } from 'ws';
import { setUpdateListener, updateClients } from './clients';
import { ActionType } from './common/actions';
import { AppState, Notification } from './common/types';
import { getLights } from './db/lights';
import { getPatterns } from './db/patterns';
import { getScenes } from './db/scenes';
import { getSchedules } from './db/schedule';
import { getSettings } from './db/settings';
import { getZones } from './db/zones';
import { getSystemState } from './device';
import { createLightHandlers } from './endpoints/lights';
import { createPatternHandlers } from './endpoints/patterns';
import { createScenesHandlers } from './endpoints/scenes';
import { createScheduleHandlers } from './endpoints/schedules';
import { createSettingsHandlers } from './endpoints/settings';
import { createStateHandlers } from './endpoints/state';
import { createZoneHandlers } from './endpoints/zones';
import { reconcile } from './reconcile';
import { getEnvironmentVariable } from './util';

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

export function init(): Promise<void> {
  return new Promise((resolve) => {
    const port = parseInt(getEnvironmentVariable('PORT', '3000'));
    const app = fastify();

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

    app.listen(port, '0.0.0.0', (err, address) => {
      if (err) {
        throw err;
      }
      console.log(`Endpoints initialized at ${address}`);
      resolve();
    });

    const server = new Server({
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
      const returnNotification = await handlers[action.type].handler(
        action.data
      );
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
  });
}
