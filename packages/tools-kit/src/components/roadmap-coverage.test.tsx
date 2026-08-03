import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SocialMediaToolSuite } from './SocialMediaToolSuite';
import { DeveloperToolsStudio } from './DeveloperToolsStudio';
import { WebsiteSeoStudio } from './WebsiteSeoStudio';
import { CalculatorToolsStudio } from './CalculatorToolsStudio';
import { ProductivityToolsStudio } from './ProductivityToolsStudio';
import { EducationToolsStudio } from './EducationToolsStudio';
import { CareerToolsStudio } from './CareerToolsStudio';
import { HealthToolsStudio } from './HealthToolsStudio';
import { TravelToolsStudio } from './TravelToolsStudio';
import { CreatorToolsStudio } from './CreatorToolsStudio';
import { TextUtilityStudio } from './TextUtilityStudio';
import { HomeToolsStudio } from './HomeToolsStudio';
import { ImageToolsStudio } from './ImageToolsStudio';
import { PdfDocumentStudio } from './PdfDocumentStudio';
import { LaunchToolSuite } from './LaunchToolSuite';

const text = (node: React.ReactNode) => renderToStaticMarkup(node)
  .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x2F;/g, '/').replace(/\s+/g, ' ');
const assertNames = (markup: string, names: string[]) => names.forEach((name) => expect(markup, `Missing roadmap tool: ${name}`).toContain(name));

describe('master roadmap coverage', () => {
  it('renders every Social Media tool', () => assertNames(text(<SocialMediaToolSuite tool="social-media-tools" />), [
    'Instagram Bio Generator','Hashtag Cleaner','Caption Line-Break Formatter','YouTube Timestamp Generator','Thumbnail Title Checker','Facebook Ad Text Formatter','LinkedIn Post Formatter','X / Twitter Thread Splitter','Engagement Rate Calculator','Influencer Rate Calculator','Giveaway Winner Picker','Username Availability Checker',
    'Image Compressor','Background Remover','Image Resizer','Passport Photo Maker','Product Image Background Cleaner','Image to WebP','WebP to PNG','Blur Face Tool','Screenshot Beautifier','Profile Picture Cropper','Social Media Size Converter','Product Photo Shadow Generator',
  ]));
  it('renders every Developer tool', () => assertNames(text(<DeveloperToolsStudio />), [
    'JSON Formatter','JSON Difference Checker','API Response Viewer','JWT Decoder','Regex Tester','Cron Expression Generator','Timestamp Converter','HTML Table Generator','CSS Gradient Generator','Meta Tag Generator','Schema Markup Generator','HTTP Header Checker','Redirect Checker','UTM Builder','.env Difference Checker','SQL Query Formatter','API Error Explainer','Webhook Payload Viewer','Facebook Pixel Event Tester','JSON to TypeScript Interface','Database Schema Visualizer',
  ]));
  it('renders every Website and SEO tool', () => assertNames(text(<WebsiteSeoStudio />), [
    'Meta Title Length Checker','SERP Preview Tool','Open Graph Preview','Robots.txt Generator','Sitemap Generator','Canonical URL Checker','Broken Link Checker','Keyword Density Checker','Slug Generator','Redirect Mapping Generator','Domain Name Generator','Website Technology Checker','Page Size Calculator','Core Web Vitals Checklist','Facebook In-App Browser Tester','Social Sharing Preview Debugger','Multilingual Slug Generator','Product Schema Generator','Website Launch Checklist Generator',
  ]));
  it('renders every calculator', () => assertNames(text(<CalculatorToolsStudio />), [
    'Age Calculator','Date Difference Calculator','Percentage Calculator','Discount Calculator','Loan Calculator','Savings Goal Calculator','Compound Interest Calculator','Working Days Calculator','Time Zone Meeting Calculator','Unit Converter','Fuel Cost Calculator','Electricity Cost Calculator','Split Bill Calculator','Inflation Calculator','How Many Days Until…','International Freelance Rate Calculator','Travel Group Expense Splitter','Work Hours Across Time Zones',
  ]));
  it('renders every productivity tool', () => assertNames(text(<ProductivityToolsStudio />), [
    'Daily Planner Generator','Weekly Time-Block Maker','Priority Matrix','Pomodoro Timer','Habit Streak Calculator','Goal Breakdown Generator','Decision Matrix','Meeting Cost Calculator','Reading Time Calculator','Project Deadline Calculator','Random Task Picker','Focus Session Generator',
  ]));
  it('renders every education tool', () => assertNames(text(<EducationToolsStudio />), [
    'GPA Calculator by Country','Grade Percentage Calculator','Citation Generator','Study Schedule Generator','Quiz Generator','Flashcard Generator','Word Counter','Reading Level Checker','Typing Speed Test','Vocabulary Difficulty Checker','Essay Outline Generator','Exam Countdown Planner','Marks Needed Calculator','What Marks Do I Need to Pass?','Final Exam Grade Needed','Study Hours Planner','Question Paper Maker',
  ]));
  it('renders every career tool', () => assertNames(text(<CareerToolsStudio />), [
    'Resume Bullet Generator','ATS Resume Checker','Cover Letter Generator','Interview Question Generator','Salary Comparison Calculator','Freelance Hourly Rate Calculator','Notice Period Calculator','Job Offer Comparison Tool','Career Decision Matrix','LinkedIn Headline Generator','Professional Bio Generator','Employment Gap Explainer',
  ]));
  it('renders every health tool', () => assertNames(text(<HealthToolsStudio />), [
    'BMI Calculator','Water Intake Calculator','Sleep Cycle Calculator','Calorie Calculator','Walking Distance Calculator','Caffeine Timing Calculator','Screen-Time Cost Calculator','Pregnancy Week Calculator','Baby Feeding Tracker','Medicine Reminder Schedule',
  ]));
  it('renders every travel tool', () => assertNames(text(<TravelToolsStudio />), [
    'Travel Budget Calculator','Trip Packing List Generator','Visa Photo Maker','Currency Conversion Calculator','Luggage Weight Splitter','Flight Time Calculator','Jet Lag Planner','Fuel & Toll Splitter','Travel Itinerary Generator','Country Power Plug Finder','International Clothing Size Converter','Hotel Price Per Person',
  ]));
  it('renders every creator tool', () => assertNames(text(<CreatorToolsStudio />), [
    'Video Script Timer','Words-to-Speech-Time','Podcast Episode Planner','Hook Generator','Content Calendar Generator','Sponsorship Rate Calculator','YouTube Revenue Estimator','Short Video Scene Planner','Subtitle Line Breaker','Teleprompter','Brand Collaboration Proposal','Content Repurposing Planner',
  ]));
  it('renders every text utility', () => assertNames(text(<TextUtilityStudio />), [
    'Case Converter','Duplicate Line Remover','Text Sorter','Invisible Character Detector','Extra Space Remover','Find and Replace','Text Difference Checker','Random Name Picker','List Randomizer','Number Extractor','Email Extractor','URL Extractor','Emoji Remover','Text to Slug',
  ]));
  it('renders every home tool', () => assertNames(text(<HomeToolsStudio />), [
    'Room Paint Calculator','Tile Calculator','Curtain Size Calculator','Furniture Fit Checker','Moving Box Calculator','Grocery Budget Calculator','Recipe Quantity Converter','Cooking Measurement Converter','AC Size Calculator','Generator Runtime Calculator','Solar Panel Requirement Calculator',
  ]));
  it('renders every image tool', () => assertNames(text(<ImageToolsStudio />), [
    'Image Compressor','Background Remover','Image Resizer','Passport Photo Maker','Product Image Background Cleaner','Image to WebP','WebP to PNG','Blur Face Tool','Screenshot Beautifier','Profile Picture Cropper','Social Media Size Converter','Product Photo Shadow Generator',
  ]));
  it('renders every PDF and specialized document tool', () => assertNames(text(<PdfDocumentStudio />), [
    'Merge PDFs','Split / extract','Rotate / remove / reorder','Optimize PDF','Images to PDF','PDF to images','Page numbering','Margin adder / fixer','Signature tool','Form filler','Resume to PDF','Invoice PDF Generator','Letterhead','Certificate','Meeting minutes','Compare documents','Bank statement cleaner','Printable Packing List','Branded proposal',
  ]));
  it('renders every focused message workflow', () => {
    assertNames(text(<LaunchToolSuite tool="professional-message" />), ['Polite Email Rewriter','Angry Message to Professional Message','General Professional Rewrite','Original message','Desired outcome','Professional','Polite','Firm']);
    assertNames(text(<LaunchToolSuite tool="supplier-message" />), ['Product','Quotation request','Sample request','Order follow-up']);
    assertNames(text(<LaunchToolSuite tool="whatsapp-reply-generator" />), ['WhatsApp-ready reply','Customer enquiry','Complaint response','Supplier reply']);
  });
});
