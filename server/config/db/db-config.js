'use strict';
(function () {
  require('dotenv').config();

  module.exports = {
    data: {
      server: process.env.DbServer,
      database: process.env.Db,
      user: process.env.DbUser,
      password: process.env.DbPw
    }
  };
})();
