import { User } from '../../../../types/user';

export async function getEasyXUserData(user: User) {
  const exUserData = (
    await strapi.entityService.findMany('api::easyx-user-data.easyx-user-data', {
      filters: { user: { id: user.id } },
    })
  )[0];
  if (exUserData) {
    return exUserData;
  }

  const newExUserData = await strapi.entityService.create('api::easyx-user-data.easyx-user-data', {
    data: {
      user,
    },
  });

  return newExUserData;
}
