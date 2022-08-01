# Home Lights

Control system for multi-vendor home lighting systems.

Currently supported vendors:
- [Philips Hue](https://www.philips-hue.com/)
- [LIFX](https://www.lifx.com/)
- [RVL](https://github.com/rvl-system/) (My custom animation lighting system)

A Raspberry Pi makes an ideal system for running Home Lights, and all instructions below are written assuming a Raspberry Pi. Home lights will run just fine on other systems, but the instructions below may not work without modification.

## Installation

```bash
sudo mkdir /app
# If you set up a custom username, replace pi:pi with name:name
sudo chown -R pi:pi /app
npm config set prefix /app
npm install -g home-lights
sudo ln -s /app/bin/home-lights /usr/bin/home-lights
```

Yeah, this is a lot. Super tl;dr, creating the symlink that npm does by default and building the SQLite binary required conflicting sets of permissions when trying to install to /usr/lib/node_modules and /usr/. This workaround avoids the conflict, which I developed after I managed to brick a Pi.

Once this is done, you can update Home Lights by running:

```
npm install -g home-lights
```

## Setting up a WiFi AP on a Raspberry Pi:

Follow instructions [here](http://www.raspberryconnect.com/network/item/333-raspberry-pi-hotspot-access-point-dhcpcd-method).

Note: there was an update to Raspbian that changed things a bit. You'll need to run these commands once you're done with everything from the above instructions:

```bash
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
```

## Running on system startup

We'll use systemd to manage the process. Create a file at `/etc/systemd/system/home-lights.service`. Inside this file, add the following:

```
[Unit]
Requires=systemd-networkd.socket
After=systemd-networkd.socket

[Service]
ExecStartPre=/lib/systemd/systemd-networkd-wait-online --interface=wlan0
ExecStart=home-lights
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=home-lights
Environment=NODE_ENV=production
Environment=PORT=80
User=root
Group=root

[Install]
WantedBy=multi-user.target
```

If your server won't be listening on `wlan0`, change it to the appropriate interface.

Then, run these commands:

```
sudo systemctl enable systemd-networkd-wait-online.service
sudo systemctl enable home-lights
```

Next time your reboot your application, it should be running! You can check the status of your service by running `systemctl status home-lights`, check the console output of your service by running `journalctl -u home-lights`, and restart your service by running `sudo systemctl restart home-lights`.

## License

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
