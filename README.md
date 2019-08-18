# Home Lights

Control system for my home lighting system.

## Setting up the WiFi AP:

Follow instructions [here](http://www.raspberryconnect.com/network/item/333-raspberry-pi-hotspot-access-point-dhcpcd-method).

Note: there was an update to Raspbian that changed things a bit. You'll need to run these commands once you're done with everything from the above instructions:

```bash
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
```

## Setting up the Systemd service:

Create a file at `/etc/systemd/system/home-lights.service`. Inside this file, add the following:

```
[Unit]
Requires=systemd-networkd.socket
After=systemd-networkd.socket

[Service]
ExecStartPre=/lib/systemd/systemd-networkd-wait-online --interface=wlan0
ExecStart=/usr/bin/node /home/pi/home-lights/server/dist/index.js
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=home-lights
Environment=NODE_ENV=production
User=root
Group=root

[Install]
WantedBy=multi-user.target
```

Then, run these commands:

```
sudo systemctl enable systemd-networkd-wait-online.service
sudo systemctl enable home-lights
```

Next time your reboot your application, it should be running! You can check the status of your service by running `systemctl status home-lights`, check the console output of your service by running `journalctl -u home-lights`, and restart your service by running `sudo systemctl restart home-lights`.

# License

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
