import { User } from '../../../types/user';
import { RewardOrighin } from '../reward-history/@types/reward-origin';
import { logReward } from './log-reward';

export async function rewardUser(user: User, points: number, origin: RewardOrighin): Promise<boolean> {
  try {
    if (process.env.STOP_REWARD) {
      throw new Error('Rewards are no longer issued!');
    }
    points = Math.round(points);
    if (user.wallet) {
      try {
        const referrerUser = (
          await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: {
              wallet: user.ReferrerWallet,
            },
          })
        )[0];
        if (referrerUser) {
          const refConfig = await strapi.entityService.findMany('api::ref-config.ref-config');
          const refPoints = (points * refConfig.directReferralRewardPercentage) / 100;
          await strapi.entityService.update('plugin::users-permissions.user', referrerUser.id, {
            data: {
              points: Math.floor(Number(referrerUser.points) + refPoints),
            },
          });

          await logReward(referrerUser.id, refPoints, 'referral');

          const indirectReferrerUser = (
            await strapi.entityService.findMany('plugin::users-permissions.user', {
              filters: {
                wallet: referrerUser.ReferrerWallet,
              },
            })
          )[0];

          if (indirectReferrerUser) {
            const refPoints = (points * refConfig.indirectReferralRewardPercentage) / 100;
            await strapi.entityService.update('plugin::users-permissions.user', indirectReferrerUser.id, {
              data: {
                points: Math.floor(Number(indirectReferrerUser.points) + refPoints),
              },
            });
            await logReward(indirectReferrerUser.id, refPoints, 'referral');
          }
        }
      } catch (e) {
        console.log('Referrer reward error:', e);
      }
    }
    await strapi.entityService.update('plugin::users-permissions.user', user.id, {
      data: {
        points: Math.floor(Number(user.points) + points),
      },
    });
    await logReward(user.id, points, origin);
  } catch (e) {
    if (e.message === 'Rewards are no longer issued!') {
      throw e;
    }
    console.log('rewardUser', e);
    return false;
  }
}
