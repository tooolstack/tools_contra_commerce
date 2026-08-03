import { expect, test } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

test('calculator shows invalid input instead of silently calculating zero', async ({ page }) => {
  await page.goto('/calculator-tools');
  await page.getByRole('button',{name:'Loan Calculator',exact:true}).click();
  await page.getByLabel('Loan amount',{exact:true}).fill('');
  await expect(page.getByRole('alert').filter({hasText:'Enter loan amount.'})).toHaveText('Enter loan amount.');
  await expect(page.getByRole('button',{name:'Copy result',exact:true})).toBeDisabled();
});

test('image tool reports source and export quality and downloads the result', async ({ page }) => {
  await page.setContent('<div style="width:2px;height:2px;background:#7c3aed"></div>');
  const tinyPng=await page.screenshot({clip:{x:0,y:0,width:2,height:2}});
  await page.goto('/image-tools');
  await expect(page.getByTestId('image-tools-studio')).toHaveAttribute('data-hydrated','true');
  await page.getByLabel('Choose image',{exact:true}).setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:tinyPng});
  await expect(page.getByText(/Original: 2 × 2px/)).toBeVisible();
  await page.getByRole('button',{name:'Create preview',exact:true}).click();
  await expect(page.getByText(/Export: 2 × 2px/)).toBeVisible();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download',exact:true}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toBe('fixture-compress.webp');
});

test('PDF studio merges a valid local PDF and rejects a disguised file', async ({ page }) => {
  await page.goto('/pdf-document-studio');
  const chooser=page.getByLabel('Choose files',{exact:true});
  await chooser.setInputFiles({name:'not-a-pdf.txt',mimeType:'text/plain',buffer:Buffer.from('unsafe')});
  await expect(page.getByText('Only PDF files are supported.',{exact:true})).toBeVisible();
  const pdf=await PDFDocument.create();pdf.addPage([200,200]);const bytes=await pdf.save();
  await chooser.setInputFiles({name:'one.pdf',mimeType:'application/pdf',buffer:Buffer.from(bytes)});
  await expect(page.getByText(/1 file ready/)).toBeVisible();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Create and download',exact:true}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toBe('merged-document.pdf');
});

test('document generators switch to complete Bangla templates and export a PDF', async ({ page }) => {
  await page.goto('/pdf-document-studio');
  await page.getByRole('button',{name:'Resume to PDF',exact:true}).click();
  await page.getByRole('button',{name:'Document language',exact:true}).click();
  await page.getByRole('option',{name:'বাংলা',exact:true}).click();
  await expect(page.getByLabel('ডকুমেন্টের শিরোনাম',{exact:true})).toHaveValue('পেশাগত জীবনবৃত্তান্ত');
  await expect(page.locator('label').filter({hasText:'বিস্তারিত লেখা'}).locator('textarea')).toHaveValue(/কর্ম-অভিজ্ঞতা/);
  const website=page.locator('label').filter({hasText:'Website URL'}).locator('input');
  await website.fill('example.com');
  await expect(page.getByRole('alert').filter({hasText:'Professional links'})).toContainText('http://');
  await website.fill('https://example.com');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Create and download',exact:true}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toBe('resume-document.pdf');
});

test('teleprompter imports and exports a reusable text script',async({page})=>{
  await page.goto('/teleprompter');
  await page.getByLabel('Import .txt',{exact:true}).setInputFiles({name:'speech.txt',mimeType:'text/plain',buffer:Buffer.from('First paragraph.\n\nSecond paragraph.')});
  const script = page.locator('label').filter({hasText:'Script'}).locator('textarea');
  await expect(script).toHaveValue('First paragraph.\n\nSecond paragraph.');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download .txt',exact:true}).click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toBe('teleprompter-script.txt');
});

test('calculator studio remains stable at mobile width', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/calculator-tools');
  await expect(page.locator('main')).toHaveScreenshot('calculator-mobile.png',{animations:'disabled',maxDiffPixelRatio:0.015});
});
