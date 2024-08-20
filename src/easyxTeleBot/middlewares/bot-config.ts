import { Context } from '../@types';
import { BotConfig } from '../@types/context.type';

export const botConfig = async (ctx: Context, next) => {
  try {
    let { id, ...botConfig } = await strapi.entityService.findMany('api::telegram-bot-config.telegram-bot-config', {
      fields: ['ProjectName', 'ProjectSiteURL'],
      populate: ['tg_channels', 'tg_groups'],
    });
    if (!botConfig) {
      throw new Error('Telegram Bot Config not specified');
    }
    if (!botConfig.tg_channels?.length) {
      throw new Error('Telegram Bot Config Channels not specified');
    }
    ctx.botConfig = botConfig as BotConfig;
  } catch (e) {
    console.error(e);
    return ctx.replyWithHTML(ctx.i18n.t('internal_error'));
  }
  await next();
};
