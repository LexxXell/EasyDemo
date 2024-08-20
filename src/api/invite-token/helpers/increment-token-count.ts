export async function incrementTokenCount(userId: number | string, value: number) {
  const { availableTokenCount } = (
    await strapi.entityService.findMany('api::invite-token.invite-token-user-data', {
      filters: { user: { id: userId } },
    })
  )[0];
  return await strapi.entityService.update('api::invite-token.invite-token-user-data', userId, {
    data: {
      availableTokenCount: availableTokenCount + Math.abs(value),
    },
  });
}
