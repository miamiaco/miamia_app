const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:8081',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const { APP_ID, APP_SECRET, REDIRECT_URI } = process.env;

let longLivedToken = '';

app.get('/auth/facebook', (req, res) => {
  const oauthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email,pages_show_list,instagram_basic,pages_read_engagement,business_management&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}`;
  res.json({ url: oauthUrl });
});

app.get('/auth/facebook/callback', async (req, res) => {
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
    const expirationTime = exchangeTokenResponse.data.expires_in;

    console.log('Generated long-lived token:', longLivedToken);
    console.log('Token Expiration Time:', expirationTime);

    res.json({ longLivedToken, expirationTime });
  } catch (error) {
    console.error('Error exchanging token:', error.message);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

app.get('/media', async (req, res) => {
  const accessToken = longLivedToken;
  const userUrl = `https://graph.facebook.com/v20.0/me/accounts?access_token=${accessToken}`;
  const { limit = 10, offset = 0 } = req.query;

  try {
    const userResponse = await axios.get(userUrl);
    const pages = userResponse.data.data;

    if (pages.length > 0) {
      let allMedia = [];

      await Promise.all(pages.map(async (page) => {
        const pageId = page.id;
        const instagramBusinessAccountUrl = `https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;

        try {
          const instagramResponse = await axios.get(instagramBusinessAccountUrl);
          const instagramBusinessAccountId = instagramResponse.data.instagram_business_account?.id;

          if (instagramBusinessAccountId) {
            const mediaUrl = `https://graph.facebook.com/v20.0/${instagramBusinessAccountId}/media?fields=caption,media_url,media_product_type,media_type,permalink,timestamp&access_token=${accessToken}&limit=${limit}&offset=${offset}`;
            const mediaResponse = await axios.get(mediaUrl);
            const mediaData = mediaResponse.data.data;

            const mediaWithPageInfo = await Promise.all(mediaData.map(async (media) => {
              if (media.media_type === 'VIDEO') {
                const videoMediaUrl = `https://graph.facebook.com/v20.0/${media.id}?fields=thumbnail_url&access_token=${accessToken}`;
                const videoMediaResponse = await axios.get(videoMediaUrl);
                media.thumbnail_url = videoMediaResponse.data.thumbnail_url || null;
              } else {
                media.thumbnail_url = null;
              }

              return {
                id: media.id,
                caption: media.caption || null,
                media_url: media.media_url || null, 
                media_product_type: media.media_product_type || null,
                media_type: media.media_type || null,
                permalink: media.permalink || null,
                thumbnail_url: media.thumbnail_url,
                timestamp: media.timestamp || null,
                pageId: pageId,
                instagramBusinessAccountId: instagramBusinessAccountId,
              };
            }));

            allMedia = allMedia.concat(mediaWithPageInfo);
          }
        } catch (error) {
          console.error(`Error fetching Instagram business account for Page ID ${pageId}:`, error);
        }
      }));

      res.json(allMedia);
    } else {
      res.json({ message: 'No pages found' });
    }
  } catch (error) {
    console.error('Error fetching User ID:', error);
    res.status(500).json({ error: 'Failed to fetch User ID' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});