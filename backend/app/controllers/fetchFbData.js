const axios = require('axios');
const prisma = require('../prisma/client');

const fetchIGMediafromFB = async (instagramBusinessAccountId, accessToken) => {
  let mediaUrl = `https://graph.facebook.com/v20.0/${instagramBusinessAccountId}/media?fields=caption,media_url,media_product_type,media_type,permalink,username,timestamp&access_token=${accessToken}`;

  try {
    let hasNextPage = true;

    while (hasNextPage && mediaUrl) {
      const mediaResponse = await axios.get(mediaUrl);
      const mediaData = mediaResponse.data.data;

      await Promise.all(mediaData.map(async (media) => {
        try {
          if (media.media_type === 'VIDEO') {
            const videoMediaUrl = `https://graph.facebook.com/v20.0/${media.id}?fields=thumbnail_url&access_token=${accessToken}`;
            const videoMediaResponse = await axios.get(videoMediaUrl);
            media.thumbnail_url = videoMediaResponse.data.thumbnail_url || null;
          } else {
            media.thumbnail_url = null;
          }

          let existingMedia = await prisma.iG_Media.findUnique({
            where: { id: BigInt(media.id) } 
          });

          if (!existingMedia) {
            await prisma.iG_Media.create({
              data: {
                id: BigInt(media.id),
                caption: media.caption || null,
                media_url: media.media_url || null, 
                media_product_type: media.media_product_type || null,
                media_type: media.media_type || null,
                permalink: media.permalink || null,
                thumbnail_url: media.thumbnail_url,
                timestamp: new Date(media.timestamp) || null,
                ig_business_account_id: instagramBusinessAccountId,
                ig_business_account_username: media.username || null,
              },
            });
          }
        } catch (error) {
          console.error(`Error saving media item with ID ${media.id}:`, error);
        }
      }));

      const paging = mediaResponse.data.paging;
      mediaUrl = paging.next || null;
      hasNextPage = !!mediaUrl;
      console.log('fetching next page of the mediaurl', mediaResponse.data.paging);
    }
  } catch (error) {
    console.error(`Error fetching media for Instagram Business Account ID ${instagramBusinessAccountId}:`, error);
  }
};

const fetchFacebookData = async (req, res) => {
  const accessToken = req.query.token;
  const expirationDate = req.query.expirationDate;

  if (!accessToken || !expirationDate) {
    res.redirect('/auth/facebook');
    return;
  }

  try {
    const userUrl = `https://graph.facebook.com/v20.0/me/accounts?access_token=${accessToken}`;
    const userResponse = await axios.get(userUrl);
    const pages = userResponse.data.data;

    await Promise.all(pages.map(async (page) => {
      const pageId = page.id;
      const instagramBusinessAccountUrl = `https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;

      try {
        const instagramResponse = await axios.get(instagramBusinessAccountUrl);
        const instagramBusinessAccountId = instagramResponse.data.instagram_business_account?.id;

        if (instagramBusinessAccountId) {
          const igAccountDetailsUrl = `https://graph.facebook.com/v20.0/${instagramBusinessAccountId}?fields=name,username&access_token=${accessToken}`;
          const igAccountDetailsResponse = await axios.get(igAccountDetailsUrl);
          const { name, username } = igAccountDetailsResponse.data;

          let creator = await prisma.creators.findUnique({
            where: { ig_business_account_id: instagramBusinessAccountId }
          });

          if (!creator) {
            creator = await prisma.creators.create({
              data: {
                name: name,
                fb_user_access_token: accessToken,
                access_token_expiration: new Date(expirationDate),
                fb_page_id: pageId,
                ig_business_account_id: instagramBusinessAccountId,
                ig_business_account_username: username,
              },
            });
          }
          console.log('Fetching IG media for Instagram Business Account ID:', instagramBusinessAccountId);
          await fetchIGMediafromFB(instagramBusinessAccountId, accessToken);
        }
      } catch (error) {
        console.error(`Error fetching Instagram business account for Page ID ${pageId}:`, error);
      }
    }));

    res.redirect(`exp://?success=true`);
  } catch (error) {
    res.redirect(`exp://?success=false&error=${encodeURIComponent(error.message)}`);
  }
};

module.exports = { fetchFacebookData, fetchIGMediafromFB };