export default {
  get: async (ctx) => {
    let { page = 1, pageSize = 100 } = ctx.query;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (isNaN(pageSize) || pageSize < 1) {
      pageSize = 10;
    }

    const leaderboardService = strapi.service('api::leaderboard.leaderboard');

    const result = await leaderboardService.getPage(page, pageSize);

    ctx.send(result);
  },
  me: async (ctx) => {
    const user = ctx.state.user;

    const leaderboardService = strapi.service('api::leaderboard.leaderboard');

    const result = await leaderboardService.getUserRank(user.id);

    ctx.send(result);
  },
};
