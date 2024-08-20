import { Context } from '../@types';

export function checkUserChannelsAlreadySubscripted(ctx: Context): boolean {
  try {
    const configChannels = ctx.botConfig?.tg_channels.map((channel) => channel.id);
    const userSubChannels = ctx.user?.tg_channels.map((channel) => channel.id);
    return configChannels.every((chID) => userSubChannels.includes(chID));
  } catch {
    return false;
  }
}
