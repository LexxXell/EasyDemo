import { User } from '../../../../types/user';

export async function firstCreateUserSingleTask(user: User) {
  const userSingleTask = await strapi.entityService.count('api::user-single-task.user-single-task', {
    filters: { user: { id: user.id } },
  });
  if (userSingleTask) {
    throw new Error('userSingleTask already exist');
  }
  await strapi.entityService.create('api::user-single-task.user-single-task', { data: { user } });
}
