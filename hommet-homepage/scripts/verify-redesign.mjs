// Checks the animated redesign against a running dev server (npm run dev, port 5173).
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const URL = process.env.URL ?? 'http://127.0.0.1:5173/';
await fs.mkdir('qa', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const problems = [];
const check = (ok, label, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  ' + detail : ''}`); if (!ok) problems.push(label); };

// Scroll the page slowly so every scroll-triggered reveal fires, then return to the top.
const scrollThrough = async page => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 350) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(1800);
};
const hidden = page => page.evaluate(() => [...document.querySelectorAll('.invisible')].filter(el => getComputedStyle(el).visibility === 'hidden' || +getComputedStyle(el).opacity < 0.99).length);

async function run(label, viewport, options = {}) {
  const context = await browser.newContext({ viewport, ...options });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  return { page, errors, context };
}

// 1. Desktop, full motion
{
  const { page, errors, context } = await run('desktop', { width: 1440, height: 900 });
  await page.screenshot({ path: 'qa/redesign-hero.png' });
  check(await page.locator('.shop-copy h2 .split-char').count() > 3, 'hero title is split into letters');
  check(await page.locator('.shop-hero canvas').count() === 0, 'hero has no grain canvas');
  check(await page.locator('.shop-copy h2').innerText().then(t => t.trim().length > 0), 'hero title has text');
  const glass = () => page.locator('.chatbot').evaluate(e => e.classList.contains('on-hero') && getComputedStyle(e.querySelector('.chat-launcher')).backdropFilter !== 'none');
  check(await glass(), 'chat button is glass over the hero');
  await scrollThrough(page);
  check(!(await page.locator('.chatbot.on-hero').count()) && await page.locator('.chat-launcher').evaluate(e => getComputedStyle(e).backdropFilter === 'none'), 'chat button is normal (solid) below the hero');
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(900);
  check(await glass(), 'chat button is glass again after scrolling back to the hero');
  check(await hidden(page) === 0, 'every scroll reveal ended visible', `hidden=${await hidden(page)}`);
  check(await page.locator('.section-heading h2 .split-word').count() > 5, 'section headings split into words');
  check(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'no horizontal overflow (desktop)');
  check(await page.locator('a[href*="wa.me"]').count() >= 6, 'WhatsApp quote links still present', `count=${await page.locator('a[href*="wa.me"]').count()}`);
  await page.screenshot({ path: 'qa/redesign-desktop-full.png', fullPage: true });
  await page.locator('.showcase-feature-open').first().click();
  check(await page.getByRole('dialog').isVisible(), 'featured tile still opens the category dialog');
  await page.keyboard.press('Escape');
  // The launcher floats continuously, so Playwright never sees it as "stable"; force the click.
  await page.getByRole('button', { name: /Ask Homi/i }).click({ force: true });
  check(await page.getByText('Homi', { exact: false }).first().isVisible(), 'Homi chatbot still opens');
  check(errors.length === 0, 'no console or page errors (desktop)', errors.slice(0, 3).join(' | '));
  await context.close();
}

// 2. Reduced motion: nothing hidden, nothing split, no canvas, without needing to scroll
{
  const { page, errors, context } = await run('reduced', { width: 1440, height: 900 }, { reducedMotion: 'reduce' });
  check(await page.locator('.split-char, .split-word').count() === 0, 'reduced motion: no split text');
  check(await hidden(page) === 0, 'reduced motion: nothing starts hidden', `hidden=${await hidden(page)}`);
  await page.screenshot({ path: 'qa/redesign-reduced-full.png', fullPage: true });
  check(errors.length === 0, 'no console or page errors (reduced motion)', errors.slice(0, 3).join(' | '));
  await context.close();
}

// 3. Mobile
{
  const { page, errors, context } = await run('mobile', { width: 390, height: 844 }, { hasTouch: true, isMobile: true });
  await page.screenshot({ path: 'qa/redesign-hero-mobile.png' });
  check(await page.locator('.shop-actions > div').count() === 0, 'mobile: hero button is not wrapped in a magnet');
  await scrollThrough(page);
  check(await hidden(page) === 0, 'mobile: every scroll reveal ended visible', `hidden=${await hidden(page)}`);
  check(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'no horizontal overflow (mobile)');
  await page.screenshot({ path: 'qa/redesign-mobile-full.png', fullPage: true });
  check(errors.length === 0, 'no console or page errors (mobile)', errors.slice(0, 3).join(' | '));
  await context.close();
}

await browser.close();
console.log(problems.length ? `\n${problems.length} problem(s)` : '\nall checks passed');
process.exit(problems.length ? 1 : 0);
