import uuid4 from 'uuid4';
import { getOAuthTgLink } from '../utils/get-oauth-link';

export default {
  async login(ctx) {
    const user = ctx.state.user;

    if (user.telegram_id) {
      return ctx.badRequest('Already linked');
    }

    const botConfig = await strapi.entityService.findMany('api::telegram-bot-config.telegram-bot-config');

    const { link, secret } = getOAuthTgLink(botConfig.botName, user.tgOAuthToken || uuid4());

    try {
      await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          tgOAuthToken: secret,
        },
      });
      return ctx.send({ link }, 200);
    } catch (e) {
      console.error(e);
      return ctx.send('Telegram login error', 500);
    }
  },
};
