'use strict';
const axios = require('axios');
const FormData = require('form-data');
const request = require('request');
let sqlite = require('sqlite3').verbose();
const SZIP = require('node-stream-zip');
const fs = require('fs');


    module.exports = {
      queryManifest: handleManifestQuery
    }

    const bungieConfig = require('../config/bungie/config');

    function handleManifestQuery(tableName) {
        return new Promise(async (resolve, reject) => {
            try {
                if (await manifestOutdated()) {
                  await getUpdatedManifest();
                }
                let response = await queryManifest(tableName);
                resolve(response);
            }catch (err) {
                reject(err);
            }
        });
    }
      
    function downloadManifestData (manifestURL){
        return new Promise((resolve, reject) => {
          let outStream = fs.createWriteStream('./sqli/manifest.zip');
          request.get(`https://www.bungie.net${manifestURL}`)
          .on('response', function(res, body){
            console.log(res.statusCode);
          }).pipe(outStream)
          .on('finish', function(){
            let zip = new SZIP({
              file: './sqli/manifest.zip',
              storeEntries: true
            });
            zip.on('ready', function(){
              console.log('zip ready');
              console.log(manifestURL.split('/')[4]);
              zip.extract(manifestURL.split('/')[5], './sqli/manifest.content', function(err,count){
                if(err) reject(err);
                console.log('Manifest Updated');
                resolve(true);
              });
            });
          });
        });
      }
      
      function getUpdatedManifest () {
        return new Promise((resolve, reject) => {
          console.log(`${bungieConfig.destinyApiUrl}/Destiny2/Manifest`);
          axios.get(`${bungieConfig.destinyApiUrl}/Destiny2/Manifest`)
          .then(async res => {
            console.log(res.data.Response.mobileWorldContentPaths.en);
            await downloadManifestData(res.data.Response.mobileWorldContentPaths.en);
            resolve(true);
          })
          .catch(err => reject(err));
        });
      }
      
      function manifestOutdated () {
        return new Promise((resolve, reject) => {
          fs.stat('./sqli/manifest.content', (err, stats) => {
            if (err) {
              if(err.errno = -2) {
                resolve(true);
              } else { reject(err); }
            } else {
              if (Date.now() - stats.birthtimeMs > 14400000) {
                console.log('Manifest age is 14m ms less than now');
                resolve(true);
              } else {
                resolve(false);
              }
            }
          });
        });
      }
      
      
      function queryManifest(tableName){
          return new Promise((resolve, reject) => {
          let db = new sqlite.Database('./sqli/manifest.content');
          db.serialize(function(){
            let query = `SELECT * FROM ${tableName}`;
            db.all(query, function(err, rows){
              if(err) reject(err);
              resolve(rows);
            });
          });
        });
      }