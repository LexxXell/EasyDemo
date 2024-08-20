import { Context } from '../@types';

export const stopRewards = async (ctx: Context, next) => {
  try {
    if (process.env.STOP_REWARD) {
      return ctx.reply('Rewards are no longer issued!');
    }
  } catch (e) {
    console.error(e);
    return ctx.replyWithHTML(ctx.i18n.t('internal_error'));
  }
  await next();
};
