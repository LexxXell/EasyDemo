export default {
  async get(ctx: any) {
    try {
      const user = ctx.state.user;

      const lastRequest = user.LastHistoryRequest || 0;

      const history = await strapi.entityService.findMany('api::reward-history.reward-history', {
        filters: { user_id: user.id },
        fields: ['points', 'timestamp', 'origin'],
        sort: { timestamp: 'desc' },
        limit: 100,
      });

      ctx.send({ lastRequest, history }, 200);
    } catch (e) {
      console.log(e);
      ctx.send({ error: (e as Error).message }, 500);
    }
  },
  async read(ctx: any) {
    const user = ctx.state.user;

    const LastHistoryRequest = Date.now();

    await strapi.entityService.update('plugin::users-permissions.user', user.id, {
      data: {
        LastHistoryRequest,
      },
    });

    ctx.send({ LastHistoryRequest }, 200);
  },
};
