import { expect, test } from '@playwright/test';

const studios:Record<string,string[]>={
  'pdf-document-studio':['Merge PDFs','Split / extract','Rotate / remove / reorder','Optimize PDF','Images to PDF','PDF to images','Page numbering','Margin adder / fixer','Signature tool','Form filler','Bank statement cleaner','Compare documents','Resume to PDF','Letterhead','Certificate','Meeting minutes','Branded proposal'],
  'social-media-tools':['Instagram Bio Generator','Hashtag Cleaner','Caption Line-Break Formatter','YouTube Timestamp Generator','Thumbnail Title Checker','Facebook Ad Text Formatter','LinkedIn Post Formatter','X / Twitter Thread Splitter','Engagement Rate Calculator','Influencer Rate Calculator','Giveaway Winner Picker','Username Availability Checker'],
  'image-tools':['Image Compressor','Background Remover','Image Resizer','Passport Photo Maker','Product Image Background Cleaner','Image to WebP','WebP to PNG','Blur Face Tool','Screenshot Beautifier','Profile Picture Cropper','Social Media Size Converter','Product Photo Shadow Generator'],
  'developer-tools':['JSON Formatter','JSON Difference Checker','API Response Viewer','JWT Decoder','Regex Tester','Cron Expression Generator','Timestamp Converter','HTML Table Generator','CSS Gradient Generator','Meta Tag Generator','Schema Markup Generator','HTTP Header Checker','Redirect Checker','UTM Builder','.env Difference Checker','SQL Query Formatter','API Error Explainer','Webhook Payload Viewer','Facebook Pixel Event Tester','JSON to TypeScript Interface','Database Schema Visualizer'],
  'website-seo-tools':['Meta Title Length Checker','SERP Preview Tool','Open Graph Preview','Robots.txt Generator','Sitemap Generator','Canonical URL Checker','Broken Link Checker','Keyword Density Checker','Slug Generator','Redirect Mapping Generator','Domain Name Generator','Website Technology Checker','Page Size Calculator','Core Web Vitals Checklist','Facebook In-App Browser Tester','Social Sharing Preview Debugger','Multilingual Slug Generator','Product Schema Generator','Website Launch Checklist Generator'],
  'calculator-tools':['Age Calculator','Date Difference Calculator','Percentage Calculator','Discount Calculator','Loan Calculator','Savings Goal Calculator','Compound Interest Calculator','Working Days Calculator','Time Zone Meeting Calculator','Unit Converter','Fuel Cost Calculator','Electricity Cost Calculator','Split Bill Calculator','Inflation Calculator','How Many Days Until…','International Freelance Rate Calculator','Travel Group Expense Splitter','Work Hours Across Time Zones'],
  'productivity-tools':['Daily Planner Generator','Weekly Time-Block Maker','Priority Matrix','Pomodoro Timer','Habit Streak Calculator','Goal Breakdown Generator','Decision Matrix','Meeting Cost Calculator','Reading Time Calculator','Project Deadline Calculator','Random Task Picker','Focus Session Generator'],
  'education-tools':['GPA Calculator by Country','Grade Percentage Calculator','Citation Generator','Study Schedule Generator','Quiz Generator','Flashcard Generator','Word Counter','Reading Level Checker','Typing Speed Test','Vocabulary Difficulty Checker','Essay Outline Generator','Exam Countdown Planner','Marks Needed Calculator','What Marks Do I Need to Pass?','Final Exam Grade Needed','Study Hours Planner','Question Paper Maker'],
  'career-job-tools':['Resume Bullet Generator','ATS Resume Checker','Cover Letter Generator','Interview Question Generator','Salary Comparison Calculator','Freelance Hourly Rate Calculator','Notice Period Calculator','Job Offer Comparison Tool','Career Decision Matrix','LinkedIn Headline Generator','Professional Bio Generator','Employment Gap Explainer'],
  'health-tools':['BMI Calculator','Water Intake Calculator','Sleep Cycle Calculator','Calorie Calculator','Walking Distance Calculator','Caffeine Timing Calculator','Screen-Time Cost Calculator','Pregnancy Week Calculator','Baby Feeding Tracker','Medicine Reminder Schedule'],
  'travel-tools':['Travel Budget Calculator','Trip Packing List Generator','Visa Photo Maker','Currency Conversion Calculator','Luggage Weight Splitter','Flight Time Calculator','Jet Lag Planner','Fuel & Toll Splitter','Travel Itinerary Generator','Country Power Plug Finder','International Clothing Size Converter','Hotel Price Per Person'],
  'creator-tools':['Video Script Timer','Words-to-Speech-Time','Podcast Episode Planner','Hook Generator','Content Calendar Generator','Sponsorship Rate Calculator','YouTube Revenue Estimator','Short Video Scene Planner','Subtitle Line Breaker','Teleprompter','Brand Collaboration Proposal','Content Repurposing Planner'],
  'text-utility-tools':['Case Converter','Duplicate Line Remover','Text Sorter','Invisible Character Detector','Extra Space Remover','Find and Replace','Text Difference Checker','Random Name Picker','List Randomizer','Number Extractor','Email Extractor','URL Extractor','Emoji Remover','Text to Slug'],
  'home-everyday-tools':['Room Paint Calculator','Tile Calculator','Curtain Size Calculator','Furniture Fit Checker','Moving Box Calculator','Grocery Budget Calculator','Recipe Quantity Converter','Cooking Measurement Converter','AC Size Calculator','Generator Runtime Calculator','Solar Panel Requirement Calculator'],
};

for(const [slug,names] of Object.entries(studios)){
  test(`${slug} opens every bundled tool without runtime failure`,async({page})=>{
    const errors:string[]=[];page.on('pageerror',(error)=>errors.push(error.message));
    await page.goto(`/${slug}`,{waitUntil:'domcontentloaded'});
    for(const name of names){
      const control=page.getByRole('button',{name,exact:true});
      await expect(control,`${name} is missing from ${slug}`).toBeVisible();
      await control.click();
      await expect(control).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}
