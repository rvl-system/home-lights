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
exports.dbGet = exports.dbAll = exports.dbRun = exports.init = void 0;
const sqlite3_1 = require("sqlite3");
const util_1 = require("./util");
let db;
function init(dbPath) {
    const sqlite3 = sqlite3_1.verbose();
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
exports.init = init;
/**
 * Runs all sqlite queries queries other than SELECT
 */
async function dbRun(query, parameters) {
    if (!db) {
        throw util_1.createInternalError(`dbRun called before database initialized`);
    }
    return new Promise((resolve, reject) => {
        db.run(query, parameters || [], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        });
    });
}
exports.dbRun = dbRun;
/**
 * SELECT all rows from the database
 */
async function dbAll(query, parameters = []) {
    if (!db) {
        throw util_1.createInternalError(`dbAll called before database initialized`);
    }
    return new Promise((resolve, reject) => {
        db.all(query, parameters, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.dbAll = dbAll;
/**
 * Used to SELECT the first row out of the database
 */
async function dbGet(query, parameters = []) {
    if (!db) {
        throw util_1.createInternalError(`dbGet called before database initialized`);
    }
    return new Promise((resolve, reject) => {
        db.get(query, parameters, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.dbGet = dbGet;
//# sourceMappingURL=sqlite.js.map