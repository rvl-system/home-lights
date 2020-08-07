"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const rvl_node_1 = require("rvl-node");
const express = require("express");
const body_parser_1 = require("body-parser");
const handlebars_1 = require("handlebars");
const WEB_SERVER_PORT = 80;
const CHANNEL = 0;
(async () => {
    const indexViewTemplate = handlebars_1.compile(fs_1.readFileSync(path_1.join(__dirname, '..', '..', 'views', 'index.handlebars'), 'utf-8'));
    const manager = await rvl_node_1.createManager();
    const controller = await manager.createController({
        channel: CHANNEL
    });
    const app = express();
    app.use(express.static(path_1.join(__dirname, '..', '..', 'public')));
    app.use(body_parser_1.json());
    const store = {
        power: true,
        brightness: 64,
        animationType: 'Wave',
        animationParameters: {
            rainbow: {
                rate: 4
            },
            pulse: {
                rate: 16,
                hue: 120,
                saturation: 255
            },
            wave: {
                rate: 8,
                waveHue: 0,
                foregroundHue: 170,
                backgroundHue: 85
            },
            colorCycle: {
                rate: 4
            },
            solid: {
                hue: 170,
                saturation: 255
            }
        }
    };
    function updateAnimation() {
        switch (store.animationType) {
            case 'Rainbow':
                console.log(`Updating rainbow animation with rate=${store.animationParameters.colorCycle.rate}`);
                controller.setWaveParameters(rvl_node_1.createWaveParameters(rvl_node_1.createRainbowWave(255, store.animationParameters.rainbow.rate)));
                break;
            case 'Pulse':
                console.log(`Updating pulse animation with rate=${store.animationParameters.colorCycle.rate} ` +
                    `hue=${store.animationParameters.pulse.hue} ` +
                    `saturation=${store.animationParameters.pulse.saturation}`);
                controller.setWaveParameters(rvl_node_1.createWaveParameters(rvl_node_1.createPulsingWave(store.animationParameters.pulse.hue, store.animationParameters.pulse.saturation, store.animationParameters.pulse.rate)));
                break;
            case 'Wave':
                console.log(`Updating wave animation with rate=${store.animationParameters.colorCycle.rate} ` +
                    `waveHue=${store.animationParameters.wave.waveHue} ` +
                    `foregroundHue=${store.animationParameters.wave.foregroundHue} ` +
                    `backgroundHue=${store.animationParameters.wave.backgroundHue} `);
                controller.setWaveParameters(rvl_node_1.createWaveParameters(rvl_node_1.createMovingWave(store.animationParameters.wave.waveHue, 255, store.animationParameters.wave.rate, 2), rvl_node_1.createPulsingWave(store.animationParameters.wave.foregroundHue, 255, store.animationParameters.wave.rate), rvl_node_1.createSolidColorWave(store.animationParameters.wave.backgroundHue, 255, 255)));
                break;
            case 'Color Cycle':
                console.log(`Updating color cycle animation with rate=${store.animationParameters.colorCycle.rate}`);
                controller.setWaveParameters(rvl_node_1.createWaveParameters(rvl_node_1.createColorCycleWave(store.animationParameters.colorCycle.rate, 255)));
                break;
            case 'Solid': {
                console.log(`Updating solid animation with hue=${store.animationParameters.solid.hue} ` +
                    `saturation=${store.animationParameters.solid.saturation}`);
                controller.setWaveParameters(rvl_node_1.createWaveParameters(rvl_node_1.createSolidColorWave(store.animationParameters.solid.hue, store.animationParameters.solid.saturation, 255)));
                break;
            }
        }
    }
    updateAnimation();
    controller.setPowerState(store.power);
    controller.setBrightness(store.brightness);
    app.get('/', (req, res) => {
        res.send(indexViewTemplate(store));
    });
    app.post('/api/power', (req, res) => {
        store.power = !!req.body.power;
        console.log(`Setting power to ${store.power ? 'on' : 'off'}`);
        controller.setPowerState(store.power);
        res.send({ status: 'ok' });
    });
    app.post('/api/brightness', (req, res) => {
        store.brightness = req.body.brightness;
        console.log(`Setting brightness to ${store.brightness}`);
        controller.setBrightness(store.brightness);
        res.send({ status: 'ok' });
    });
    app.post('/api/animation', (req, res) => {
        store.animationType = req.body.animationType;
        store.animationParameters = req.body.animationParameters;
        updateAnimation();
        res.send({ status: 'ok' });
    });
    app.listen(WEB_SERVER_PORT, () => {
        console.log(`Home Lights server running on port ${WEB_SERVER_PORT}!`);
    });
})();
//# sourceMappingURL=index.js.map