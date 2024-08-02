const axios = require('axios');
const { APP_ID, APP_SECRET, REDIRECT_URI } = process.env;

let longLivedToken = '';

const getAccessToken = async (req, res) => {
    const { code } = req.query;
    const tokenUrl = `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${APP_SECRET}&code=${code}`;
  
    try {
      const tokenResponse = await axios.get(tokenUrl);
      const shortLivedToken = tokenResponse.data.access_token;
  
      const exchangeTokenResponse = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: APP_ID,
          client_secret: APP_SECRET,
          fb_exchange_token: shortLivedToken,
        },
      });
  
      longLivedToken = exchangeTokenResponse.data.access_token;
      
      const expiresIn = 5183944;
      const expirationTime = Math.floor(Date.now() / 1000) + expiresIn;
      const expirationDate = new Date(expirationTime * 1000).toISOString();
  
      console.log('Generated long-lived token:', longLivedToken);
      console.log('Token Expiration Time (Local):', expirationDate.toLocaleString());
  
      res.redirect(`/fetch-facebook-data?token=${encodeURIComponent(longLivedToken)}&expirationDate=${encodeURIComponent(expirationDate)}`);
    } catch (error) {
      res.redirect(`exp://?success=false&error=${encodeURIComponent(error.message)}`);
    }
  };

  module.exports = getAccessToken;