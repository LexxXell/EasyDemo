const limit: number = 100;

export default {
  async get(ctx: any) {
    try {
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        fields: ['name', 'avatar', 'createdAt'],
        limit,
        sort: 'createdAt:desc',
        populate: { referrer: { fields: ['name', 'avatar'] } },
      });

      ctx.send(users, 200);
    } catch (e) {
      console.log(e);
      ctx.send({ error: (e as Error).message }, 500);
    }
  },
};
