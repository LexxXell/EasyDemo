export async function setTokenIsUsed(referrer: any, referral: any, token: string) {
  const tokenInstance = (
    await strapi.entityService.findMany('api::invite-token.invite-token', {
      filters: { user: referrer, token },
    })
  )[0];
  if (referrer.wallet === '0x0000000000000000000000000000000000000000') {
    return await strapi.entityService.create('api::invite-token.invite-token', {
      data: { token: tokenInstance.token, usedAt: new Date(), usedBy: referral, availableActivations: 0 },
    });
  }
  if (tokenInstance.availableActivations === 1 || tokenInstance.availableActivations === null) {
    return await strapi.entityService.update('api::invite-token.invite-token', tokenInstance.id, {
      data: { usedAt: new Date(), usedBy: referral },
    });
  }
  await strapi.entityService.create('api::invite-token.invite-token', {
    data: { token: tokenInstance.token, usedAt: new Date(), usedBy: referral, availableActivations: 0 },
  });
  await strapi.entityService.update('api::invite-token.invite-token', tokenInstance.id, {
    data: {
      availableActivations: tokenInstance.availableActivations - 1,
    },
  });
}
