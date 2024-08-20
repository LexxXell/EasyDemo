import Telegraf, { Markup } from 'telegraf';
import { Context } from './@types';
import { botConfig } from './middlewares/bot-config';
import { i18n } from './i18nConfig';
import { getUser } from './middlewares/get-user';
import { checkUserChannelsAlreadySubscripted } from './heplers/check-channels-already-subscripted.helper';
import { processingCheckUserChannelsSubscription } from './heplers/processing-check-subscription.helper';
import { Chat } from './@types/context.type';
import { InlineKeyboardButton } from 'telegraf/typings/markup';
import { checkUserGroupsAlreadySubscripted } from './heplers/check-groups-already-subscripted.helper';
import { rewardUser } from '../api/helpers/reward-user.helper';
import { getRewardsConfig } from '../api/helpers/get-rewards-config';
import { stopRewards } from './middlewares/stop-rewards';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.use(i18n.middleware());

bot.use(botConfig);
bot.use(getUser);
bot.use(stopRewards);

bot.command('start', async (ctx: Context) => {
  try {
    const oAuthRegExp = /^\/start (?<tgOAuthToken>.+)/;
    if (oAuthRegExp.test(ctx.message.text)) {
      if (ctx.user) {
        return ctx.replyWithHTML(ctx.i18n.t('already_linked_accounts', { wallet: ctx.user.wallet }));
      }
      const {
        groups: { tgOAuthToken },
      } = oAuthRegExp.exec(ctx.message.text);

      let user = (
        await strapi.entityService.findMany('plugin::users-permissions.user', {
          filters: { tgOAuthToken },
        })
      )[0];

      if (user) {
        await strapi.entityService.update('plugin::users-permissions.user', user.id, {
          data: {
            tgOAuthToken: null,
            telegram_username: `@${ctx.from.username}`,
            telegram_id: ctx.from.id.toString(),
            // availableSpins: user.availableSpins + 1,
          },
        });
        ctx.user = await strapi.query('plugin::users-permissions.user').findOne({
          where: { telegram_username: `@${ctx.from.username}` },
          populate: ['tg_channels', 'tg_groups'],
        });

        // const rewardsConfig = await getRewardsConfig();
        // await rewardUser(ctx.user, rewardsConfig.pointsLinkTelegramReward, 'telegram');
        await ctx.replyWithHTML(ctx.i18n.t('successfully_linked_accounts'));
      }
    }
  } catch (e) {
    console.error(e);
    await ctx.replyWithHTML(ctx.i18n.t('error_linked_accounts'));
  }

  if (!ctx.user) {
    const keyboard = Markup.inlineKeyboard([
      Markup.urlButton(ctx.i18n.t('register_btn'), ctx.botConfig.ProjectSiteURL),
    ]);
    return ctx.replyWithHTML(
      ctx.i18n.t('unregistered', { link: ctx.botConfig.ProjectSiteURL, projectName: ctx.botConfig.ProjectName }),
      keyboard.extra(),
    );
  }
  const keyboard = Markup.inlineKeyboard([
    ...(await createSubChatKeyboard(ctx.botConfig.tg_channels, ctx)),
    [Markup.callbackButton(ctx.i18n.t('subscribed_btn'), 'subscribed')],
  ]);
  ctx.replyWithHTML(ctx.i18n.t('welcome', { projectName: ctx.botConfig.ProjectName }), keyboard.extra());
});

bot.action('subscribed', async (ctx: Context) => {
  try {
    if (checkUserChannelsAlreadySubscripted(ctx)) {
      ctx.replyWithHTML(ctx.i18n.t('already_subscribed'));
      if (ctx.botConfig.tg_groups.length && !checkUserGroupsAlreadySubscripted(ctx)) {
        const keyboard = Markup.inlineKeyboard(await createSubChatKeyboard(ctx.botConfig.tg_groups, ctx));
        ctx.replyWithHTML(ctx.i18n.t('join_groups', { projectName: ctx.botConfig.ProjectName }), keyboard.extra());
      }
      return;
    }
    if (await processingCheckUserChannelsSubscription(ctx)) {
      const rewardsConfig = await getRewardsConfig();
      try {
        await rewardUser(ctx.user, rewardsConfig.pointsTelegramAllChannelsSubReward, 'telegram');
        await strapi.entityService.update('plugin::users-permissions.user', ctx.user.id, {
          data: {
            tg_channels: ctx.botConfig?.tg_channels.map((channel) => channel.id),
          },
        });
      } catch (e) {
        console.log('Reward error', e);
      }

      ctx.replyWithHTML(ctx.i18n.t('subscribed_reward', { points: rewardsConfig.pointsTelegramAllChannelsSubReward }));
      if (ctx.botConfig.tg_groups.length) {
        const keyboard = Markup.inlineKeyboard(await createSubChatKeyboard(ctx.botConfig.tg_groups, ctx));
        return ctx.replyWithHTML(
          ctx.i18n.t('join_groups', { projectName: ctx.botConfig.ProjectName }),
          keyboard.extra(),
        );
      }
      return;
    } else {
      return ctx.replyWithHTML(ctx.i18n.t('not_subscribed'));
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    return ctx.replyWithHTML('An error occurred while checking your subscription.');
  }
});

bot.on('new_chat_members', async (ctx: Context) => {
  if (ctx.user) {
    const chatName = `@${(ctx.update.message.chat as { username: string }).username}`;
    const chatId = ctx.update.message.chat.id.toString();

    const groups = ctx.botConfig.tg_groups.map((group) => group.ChatID);

    if ((groups.includes(chatName) || groups.includes(chatId)) && !checkUserGroupsAlreadySubscripted(ctx)) {
      const rewardsConfig = await getRewardsConfig();
      try {
        try {
          await rewardUser(ctx.user, rewardsConfig.pointsTelegramEveryGroupSubReward, 'telegram');
          ctx.user.tg_groups.push(
            ctx.botConfig.tg_groups.find((group) => group.ChatID === chatName || group.ChatID === chatId),
          );
          await strapi.entityService.update('plugin::users-permissions.user', ctx.user.id, {
            data: {
              tg_groups: ctx.user.tg_groups,
            },
          });
        } catch (e) {
          console.log('Reward error', e);
        }
        ctx.telegram.sendMessage(
          ctx.from.id,
          ctx.i18n.t('subscribed_group_reward', {
            group: chatName,
            points: rewardsConfig.pointsTelegramEveryGroupSubReward,
          }),
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
});

bot.command('test', async (ctx: Context) => {
  try {
  } catch (e) {
    console.log(e);
  }
});

async function createSubChatKeyboard(chats: Chat[], ctx: Context): Promise<InlineKeyboardButton[][]> {
  const keyboard: InlineKeyboardButton[][] = [];
  for (const chat of chats) {
    const inviteLink = await ctx.telegram.exportChatInviteLink(chat.ChatID);
    keyboard.push([Markup.urlButton(`${ctx.i18n.t('join_btn')} ${chat.ChatID}`, inviteLink)]);
  }
  return keyboard;
}

async function checkUserAvailable(userId: string): Promise<boolean> {
  return Boolean(
    await strapi.entityService.count('plugin::users-permissions.user', { filters: { telegram_id: userId } }),
  );
}

export async function easyxTeleBot(body: any) {
  await bot.handleUpdate(body);
}
