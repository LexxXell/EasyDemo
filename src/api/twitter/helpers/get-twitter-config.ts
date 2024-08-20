const defData = {
  linkFollowersThreshold: 50,
};

export async function getTwitterConfig() {
  let twitterConfig = await strapi.entityService.findMany('api::twitter.twitter-config');
  if (!twitterConfig) {
    twitterConfig = await strapi.entityService.create('api::twitter.twitter-config', { data: defData });
  }
  const { id, createdAt, updatedAt, publishedAt, ...config } = twitterConfig;
  return config;
}
