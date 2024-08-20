import { User } from '../../../../types/user';
import { getRewardsConfig } from '../../helpers/get-rewards-config';
import { rewardUser } from '../../helpers/reward-user.helper';

const defaultReward = 50;

type SingleTask = 'IsProfileUpdatedUsername' | 'IsProfileUpdatedAvatar' | 'IsTrained';

export async function rewardSingleTask(user: User, task: SingleTask) {
  try {
    const rewardsConfig = await getRewardsConfig();
    let points = defaultReward;
    switch (task) {
      case 'IsProfileUpdatedAvatar':
        points = rewardsConfig.pointsUpdateAvatarReward;
        break;
      case 'IsProfileUpdatedUsername':
        points = rewardsConfig.pointsUpdateUsernameReward;
        break;
      case 'IsTrained':
        points = rewardsConfig.pointsTrainingReward;
        break;
    }

    if (points === null) {
      points = defaultReward;
    }

    const userSingleTask = (
      await strapi.entityService.findMany('api::user-single-task.user-single-task', {
        filters: { user: { id: user.id } },
      })
    )[0];
    if (userSingleTask[task]) {
      return 0;
    }

    await rewardUser(user, points, 'activity');
    await strapi.entityService.update('api::user-single-task.user-single-task', userSingleTask.id, {
      data: { [task]: true },
    });
    return points;
  } catch (e) {
    console.error('rewardSingleTask ', e);
  }
}
