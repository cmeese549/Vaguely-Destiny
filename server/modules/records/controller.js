(() => {
    'use strict';

    const express = require('express');
    const router = express.Router();

    const middleware = require('./module')().middleware;

    //router.get('/query-manifest/:tableName', middleware.handleManifestQuery);

    module.exports = router;
})();