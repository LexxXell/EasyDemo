import { RewardOrighin } from '../reward-history/@types/reward-origin';

export async function logReward(userId: number | string, points: number, origin: RewardOrighin = 'unknown') {
  points = Math.floor(points);

  try {
    await strapi.entityService.create('api::reward-history.reward-history', {
      data: {
        user_id: userId,
        timestamp: Date.now(),
        points,
        origin,
      },
    });
  } catch (e) {
    console.error('Log Reward ERROR', e);
  }
}
