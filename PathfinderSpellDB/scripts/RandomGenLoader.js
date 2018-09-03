var tablePromise = null;
var npcSchemaPromise = null;
var utils = require("./RandomGen/utils");

function initTables() {
    if (!tablePromise) tablePromise = new Promise((resolve) => {
        const fs = require('fs');
        var path = require("path");
        const { remote } = require('electron');

        var tables = {};
        var folder = path.resolve(remote.app.getAppPath(), './data/RandomGenTables/');
        fs.readdir(folder, function (_, files) {
            for (var i = 0; i < files.length; i++) {
                var table = require(path.resolve(folder, files[i]));
                var tableName = path.basename(files[i], path.extname(files[i]));
                var parsedTable = {
                    "w": 0,
                    "options": []
                };
                parsedTable.options = table.map((row, i) => {
                    var weight = row.w || 0;
                    parsedTable.w += weight;
                    return {
                        "w": weight,
                        "v": utils.getGroups(row.v),
                        "original": row.v
                    };
                });
                tables[tableName] = parsedTable;
            }
            resolve(tables);
        });
    });
    return tablePromise;
}
function initNpcSchema() {
    if (!npcSchemaPromise) npcSchemaPromise = new Promise((resolve) => {
        var schema = require("../data/RandomGenSchema/npcSchema.json");
        resolve(schema);
    });
    return npcSchemaPromise;
}

function processGroups(data, groups, context) {
    var result;
    var addToResult = function (value) {
        if (value !== undefined && value !== null) {
            result = value;
            addToResult = function (newValue) {
                result += String(newValue);
            };
        }
    };
    groups.forEach(function (instruction) {
        if (typeof instruction == 'string') {
            addToResult(instruction);
        }
        else if (typeof instruction == 'function') {
            var insRes = instruction(data, context, {});
            if (insRes !== undefined) {
                if (Array.isArray(insRes)) {
                    addToResult(processGroups(data, insRes, context));
                }
                else {
                    addToResult(insRes);
                }
            }
        }
        else if (Array.isArray(instruction)) {
            addToResult(processGroups(data, instruction, context));
        }
    });
    return result;
}

function chooseFromArray(arr) {
    var totalWeight = 0;
    arr.forEach(e => { totalWeight += e.w | 0 });
    return utils.chooseRandomWithWeight(arr, totalWeight);
}

function processSchema(data, schemaElement, context) {
    if (typeof schemaElement == "string") {
        return processGroups(data, utils.getGroups(schemaElement), context);
    } else if (Array.isArray(schemaElement)) {
        return processSchema(data, chooseFromArray(schemaElement), context);
    }
    var result = {};
    for (var name in schemaElement) {
        var element = schemaElement[name];
        // need to make a choice based on weight
        if (Array.isArray(element)) {
            result[name] = processSchema(data, chooseFromArray(element), context);
        } else {
            result[name] = processSchema(data, element, context);
        }
    }
    return result;
}
export function getRandomNpc() {
    return new Promise((resolve) => {
        Promise.all([initTables(), initNpcSchema()]).then((results) => {
            var tables = results[0];
            var schema = results[1];
            var data = { "tables": tables };
            var context = { vars: {} };
            processGroups(data, utils.getGroups(schema.options.initialisation), context);
            resolve(processSchema(data, schema.output, context));
        });
    });
}