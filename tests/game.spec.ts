import { test, expect } from '@playwright/test';
import { puzzles } from '../src/shared/puzzles';
import { solve } from '../src/shared/solver';

test('mobile: invalid tap, loss, retry, win, exact undo, refresh and spoiler-free share', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/game.html?date=2026-12-07');
  const stop = (name: string) =>
    page.getByRole('button', { name: new RegExp(`^${name}\\.`) });
  await expect(
    page.getByRole('heading', { name: 'The Market temptation' })
  ).toBeVisible();
  await stop('Clinic').click();
  await expect(
    page.getByText('No direct connection.', { exact: false })
  ).toBeVisible();
  await expect(page.locator('.moves strong')).toHaveText('6');
  for (const name of [
    'Market',
    'Terminus',
    'Market',
    'Terminus',
    'Market',
    'Terminus',
  ])
    await stop(name).click();
  await expect(
    page.getByRole('heading', { name: 'One detour too many.' })
  ).toBeVisible();
  await page.getByRole('button', { name: '↻ Retry', exact: true }).click();
  for (const name of [
    'Junction',
    'Library',
    'Junction',
    'Market',
    'Depot',
    'Clinic',
  ])
    await stop(name).click();
  await expect(
    page.getByRole('heading', { name: 'Nice route, conductor.' })
  ).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Your completed ride' })
  ).toBeFocused();
  await expect(page.locator('.score-stamp')).toHaveText('SHORTEST ROUTE');
  await expect(
    page.getByText('6/6 moves · Shortest possible: 6', { exact: true })
  ).toBeVisible();
  await page.getByRole('button', { name: '↶ Undo', exact: true }).click();
  await expect(page.locator('.moves strong')).toHaveText('1');
  await expect(page.locator('.errands .done')).toHaveCount(2);
  await expect(
    page.getByRole('heading', { name: 'Nice route, conductor.' })
  ).toHaveCount(0);
  await stop('Clinic').click();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Nice route, conductor.' })
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Compare in the Reddit thread' })
    .click();
  await expect(page.locator('textarea')).toHaveValue(/All 3 errands done/);
  await expect(page.locator('textarea')).not.toHaveValue(
    /Junction|Market|Clinic|Library/
  );
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy result', exact: true }).click();
  await expect(
    page.getByText('Copied! Paste it into the thread when you’re ready.')
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'All 3 errands done'
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error('Clipboard blocked')),
      },
    });
  });
  await page.getByRole('button', { name: 'Copy result', exact: true }).click();
  await expect(
    page.getByText(
      'Select the result text below and copy it. Nothing has been posted.'
    )
  ).toBeVisible();
  await page.goto('/game.html?date=2026-12-08');
  await expect(page.locator('.moves strong')).toHaveText('6');
  await expect(page.locator('.errands .done')).toHaveCount(0);
});

test('practice teaches first tap and preserves today when returning', async ({
  page,
}) => {
  await page.goto('/game.html?date=2026-12-07');
  await page.getByRole('button', { name: /^Junction\./ }).click();
  await page.getByRole('button', { name: 'First ride? Try practice' }).click();
  await expect(
    page.getByText('Tap Market, the connected stop with a star.')
  ).toBeVisible();
  await page.getByRole('button', { name: /^Market\./ }).click();
  await page.getByRole('button', { name: /^Library\./ }).click();
  await expect(
    page.getByText('2/3 moves · Shortest possible: 2')
  ).toBeVisible();
  await page.getByRole('button', { name: 'Play today’s puzzle' }).click();
  await expect(page.locator('.moves strong')).toHaveText('5');
  await expect(page.locator('[aria-current="location"]')).toHaveAccessibleName(
    /^Junction/
  );
});

test('keyboard-only route and visible focus', async ({ page }) => {
  await page.goto('/game.html?date=2026-12-07');
  await expect(page.locator('.stop')).toHaveCount(7);
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Turn on Exact Route mode' })
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.stop').first()).toBeFocused();
  expect(
    await page
      .locator('.stop')
      .first()
      .evaluate((el) => getComputedStyle(el).outlineStyle)
  ).toBe('solid');
  for (const name of [
    'Junction',
    'Library',
    'Junction',
    'Market',
    'Depot',
    'Clinic',
  ]) {
    for (let i = 0; i < 20; i++) {
      if (
        (
          await page.evaluate(() =>
            document.activeElement?.getAttribute('aria-label')
          )
        )?.startsWith(`${name}.`)
      )
        break;
      await page.keyboard.press('Tab');
    }
    await expect(page.locator(':focus')).toHaveAccessibleName(
      new RegExp(`^${name}\\.`)
    );
    await page.keyboard.press('Enter');
  }
  await expect(
    page.getByRole('heading', { name: 'Nice route, conductor.' })
  ).toBeVisible();
});

test('hovering and pressing map stops never moves their hit targets', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/game.html?date=2026-12-07');
  const market = page.getByRole('button', { name: /^Market\./ });
  const before = await market.boundingBox();
  expect(before).not.toBeNull();
  await market.hover();
  const hovered = await market.boundingBox();
  expect(hovered).toEqual(before);
  await market.focus();
  await page.keyboard.down('Enter');
  const pressed = await market.boundingBox();
  expect(pressed).toEqual(before);
  await page.keyboard.up('Enter');
  await expect(page.locator('[aria-current="location"]')).toHaveAccessibleName(
    /^Market/
  );
});

test('Exact Route mode tightens the budget and the avatar rides between stops', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/game.html?date=2026-12-08');
  await expect(page.locator('.moves strong')).toHaveText('6');

  const avatar = page.locator('.player-token');
  const before = await avatar.boundingBox();
  expect(before).not.toBeNull();

  const exactMode = page.getByRole('button', {
    name: 'Turn on Exact Route mode',
  });
  await exactMode.click();
  await expect(page.locator('.moves strong')).toHaveText('4');
  await expect(
    page.getByRole('button', { name: 'Turn off Exact Route mode' })
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.stop.available')).toHaveCount(0);
  await expect(page.getByText(/shortest budget.*visual ride hints hidden/i)).toBeVisible();

  await page.getByRole('button', { name: /^Market\./ }).click();
  await expect(page.locator('[aria-current="location"]')).toHaveAccessibleName(
    /^Market/
  );
  await expect(
    page.getByRole('button', { name: 'Turn off Exact Route mode' })
  ).toBeDisabled();
  await expect
    .poll(async () => (await avatar.boundingBox())?.x)
    .not.toBe(before!.x);
});

test('all maps fit mobile and desktop in light, dark and reduced motion', async ({
  page,
}) => {
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      for (const [i, p] of puzzles.entries()) {
        await page.goto(
          `/game.html?date=2026-12-${String(i + 7).padStart(2, '0')}`
        );
        await expect(
          page.getByRole('heading', { name: p.title, exact: true })
        ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth
          )
        ).toBe(true);
        const boxes = await page.locator('.stop').evaluateAll((elements) =>
          elements.map((el) => {
            const r = el.getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height };
          })
        );
        for (const b of boxes) {
          expect(b.w).toBeGreaterThanOrEqual(44);
          expect(b.h).toBeGreaterThanOrEqual(44);
        }
        for (let a = 0; a < boxes.length; a++)
          for (let b = a + 1; b < boxes.length; b++) {
            const x = boxes[a]!,
              y = boxes[b]!;
            expect(
              x.x + x.w <= y.x ||
                y.x + y.w <= x.x ||
                x.y + x.h <= y.y ||
                y.y + y.h <= x.y
            ).toBe(true);
          }
      }
      await page.goto('/game.html?date=2026-12-07');
      await expect(page.locator('.stop')).toHaveCount(7);
      await page.screenshot({
        path: `test-results/map-${width}-${scheme}.png`,
        fullPage: true,
      });
    }
  }
});

test('every authored map is winnable through actual rendered controls', async ({
  page,
}) => {
  for (const [i, p] of puzzles.entries()) {
    await page.goto(
      `/game.html?date=2026-12-${String(i + 7).padStart(2, '0')}`
    );
    for (const id of solve(p)!.slice(1)) {
      const name = p.stops.find((s) => s.id === id)!.name;
      await page
        .getByRole('button', { name: new RegExp(`^${name}\\.`) })
        .click();
    }
    await expect(
      page.getByRole('heading', { name: 'Nice route, conductor.' })
    ).toBeVisible();
  }
});

test('server session errors recover and cloud progress requests are ordered', async ({
  page,
}) => {
  let fail = true;
  const saves: string[][] = [];
  await page.route('**/api/init', (route) =>
    route.fulfill({
      status: fail ? 503 : 200,
      json: {
        date: '2026-12-07',
        player: 'test-player',
        canSave: true,
        thread: 'https://www.reddit.com/comments/example/',
      },
    })
  );
  await page.route('**/api/progress', async (route) => {
    saves.push(route.request().postDataJSON().route);
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto('/game.html?server');
  await expect(
    page.getByRole('heading', { name: 'Route unavailable' })
  ).toBeVisible();
  fail = false;
  await page.getByRole('button', { name: 'Try loading again' }).click();
  await page.getByRole('button', { name: /^Junction\./ }).click();
  await page.getByRole('button', { name: /^Library\./ }).click();
  await page.getByRole('button', { name: '↶ Undo', exact: true }).click();
  await expect.poll(() => saves.length).toBe(3);
  expect(saves).toEqual([
    ['T', 'J'],
    ['T', 'J', 'L'],
    ['T', 'J'],
  ]);
});

test('midnight keeps active puzzle and next load starts a clean new day', async ({
  page,
}) => {
  let date = '2026-12-07';
  await page.clock.install({ time: new Date('2026-12-07T23:59:50Z') });
  await page.route('**/api/init', (route) =>
    route.fulfill({ json: { date, player: 'rollover', canSave: false } })
  );
  await page.goto('/game.html?server');
  await page.getByRole('button', { name: /^Junction\./ }).click();
  date = '2026-12-08';
  await page.clock.fastForward(31000);
  await expect(
    page.getByRole('heading', { name: 'The Market temptation' })
  ).toBeVisible();
  await expect(page.locator('.moves strong')).toHaveText('5');
  await page
    .getByRole('button', { name: 'Open today’s puzzle', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Along the line' })
  ).toBeVisible();
  await expect(page.locator('.moves strong')).toHaveText('6');
  await expect(page.locator('.errands .done')).toHaveCount(0);
});

test('expired saves and broken storage leave the route playable', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Storage unavailable');
    };
  });
  await page.route('**/api/init', (route) =>
    route.fulfill({
      json: {
        date: '2026-12-07',
        player: 'expired',
        canSave: true,
        route: ['T', 'not-a-stop'],
      },
    })
  );
  await page.route('**/api/progress', (route) =>
    route.fulfill({ status: 410, json: { error: 'Expired' } })
  );
  await page.goto('/game.html?server');
  await expect(page.locator('.moves strong')).toHaveText('6');
  await page.getByRole('button', { name: /^Junction\./ }).click();
  await expect(
    page.getByText('Session expired for cloud saving.', { exact: false })
  ).toBeVisible();
  await page.getByRole('button', { name: /^Library\./ }).click();
  await expect(page.locator('.moves strong')).toHaveText('4');
  await expect(page.locator('.errands .done')).toHaveCount(1);
});
