## 1.7.2 (2023-9-29)

- Fixed a bug with deleting zones
- Forked the now abandonware node-lifx-lan to add support for newer bulbs

## 1.7.1 (2021-11-30)

- Fixed a bug where settings couldn't be scrolled
- Show the current scene in the zone summary

## 1.7.0 (2021-11-14)

- Added spacing control for wave and rainbow patterns
- Upgraded build infrastructure and dependencies

## 1.6.0 (2021-06-03)

- Fixed two reconciliation bugs
- Fixed a bug with temperature conversion
- Zones now collapse after setting a scene

## 1.5.1 (2021-02-05)

- Fixed a bug where reconciliation needs to happen after applying migrations

## 1.5.0 (2021-02-05)

- Database migrations now create a backup copy of the database before applying migrations
- All server operations are now serialized, with the hope that this fixes a number of intermittent exceptions that I believed were caused by trying to do two things at once.

## 1.4.3 (2021-01-24)

- Fixed bug with refresh lights not handling name changes

## 1.4.2 (2021-01-19)

- Fixed a bug with not updated lights properly after connecting to a Philips Hue bridge
- Fixed a bug with the schema

## 1.4.1 (2021-01-18)

- Fixed a bug with notifications + app state updates not working properly

## 1.4.0 (2021-01-18)

- Added ability to tell the app to refresh LIFX/Philips Hue lights
- Added the ability to remove all lights
- Changed the logic so that Philips Hue bridge discovery is manual from the app, instead of on startup
- Accordions are collapsed when the app is backgrounded
- Added takeover UI that prevents the app from being used when disconnected from the server

## 1.3.0 (2021-01-17)

- Added automatic db migrations to make upgrading _way_ easier
- Added ability to change the U Itheme manually

## 1.2.0 (2021-01-13)

- Converted LIFX to use the lan protocol
- Schedules no longer show in operation mode when there is no schedule

## 1.1.3 (2021-01-10)

- Fixed a bug with the UI not showing the currently enabled schedule

## 1.1.2 (2021-01-10)

- Fixed a bug with enabling the schedule when no schedule has been created

## 1.1.1 (2021-01-10)

- Added support for schedules

_note_: Version 1.1.0 was a botched publish and had to be unpublished

## 1.0.1 (2020-12-31)

- Handful of small bug fixes and UI polish

## 1.0.0 (2020-12-30)

- Published first release version
