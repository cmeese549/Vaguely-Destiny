(() => {
    'use strict';

    const express = require('express');
    const router = express.Router();

    const middleware = require('./module')().middleware;
  
    router.get("/oauth/redirect", middleware.getD2Auth);

    module.exports = router;
    
})();