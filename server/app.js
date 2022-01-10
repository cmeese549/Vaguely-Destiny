const express = require("express");
const axios = require("axios");
var cors = require("cors");
const FormData = require('form-data');

require('dotenv').config();

const clientID = `${process.env.CLIENT_ID}`;
const clientSecret = `${process.env.API_KEY}`;
const destinyAuthURL = 'https://www.bungie.net/platform/app/oauth/token/';
const api = 'https://www.bungie.net/platform';
const port = 8080;

const app = express();
app.use(cors({ credentials: true, origin: true }));

app.get('/test', (req, res) => {
  console.log(req.headers);
  res.end(JSON.stringify(req.headers));
});

app.get("/oauth/redirect", (req, res) => {
  const form = new URLSearchParams();
  form.append('grant_type', 'authorization_code');
  form.append('code', req.query.code);
  form.append('client_id', clientID);
  axios.post(
    destinyAuthURL,
    form,
    {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded'
      }
    }
  ).then((response) => {
    getDestinyMembershipID(response.data, req, res);
  });
});

function getDestinyMembershipID (data, req, res) {
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
  });
}


app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});