const { Sequelize, DataTypes } = require('sequelize');
const { BasicProperties, ObjectiveProperties } = require("../modules/records/model");
const ConsoleProgressBar = require('console-progress-bar');

const manifestUtil = require('./manifest-util');
const filterUtil = require('./filter-util');

const dbConfig = require('../config/db/db-config').data;
const recordSchema = require('../modules/records/module')().model.schema();

module.exports = {
    indexRecords
}

function dbInit () {
    return new Promise(async (resolve, reject) => {
        try {
            const sequelize = new Sequelize(prepareConnectionString(), { logging: false });
            await sequelize.authenticate();
            console.log('Indexer connected to DB');
            const recordsModel = sequelize.define('Record', { ...recordSchema });
            await recordsModel.sync({ force: true });
            console.log('Indexer DB sync completed');
            
            const test = sequelize.define('Test', { name: {
                type: DataTypes.TEXT
            }});
            await test.sync({ force: true });
            const hi = await test.create({ name: 'test'});

            resolve({ connection: sequelize, model: recordsModel });
        } catch (err) {
            reject(err);
        }
    });
}

function prepareConnectionString () {
    const str = `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.server}/${dbConfig.database}`;
    return str;
}

const logColors = {
    bgCyan: '\x1b[36m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[32m',
    fgBlack: '\x1b[30m',
    reset: '\x1b[0m'
}

function indexRecords () {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`${logColors.bgCyan}Getting latest record data from Destiny 2 Manifest...${logColors.bgCyan}`);
            const allRecords = await manifestUtil.queryManifest('DestinyRecordDefinition');
            console.log(`${logColors.bgCyan}${allRecords.length} to index${logColors.bgCyan}`);
            console.log(`${logColors.bgCyan}Getting latest metadata for records...${logColors.bgCyan}`);
            const allObjectives = await manifestUtil.queryManifest('DestinyObjectiveDefinition');
            const allPresentationNodes = await manifestUtil.queryManifest('DestinyPresentationNodeDefinition');
            let metadata = {};

            const dbConnection = await dbInit();
            if (dbConnection === null) throw 'Database connection is null :(';

            console.log(`${logColors.bgCyan}Beginning Index...${logColors.bgCyan}`);
            const startTime = Date.now();
            const consoleProgressBar = new ConsoleProgressBar({ maxValue: allRecords.length });
            allRecords.forEach(async (record, i) => {
                record = JSON.parse(record.json);
                // if(record.displayProperties.name !== 'Behemoth') {
                //     return;
                // }

                metadata = {

                    filterData: {}
                };
                
                if (record.objectiveHashes !== undefined && record.objectiveHashes.length > 0) {
                    let objectives = [];
                    record.objectiveHashes.forEach(objectiveHash => {
                       objectives.push(
                           JSON.parse(
                               allObjectives.filter(elem => JSON.parse(elem.json).hash === objectiveHash)[0].json
                            )
                        );
                    });
                    metadata.objectivesManifest = objectives;
                }

                if (record.intervalInfo !== undefined && record.intervalInfo.intervalObjectives.length > 0) {
                    let objectives = [];
                    record.intervalInfo.intervalObjectives.forEach(intervalObjective => {
                        if (allObjectives.filter(elem => JSON.parse(elem.json).hash === intervalObjective.intervalObjectiveHash).length === 0)
                            return;
                        objectives.push(
                            JSON.parse(
                                allObjectives.filter(elem => JSON.parse(elem.json).hash === intervalObjective.intervalObjectiveHash)[0].json
                            )
                        );
                    });
                    metadata.intervalInfoManifest = objectives;
                }
                
                if (record.parentNodeHashes !== undefined && record.parentNodeHashes.length > 0) {
                    let parents = [];
                    record.parentNodeHashes.forEach(hash => {
                        parents.push(
                            JSON.parse(
                                allPresentationNodes.filter(elem => JSON.parse(elem.json).hash === hash)[0].json
                            )
                        );
                    });
                    metadata.presentationNodeManifest = parents;
                }

                if(record.completionInfo !== undefined) metadata.filterData.scoreValue = record.completionInfo.ScoreValue;
                metadata.filterData.locations = filterUtil.determineLocation(record);
                metadata.filterData.weaponTypes = filterUtil.determineWeaponType(record);
                metadata.filterData.requiresFireteam = filterUtil.determineIfNeedsFireteam(record);
                metadata.filterData.requiresSolo = filterUtil.determineIfNeedsSolo(record);
                metadata.filterData.activityTypes = filterUtil.determineActivityTypes(record);
                metadata.filterData.subclassTypes = filterUtil.determineSubclassTypes(record);
                //Now update db after syncing (dropping table with old manifest)
                dbConnection.model.create({
                    basicProperties: {...record },
                    objectivesManifest: { data: metadata.objectivesManifest },
                    intervalInfoManifest: { data: metadata.intervalInfoManifest },
                    presentationNodeManifest: { data: metadata.presentationNodeManifest },
                    filterData: { data: metadata.filterData }
                });
                consoleProgressBar.addValue(1);
                if (i === (allRecords.length - 1)) {
                    const duration = Date.now() - startTime;
                    consoleProgressBar.addValue(5000);
                    console.log(`${logColors.bgGreen}Index complete in ${duration / 1000}s !${logColors.bgGreen}${logColors.reset}`);
                    resolve('Index Complete');
                }
            });
        } catch (err) {
            console.error(`${logColors.bgRed}${err}`);
            reject(err);
        }
    });
}

(async() => {
    try {
        await indexRecords();
    } catch (err) {
        console.error(`${logColors.bgRed}${err}`);
    }
})();