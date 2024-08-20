import { User } from '../../../types/user';

export type GetReferrerResult = {
  data: { referrer?: User };
  error?: { message: string };
};

export async function getReferrerUserByActiveInviteToken(token: string): Promise<GetReferrerResult> {
  try {
    const inviteToken: { user: any } = (
      await strapi.entityService.findMany('api::invite-token.invite-token', {
        filters: { token, usedAt: null },
        fields: ['id'],
        populate: ['user'],
      })
    )[0];

    if (inviteToken) {
      return { data: { referrer: inviteToken.user } };
    }

    const inviteTokens = await strapi.entityService.findMany('api::invite-token.invite-token', {
      filters: { token },
      fields: ['id', 'usedAt'],
      populate: ['user'],
    });

    if (inviteTokens.length) {
      const message = `The invite code has already been used`;
      return { data: {}, error: { message } };
    } else {
      return { data: {}, error: { message: 'Invite code doesn`t exist' } };
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
