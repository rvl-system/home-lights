#!/bin/sh
# Copyright (c) Bryan Hughes <bryan@nebri.us>
#
# This file is part of Home Lights.
#
# Home Lights is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Home Lights is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Home Lights.  If not, see <http://www.gnu.org/licenses/>.

startTime="$(date +%s)"

# Build the server
echo "Building the server..."
cd server
npm run build
cd ..

# Build the client
echo "Building the client..."
cd client
npm run build
cd ..

# Copy the articfacts over
echo ""
echo "Bundling the build artifacts..."
rm -rf bundle
mkdir -p bundle/server/
cp -r server/dist bundle/server/
cp -r server/bin bundle/server/
cp -r production-package.json bundle/package.json
cp -r public bundle/
cp -r LICENSE README.md CHANGELOG.md bundle/

elapsedTime="$(($(date +%s)-startTime))"

echo ""
echo "Completed in ${elapsedTime} seconds"
