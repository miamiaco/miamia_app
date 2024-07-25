const { APP_ID, REDIRECT_URI } = process.env;

const facebookAuthenticator = async (req, res) =>  {
  const oauthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email,pages_show_list,instagram_basic,pages_read_engagement,business_management&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}`;
  console.log('Generated OAuth URL:', oauthUrl);
  res.json({ url: oauthUrl });
}

module.exports = facebookAuthenticator;