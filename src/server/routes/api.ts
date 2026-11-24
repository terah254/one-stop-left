import { Hono } from 'hono';
import { context, redis } from '@devvit/web/server';
import { utcDate, restore } from '../../shared/game';
import { scheduled } from '../../shared/puzzles';

export const api = new Hono();
api.get('/init', async (c) => {
  if (!context.postId)
    return c.json({ error: 'Open this game from its Reddit post.' }, 400);
  const date = utcDate();
  let route: unknown;
  let storageError = false;
  if (context.userId) {
    try {
      const saved = await redis.get(`route:v1:${context.userId}:${date}`);
      route = saved ? JSON.parse(saved) : undefined;
    } catch {
      storageError = true;
    }
  }
  return c.json({
    date,
    route,
    storageError,
    canSave: Boolean(context.userId),
    player: context.userId ?? 'guest',
    thread: `https://www.reddit.com/comments/${context.postId.replace('t3_', '')}/`,
  });
});
api.post('/progress', async (c) => {
  if (!context.userId)
    return c.json({ error: 'Guest progress stays on this device.' }, 401);
  const body: unknown = await c.req.json();
  if (
    !body ||
    typeof body !== 'object' ||
    !('date' in body) ||
    typeof body.date !== 'string' ||
    !('route' in body)
  ) {
    return c.json({ error: 'Invalid progress' }, 400);
  }
  const age = Date.now() - Date.parse(`${body.date}T00:00:00Z`);
  if (!Number.isFinite(age) || age < 0 || age > 172800000)
    return c.json({ error: 'Session expired. Open today’s puzzle.' }, 410);
  const p = scheduled(body.date);
  if (!p || !restore(p, body.route))
    return c.json({ error: 'Invalid route' }, 400);
  await redis.set(
    `route:v1:${context.userId}:${body.date}`,
    JSON.stringify(body.route),
    {
      expiration: new Date(Date.now() + 7 * 86400000),
    }
  );
  return c.json({ ok: true });
});
