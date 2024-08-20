import { rewardUser } from '../../helpers/reward-user.helper';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { normalizeAvatarUrl } from '../../helpers/normalize-avatar-url';
import { getRewardsConfig } from '../../helpers/get-rewards-config';
import { getTwitterConfig } from '../helpers/get-twitter-config';
import { authTwitterClientOAuth, authTwitterClient } from '../constants';

const avatarDir = 'public/avatars/';

export default {
  async connect_callback(ctx) {
    try {
      const user = ctx.state.user;
      const { code, state } = ctx.request.body;

      if (!code || !state) {
        return ctx.badRequest('No code or state');
      }

      if (user.id !== Number(state)) {
        return ctx.badRequest('Wrong state');
      }

      if (user.twitter) {
        return ctx.badRequest('User already linked');
      }

      await authTwitterClientOAuth.requestAccessToken(code as string);
      const userX = await authTwitterClient.users.findMyUser({
        'user.fields': ['name', 'username', 'profile_image_url', 'public_metrics'],
      });

      const {
        name,
        username,
        profile_image_url,
        public_metrics: { followers_count },
      } = userX.data;

      if (!name || !username || !profile_image_url) {
        throw new Error('Missing twitter data');
      }

      const avatarUrl = formatProfileImageUrl(profile_image_url, 'bigger');
      const { relPath } = await downloadImage(avatarUrl, avatarDir, 'avatar_');

      const twitterCount = await strapi.entityService.count('plugin::users-permissions.user', {
        filters: { twitter: userX.data.username },
      });
      if (twitterCount) {
        return ctx.badRequest('Twitter already linked');
      }

      const result = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          twitter: username,
          name: user.name === `User${user.wallet}` ? name : user.name,
          avatar: !user.avatar ? normalizeAvatarUrl(relPath) : user.avatar,
        },
      });

      if (user.name === `User${user.wallet}`) {
        const userSingleTasks = (
          await strapi.entityService.findMany('api::user-single-task.user-single-task', {
            filters: { user: { id: user.id } },
          })
        )[0];
        if (userSingleTasks) {
          await strapi.entityService.update('api::user-single-task.user-single-task', userSingleTasks.id, {
            data: {
              IsProfileUpdatedAvatar: true,
              IsProfileUpdatedUsername: true,
            },
          });
        }
      }

      const twitterConfig = await getTwitterConfig();
      if (
        followers_count < Number(twitterConfig.linkFollowersThreshold || process.env.TWITTER_FOLLOWERS_THRESHOLD || 0)
      ) {
        return ctx.send({ user: result, message: 'No reward. Not enough followers.', points: 0 });
      }

      const rewardsConfig = await getRewardsConfig();
      await rewardUser(user, rewardsConfig.pointsLinkTwitterReward, 'twitter');

      ctx.send({
        user: result,
        message: `Points reward: ${rewardsConfig.pointsLinkTwitterReward}`,
        points: rewardsConfig.pointsLinkTwitterReward,
      });
    } catch (error) {
      console.log(error);
    }
  },
  async connect(ctx) {
    const user = ctx.state.user;
    const authUrl = authTwitterClientOAuth.generateAuthURL({
      state: user.id,
      code_challenge_method: 'plain',
      code_challenge: 'test',
    });
    ctx.send({ authUrl });
  },
};

function formatProfileImageUrl(imageUrl: string, size?: '' | 'normal' | 'bigger' | 'mini'): string {
  const url = imageUrl.replace(/_(normal|bigger|mini)./, size ? `_${size}.` : '.');
  return url;
}

function getTimestampFilepathFromUrl(url: string, dir: string, prefix: string = ''): string {
  return path.resolve(dir, `${prefix}${Date.now()}${path.extname(new URL(url).pathname)}`);
}

async function downloadImage(
  url: string,
  dir: string = '',
  prefix: string = '',
  path: string = getTimestampFilepathFromUrl(url, dir, prefix),
): Promise<{ path: string; relPath: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`downloadImage download Error: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    writeFileSync(path, Buffer.from(buffer));

    const relPath = `${dir}${path.split(dir)[1]}`;

    return { path, relPath };
  } catch (error) {
    console.error('downloadImage', (error as Error).message);
  }
}
