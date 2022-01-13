(() => {
    'use strict';

    const express = require('express');
    const router = express.Router();

    const middleware = require('./module')().middleware;
  
    router.get("/query/:tableName", middleware.queryManifest);

    module.exports = router;
    
})();