import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: 'One Stop Left · Three errands. Six moves. One matatu map.',
  });
};
