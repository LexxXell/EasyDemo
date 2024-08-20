import { Context } from '../@types';

export function checkUserGroupsAlreadySubscripted(ctx: Context): boolean {
  try {
    const configGroups = ctx.botConfig?.tg_groups.map((channel) => channel.id);
    const userSubGroups = ctx.user?.tg_groups.map((channel) => channel.id);
    return configGroups.every((chID) => userSubGroups.includes(chID));
  } catch {
    return false;
  }
}
