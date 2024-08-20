import { Context } from '../@types';

export const getUser = async (ctx: Context, next) => {
  try {
    if (ctx.from?.username) {
      ctx.user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { telegram_username: `@${ctx.from.username}` },
        populate: ['tg_channels', 'tg_groups'],
      });
    }
  } catch (e) {
    console.error(e);
    return ctx.replyWithHTML(ctx.i18n.t('internal_error'));
  }
  await next();
};
