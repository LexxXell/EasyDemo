import { FreeTokenError } from '../errors/free-token-error';
import { availableTokens } from '../services/available-token';
import { getToken } from '../services/token-generator';
import { updateInviteTokenUserData } from '../services/update-invite-token-user-data';

const tokenLength = parseInt(process.env.INVITE_TOKEN_LENGTH) || 8;

export default {
  async getNew(ctx: any) {
    const user = ctx.state.user;

    await updateInviteTokenUserData(user);

    const availableTokenCount = await availableTokens(user.id);

    const tokenCount = await strapi.entityService.count('api::invite-token.invite-token', {
      filters: { user: { id: user.id } },
    });

    if (tokenCount >= availableTokenCount) {
      return ctx.badRequest(`No active referral links`);
    }

    try {
      const tokens = [];

      for (let count = availableTokenCount - tokenCount; count > 0; count--) {
        try {
          const tokenString = await getToken(tokenLength);
          const token = await strapi.entityService.create('api::invite-token.invite-token', {
            data: {
              user,
              token: tokenString,
              availableActivations: 1,
            },
            fields: ['createdAt', 'token', 'availableActivations'],
          });
          tokens.push(token);
        } catch {}
      }

      if (!tokens.length) {
        throw new FreeTokenError('Unable to find a free referral token. Try again later.');
      }

      const data = {
        tokens: sanitizeTokens(tokens),
        tokenCount: tokenCount + 1,
        maxTokens: availableTokenCount,
      };

      ctx.send(data, 200);
    } catch (e) {
      if (e instanceof FreeTokenError) {
        return ctx.badRequest((e as FreeTokenError).message);
      }
      throw e;
    }
  },
  async getAll(ctx: any) {
    const user = ctx.state.user;

    const availableTokenCount = await availableTokens(user.id);

    const tokens = await strapi.entityService.findMany('api::invite-token.invite-token', {
      filters: { user: { id: user.id } },
      fields: ['createdAt', 'token', 'usedAt', 'availableActivations'],
      populate: { usedBy: { fields: ['avatar', 'wallet', 'name'] } },
    });

    const data = {
      tokens: sanitizeTokens(tokens),
      tokenCount: tokens.length,
      maxTokens: availableTokenCount,
    };

    ctx.send(data, 200);
  },
};

type Token = {
  token: string;
  createdAt: Date;
  usedAt: Date;
  usedBy: any;
  availableActivations: number;
};

function sanitizeTokens(tokens: any[]) {
  return tokens.map((token: Token) => {
    if (token.availableActivations > 1) {
      return { ...token };
    }
    return { ...token, availableActivations: undefined };
  });
}
