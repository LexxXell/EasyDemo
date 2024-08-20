import { User } from '../../../../types/user';
// import { isBaseRewardRefTokens } from '../../../walletAudits/complex/base-reward-ref-tokens';

export type UserRegistrationReward = {
  inviteTokensReward: number;
};

export const baseInviteTokenReward = 5;

export async function firstCreateInviteTokenUserData(user: User): Promise<UserRegistrationReward> {
  const inviteTokenUserDataCount = await strapi.entityService.count('api::invite-token.invite-token-user-data', {
    filters: { user: { id: user.id } },
  });
  if (inviteTokenUserDataCount) {
    throw new Error('invite-token-user-data already exist');
  }
  // if (await isBaseRewardRefTokens(user.wallet)) {
  if (true) {
    await strapi.entityService.create('api::invite-token.invite-token-user-data', {
      data: {
        user,
        availableTokenCount: baseInviteTokenReward,
      },
    });

    return { inviteTokensReward: baseInviteTokenReward };
  }

  await strapi.entityService.create('api::invite-token.invite-token-user-data', {
    data: {
      user,
      availableTokenCount: 0,
    },
  });

  return { inviteTokensReward: 0 };
}
