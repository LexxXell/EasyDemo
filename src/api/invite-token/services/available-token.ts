export async function availableTokens(userId: number): Promise<number> {
  const { availableTokenCount } = (
    await strapi.entityService.findMany('api::invite-token.invite-token-user-data', {
      filters: { user: { id: userId } },
    })
  )[0] || { availableTokenCount: 0 };
  return availableTokenCount;
}
