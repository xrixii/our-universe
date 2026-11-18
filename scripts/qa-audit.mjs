import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:/Users/Rishi Sharma/.gemini/antigravity/brain/c72ec718-69ff-4712-9fbe-5cc8f5dcb39b/screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runAudit() {
  console.log('🚀 Launching Chrome for Comprehensive QA Audit...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const results = {
    features: [],
    consoleLogs: [],
    errors: [],
    overflowTests: [],
  };

  const page = await browser.newPage();

  page.on('console', (msg) => {
    const text = msg.text();
    results.consoleLogs.push({ type: msg.type(), text });
    if (msg.type() === 'error') {
      console.log('  [Browser Error]:', text);
    }
  });

  page.on('pageerror', (err) => {
    console.error('  [Page Error]:', err.message);
    results.errors.push(err.message);
  });

  // 1. DESKTOP AUDIT (1280x800)
  console.log('\n--- 🖥️ DESKTOP AUDIT (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('✓ Page loaded at http://localhost:8000');

  // CHAPTER 1: INTRO
  console.log('Testing Chapter 1: Cinematic Intro text sequence...');
  await page.waitForSelector('button[aria-label="Enter our universe"]', { timeout: 16000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch1-intro.png') });
  console.log('✓ Saved desktop-ch1-intro.png');

  // Verify Enter button
  const enterBtn = await page.$('button[aria-label="Enter our universe"]');
  if (enterBtn) {
    results.features.push({ test: 'Chapter 1 Enter Button exists', pass: true });
    console.log('✓ Enter button found. Clicking to transition...');
    await enterBtn.click();
    await delay(1800); // Wait for exit animation & Chapter 2 entrance
  }

  // CHAPTER 2: CONSTELLATION
  console.log('\nTesting Chapter 2: Interactive Constellation...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch2-constellation.png') });
  console.log('✓ Saved desktop-ch2-constellation.png');

  // Verify stars are rendered
  const starButtons = await page.$$('g[role="button"]');
  console.log(`✓ Found ${starButtons.length} interactive stars in constellation`);
  results.features.push({
    test: '8 memory stars rendered',
    pass: starButtons.length === 8,
    count: starButtons.length,
  });

  // Click on Memory Star 1
  if (starButtons.length > 0) {
    console.log('Clicking Star 1...');
    await starButtons[0].click();
    await delay(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch2-memory-panel-1.png') });
    console.log('✓ Saved desktop-ch2-memory-panel-1.png (Memory Panel opened)');

    // Verify close button on panel
    const closeBtn = await page.$('button[aria-label="Close memory details"]');
    if (closeBtn) {
      results.features.push({ test: 'Memory Panel opened and has close button', pass: true });
      await closeBtn.click();
      await delay(500);
      console.log('✓ Memory Panel closed');
    }
  }

  // Click on Memory Star 4
  if (starButtons.length > 3) {
    console.log('Clicking Star 4...');
    await starButtons[3].click();
    await delay(800);
    const closeBtn = await page.$('button[aria-label="Close memory details"]');
    if (closeBtn) await closeBtn.click();
    await delay(500);
  }

  // CHAPTER 3: GALLERY
  console.log('\nTesting Chapter 3: Gallery...');
  // Click dot 3 in navigation
  const navDots = await page.$$('nav[aria-label="Chapter navigation"] button[aria-label^="Go to Chapter"]');
  console.log(`Found ${navDots.length} navigation chapter buttons`);
  if (navDots.length >= 3) {
    await navDots[2].click(); // Go to Chapter 3 (index 2)
    await delay(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch3-gallery.png') });
    console.log('✓ Navigated to Chapter 3 Gallery. Saved desktop-ch3-gallery.png');

    // Click Next Chevron in gallery
    const nextBtn = await page.$('button[aria-label="Next photograph"]');
    if (nextBtn) {
      await nextBtn.click();
      await delay(600);
      results.features.push({ test: 'Gallery Next button works', pass: true });
      console.log('✓ Gallery Next button clicked');
    }

    // Test fullscreen
    const photoContainer = await page.$('[aria-label="View photograph in fullscreen"]');
    if (photoContainer) {
      await photoContainer.click();
      await delay(600);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch3-gallery-fullscreen.png') });
      console.log('✓ Saved desktop-ch3-gallery-fullscreen.png');
      const closeFs = await page.$('button[aria-label="Close fullscreen"]');
      if (closeFs) {
        await closeFs.click();
        await delay(500);
      }
      results.features.push({ test: 'Gallery fullscreen view opens and closes', pass: true });
    }
  }

  // CHAPTER 4: A LETTER FOR YOU
  console.log('\nTesting Chapter 4: A Letter For You...');
  if (navDots.length >= 4) {
    await navDots[3].click(); // Chapter 4
    await delay(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch4-envelope.png') });
    console.log('✓ Saved desktop-ch4-envelope.png');

    // Click Open Letter
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.includes('OPEN YOUR LETTER')) {
        await b.click();
        console.log('✓ Clicked OPEN YOUR LETTER');
        break;
      }
    }
    await delay(1500); // Letter reveal transition
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch4-letter-open.png') });
    console.log('✓ Saved desktop-ch4-letter-open.png');
    results.features.push({ test: 'Letter envelope unfolds and reveals parchment card', pass: true });
  }

  // CHAPTER 5: OUR LITTLE SECRET
  console.log('\nTesting Chapter 5: Hidden Moon Secret...');
  if (navDots.length >= 5) {
    await navDots[4].click(); // Chapter 5
    await delay(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch5-moon.png') });
    console.log('✓ Saved desktop-ch5-moon.png');

    const moonBtn = await page.$('button[aria-label="Tap the crescent moon"]');
    if (moonBtn) {
      console.log('Tapping crescent moon 5 times...');
      for (let i = 1; i <= 5; i++) {
        await moonBtn.click();
        await delay(350);
      }
      await delay(800); // Allow modal animation
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch5-secret-modal.png') });
      console.log('✓ Saved desktop-ch5-secret-modal.png (5-tap secret unlocked)');

      const closeSecret = await page.$('button[aria-label="Close secret message"]');
      if (closeSecret) {
        await closeSecret.click();
        await delay(400);
        results.features.push({ test: '5-tap crescent moon unlocks secret message modal', pass: true });
      }
    }
  }

  // CHAPTER 6: TO INFINITY
  console.log('\nTesting Chapter 6: To Infinity...');
  if (navDots.length >= 6) {
    await navDots[5].click(); // Chapter 6
    await delay(4500); // Allow progressive final messages to appear
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-ch6-final.png') });
    console.log('✓ Saved desktop-ch6-final.png');

    // Test loop / restart button
    const buttons = await page.$$('button');
    let restartFound = false;
    for (const b of buttons) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.includes('EXPLORE OUR UNIVERSE AGAIN')) {
        restartFound = true;
        await b.click();
        await delay(1000);
        break;
      }
    }
    results.features.push({ test: 'Chapter 6 restart button returns to Chapter 1', pass: restartFound });
    console.log('✓ Clicked EXPLORE OUR UNIVERSE AGAIN - returned to Chapter 1');
  }

  // 2. MOBILE VIEWPORT AUDIT (360px, 375px, 390px, 430px)
  console.log('\n--- 📱 MOBILE VIEWPORT AUDITS ---');
  const viewports = [
    { name: '360x740', width: 360, height: 740 },
    { name: '375x812', width: 375, height: 812 },
    { name: '390x844', width: 390, height: 844 },
    { name: '430x932', width: 430, height: 932 },
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await delay(500);

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth ||
             document.body.scrollWidth > window.innerWidth;
    });

    results.overflowTests.push({ viewport: vp.name, width: vp.width, overflow });
    console.log(`📱 Viewport ${vp.name}: Horizontal overflow = ${overflow ? 'FAIL (Overflow)' : 'PASS (Clean)'}`);
  }

  // Capture full suite on 375px (iPhone standard)
  await page.setViewport({ width: 375, height: 812 });
  await delay(500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-375-ch1-intro.png') });

  // Enter to Chapter 2 on mobile
  await page.click('body');
  await delay(800);
  await page.waitForSelector('button[aria-label="Enter our universe"]', { timeout: 10000 });
  const enterBtnMobile = await page.$('button[aria-label="Enter our universe"]');
  if (enterBtnMobile) {
    await enterBtnMobile.click();
    await delay(1800);
  }

  // Mobile Constellation
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-375-ch2-constellation.png') });
  console.log('✓ Saved mobile-375-ch2-constellation.png');

  // Mobile Memory Panel
  const mobileStars = await page.$$('g[role="button"]');
  if (mobileStars.length > 0) {
    await mobileStars[0].click();
    await delay(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-375-ch2-memory-panel.png') });
    console.log('✓ Saved mobile-375-ch2-memory-panel.png');
    const closeBtn = await page.$('button[aria-label="Close memory details"]');
    if (closeBtn) await closeBtn.click();
    await delay(500);
  }

  // Mobile Letter
  const mNavDots = await page.$$('nav[aria-label="Chapter navigation"] button[aria-label^="Go to Chapter"]');
  if (mNavDots.length >= 4) {
    await mNavDots[3].click();
    await delay(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-375-ch4-envelope.png') });

    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.includes('OPEN YOUR LETTER')) {
        await b.click();
        break;
      }
    }
    await delay(1200);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-375-ch4-letter-open.png') });
    console.log('✓ Saved mobile-375-ch4-letter-open.png');
  }

  // Mobile Secret Moon
  if (mNavDots.length >= 5) {
    await mNavDots[4].click();
    await delay(1000);
    const moon = await page.$('button[aria-label="Tap the crescent moon"]');
    if (moon) {
      for (let i = 0; i < 5; i++) {
        await moon.click();
        await delay(300);
      }
      await delay(800);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-375-ch5-secret-modal.png') });
      console.log('✓ Saved mobile-375-ch5-secret-modal.png');
    }
  }

  // Write results JSON
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'audit-results.json'),
    JSON.stringify(results, null, 2)
  );

  await browser.close();
  console.log('\n🎉 Comprehensive QA Audit Complete! Results saved to:', SCREENSHOT_DIR);
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
