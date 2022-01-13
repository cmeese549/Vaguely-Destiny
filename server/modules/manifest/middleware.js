(() => {
    'use strict'

    const axios = require('axios');
    const FormData = require('form-data');

    const bungieConfig = require('../../config/bungie/config');

    const manfiestUtil = require('../../util/manifest-util');

    module.exports = {
        queryManifest
    };

    function queryManifest(req, res) {
        manfiestUtil.queryManifest(req.params.tableName)
        .then(data => res.status(200).send(data))
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        })
    }

})();