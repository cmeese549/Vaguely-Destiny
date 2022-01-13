(() => {
    'use strict'

    const axios = require('axios');
    const FormData = require('form-data');

    const bungieConfig = require('../../config/bungie/config');

    module.exports = {
        getD2Auth
    };

    function getD2Auth (req, res, next) {
        const form = new URLSearchParams();
        form.append('grant_type', 'authorization_code');
        form.append('code', req.query.code);
        form.append('client_id', bungieConfig.clientID);
        axios.post(
        bungieConfig.destinyAuthURL,
        form,
        {
            headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
            }
        }
        ).then((response) => {
        getDestinyMembershipID(response.data, res);
        });
    }

    function getDestinyMembershipID (data, res) {
        let membershipID;
        axios.get(
            `${api}/Destiny2/3/Profile/${data.membership_id}/LinkedProfiles/`,
            {
                headers: {
                "X-API-Key": clientSecret
                }
            }
            ).then(response => {
            membershipID = response.data.Response.profiles[0].membershipId;
            res.redirect(
                `http://localhost:3000?access_token=${data.access_token}&d2membership=${membershipID}`
            );
        })
    }
})();