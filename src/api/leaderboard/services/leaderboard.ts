import { getAdminWallet } from '../../helpers/get-admin-wallet';

export default {
  getPage: async (page: number, pageSize: number) => {
    const start = (page - 1) * pageSize;
    const limit = pageSize;

    const leaderboard = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        wallet: {
          $notIn: ['0x0000000000000000000000000000000000000000', getAdminWallet()],
        },
      },
      fields: ['name', 'points', 'avatar'],
      populate: { referrer: { fields: ['name', 'avatar'] } },
      limit,
      start,
      sort: 'points:desc',
    });

    return { leaderboard };
  },
  getUserRank: async (id: number) => {
    const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        wallet: {
          $notIn: ['0x0000000000000000000000000000000000000000', getAdminWallet()],
        },
      },
      fields: ['points', 'name', 'avatar'],
      populate: { referrer: { fields: ['name', 'avatar'] } },
      sort: 'points:desc',
    });

    const index = users.findIndex((user) => user.id === id);
    const user = users[index];
    const rank = index + 1;

    return { rank, user };
  },
};
