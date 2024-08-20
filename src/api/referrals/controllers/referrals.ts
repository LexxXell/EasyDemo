export default {
  async get(ctx: any) {
    try {
      const user = ctx.state.user;

      const referrals = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters: { ReferrerWallet: user.wallet },
        fields: ['points', 'wallet', 'avatar', 'name'],
        sort: 'points:desc',
      });

      ctx.send({ referrals }, 200);
    } catch (e) {
      console.log(e);
      ctx.send({ error: (e as Error).message }, 500);
    }
  },
};
