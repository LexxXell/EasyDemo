import { rewardUser } from '../../helpers/reward-user.helper';

export default {
  async getAll(ctx) {
    const user = ctx.state.user;
    const userTasks = await strapi.entityService.findMany('api::weekly-task.user-task', {
      filters: { user: { id: user.id } },
      fields: [],
      populate: { task: { fields: 'id' } },
    });
    const userTasksIds = userTasks.map((userTask) => userTask?.task?.id);
    const tasks = await strapi.entityService.findMany('api::weekly-task.weekly-task', {
      filters: { expiresIn: { $gte: new Date() } },
      fields: ['id', 'type', 'description', 'reward', 'link'],
    });
    const tasksInfo = tasks.map((task: { id: number | string }) => ({
      ...task,
      done: userTasksIds.includes(task.id),
    }));
    return ctx.send(tasksInfo, 200);
  },
  async get(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    const taskCount = await strapi.entityService.count('api::weekly-task.user-task', {
      filters: { user: { id: user.id }, task: { id } },
    });
    if (taskCount) {
      return ctx.badRequest('Already received');
    }
    const task = (
      await strapi.entityService.findMany('api::weekly-task.weekly-task', {
        filters: { id, expiresIn: { $gte: new Date() } },
      })
    )[0];
    if (!task) {
      return ctx.badRequest('Task not found');
    }
    await rewardUser(user, task.reward, 'activity');
    await strapi.entityService.create('api::weekly-task.user-task', {
      data: { user, task },
    });
    return ctx.send({ status: 'SUCCESS' }, 200);
  },
};
