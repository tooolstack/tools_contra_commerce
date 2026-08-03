import { expect, test } from '@playwright/test';
import { TOOLS } from '../lib/tools';

for (const tool of TOOLS) {
  test(`${tool.title} renders cleanly on desktop and mobile`, async ({ page }) => {
    const runtimeErrors:string[]=[];
    page.on('pageerror',(error)=>runtimeErrors.push(error.message));
    page.on('console',(message)=>{
      if(message.type()==='error'&&!message.text().includes('favicon'))runtimeErrors.push(message.text());
    });

    await page.setViewportSize({width:1366,height:900});
    const response=await page.goto(`/${tool.slug}`,{waitUntil:'domcontentloaded'});
    expect(response?.status(),`${tool.slug} returned an unsuccessful status`).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toContainText(tool.title);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),`${tool.slug} overflows horizontally on desktop`).toBe(true);

    await page.setViewportSize({width:390,height:844});
    await page.reload({waitUntil:'domcontentloaded'});
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),`${tool.slug} overflows horizontally on mobile`).toBe(true);
    expect(runtimeErrors,`${tool.slug} logged runtime errors`).toEqual([]);
  });
}
