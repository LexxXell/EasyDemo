import { rewardUser } from '../../helpers/reward-user.helper';
import { rewardSingleTask } from '../services/reward-single-task';

export default {
  async me(ctx: any) {
    const user = ctx.state.user;
    let userSingleTasks = (
      await strapi.entityService.findMany('api::user-single-task.user-single-task', {
        filters: { user: { id: user.id } },
      })
    )[0];
    if (!userSingleTasks) {
      userSingleTasks = await strapi.entityService.create('api::user-single-task.user-single-task', { data: { user } });
    }
    ctx.send(sanitiseTasks(userSingleTasks), 200);
  },
  async trained(ctx: any) {
    const user = ctx.state.user;

    const reward = await rewardSingleTask(user, 'IsTrained');

    ctx.send({ reward });
  },
};

function sanitiseTasks(userSingleTasks: any) {
  const { id, createdAt, updatedAt, publishedAt, ...tasks } = userSingleTasks;
  return tasks;
}
