const defData = {
  pointsUseBlastFaucetReward: 200,
  inviteTokenBlastDepositRewardThreshold: 5,
  inviteTokenBlastDepositReward: 10,
  pointsBlastDepositRewardThreshold: 1,
  pointsBlastDepositReward: 1000,
  pointsEasyXDepositReward: 200,
  pointsEasyXTradeReward: 200,
  pointsLinkTelegramReward: 200,
  pointsLinkTwitterReward: 200,
  pointsUpdateUsernameReward: 200,
  pointsUpdateAvatarReward: 200,
  pointsTelegramEveryGroupSubReward: 100,
  pointsTelegramAllChannelsSubReward: 1000,
  pointsFirstSpinTweetReward: 50,
  pointsTrainingReward: 100,
};

export async function getRewardsConfig() {
  let rewardsConfig = await strapi.entityService.findMany('api::rewards-config.rewards-config');
  if (!rewardsConfig) {
    rewardsConfig = await strapi.entityService.create('api::rewards-config.rewards-config', { data: defData });
    console.log('Created Rewards Config');
  }
  const { id, createdAt, updatedAt, publishedAt, ...config } = rewardsConfig;
  return config;
}
