import { Context } from '../@types';

export async function processingCheckUserChannelsSubscription(ctx: Context): Promise<boolean> {
  const chatMemberStatuses = ['member', 'administrator', 'creator'];
  const userSubChannelsIDs = ctx.user?.tg_channels.map((channel) => channel.id);
  const configChannels = ctx.botConfig?.tg_channels.filter((channel) => !userSubChannelsIDs.includes(channel.id));
  for (const channel of configChannels) {
    try {
      const chatMember = await ctx.telegram.getChatMember(channel.ChatID, ctx.from?.id);
      if (!chatMember || !chatMemberStatuses.includes(chatMember.status)) {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  return true;
}
