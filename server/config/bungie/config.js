const clientID = `${process.env.CLIENT_ID}`;
const clientSecret = `${process.env.API_KEY}`;
const destinyAuthURL = '';
const api = '';

'use strict';
(function () {
  require('dotenv').config();

  module.exports = {
    clientID: `${process.env.CLIENT_ID}`,
    clientSecret: `${process.env.API_KEY}`,
    destinyAuthURL: `${process.env.DestinyAuthURL}`,
    destinyApiUrl: `${process.env.DestinyApiURL}`
  };
})();
