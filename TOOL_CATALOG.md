# Contra Commerce tool catalog

This catalog maps the requested master list to the tool users can open. A **studio** is one published tool page containing several focused utilities in an organized sidebar. All studios process ordinary inputs locally unless the interface explicitly says it is checking a public URL.

## Focused communication tools

- **Professional Message Rewriter** — contains three explicit workflows: Polite Email Rewriter, Angry Message to Professional Message, and General Professional Rewrite. Users add the original wording, recipient, desired outcome and tone, then copy the revised message.
- **Supplier Message Generator** — creates quotation requests, sample requests and order follow-ups.
- **WhatsApp Reply Generator** — generates reusable English or Bangla customer, order, delivery, payment, complaint and supplier replies with local presets and recent replies.

## Social Media Tools — 12 utilities

Instagram Bio Generator, Hashtag Cleaner, Caption Line-Break Formatter, YouTube Timestamp Generator, Thumbnail Title Checker, Facebook Ad Text Formatter, LinkedIn Post Formatter, X/Twitter Thread Splitter, Engagement Rate Calculator, Influencer Rate Calculator, Giveaway Winner Picker, and Social Username Availability Checker.

Purpose: create platform-ready content, check formatting limits, calculate performance and run community workflows without repeatedly switching pages.

## Image Tools — 12 utilities

Image Compressor, Background Remover, Image Resizer, Passport Photo Maker, Product Image Background Cleaner, Image to WebP, WebP to PNG, Blur Face Tool, Screenshot Beautifier, Profile Picture Cropper, Social Media Size Converter, and Product Photo Shadow Generator.

Purpose: perform private browser-based canvas editing and export. Passport dimensions and colour-based background removal include limitations so users know when official verification or manual refinement is still required.

## PDF & Document Studio — 19 capabilities

Merge PDFs; Split/Extract; Rotate, Remove and Reorder; lossless PDF optimization; Images to PDF; PDF to high-resolution PNG/JPEG; Page Numbering; Margin Adder/Fixer; Signature Tool; Form Filler; Bank Statement Cleaner; Document Comparison; Resume to PDF; Letterhead; Certificate; Meeting Minutes; Branded Proposal; Invoice PDF Generator; and Printable Packing List Generator.

Purpose: provide one private workspace for PDF editing, conversion, printing fixes and polished document generation. Each mode now explains what it changes. The separate Professional Invoice Generator supplies branded English/Bangla invoices and packing slips with PDF/print output.

## Developer Tools — 21 utilities

JSON Formatter, JSON Difference Checker, API Response Viewer, JWT Decoder, Regex Tester, Cron Expression Generator, Timestamp Converter, HTML Table Generator, CSS Gradient Generator, Meta Tag Generator, Schema Markup Generator, HTTP Header Checker, Redirect Checker, UTM Builder, `.env` Difference Checker, SQL Query Formatter, API Error Explainer, Webhook Payload Viewer, Facebook Pixel Event Tester, JSON to TypeScript Interface, and Database Schema Visualizer.

Public URL checks use a guarded server endpoint that rejects credentials, private addresses and non-standard ports. JWT decoding explicitly does not claim signature verification.

## Website & SEO Tools — 19 utilities

Meta Title Length Checker, SERP Preview, Open Graph Preview, Robots.txt Generator, Sitemap Generator, Canonical URL Checker, Broken Link Checker, Keyword Density Checker, Slug Generator, Redirect Mapping Generator, Domain Name Generator, Website Technology Checker, Page Size Calculator, Core Web Vitals Checklist, Facebook In-App Browser Tester, Social Sharing Preview Debugger, Multilingual Slug Generator, Product Schema Generator, and Website Launch Checklist Generator.

## Calculator Tools — 18 utilities

Age, Date Difference, Percentage, Discount, Loan, Savings Goal, Compound Interest, Working Days, Time Zone Meeting, Unit, Fuel Cost, Electricity Cost, Split Bill and Inflation calculators, plus How Many Days Until, International Freelance Rate, Travel Group Expense Splitter and Work Hours Across Time Zones.

## Personal Productivity Tools — 12 utilities

Daily Planner, Weekly Time-Block Maker, Priority Matrix, Pomodoro Timer, Habit Streak, Goal Breakdown, Decision Matrix, Meeting Cost, Reading Time, Project Deadline, Random Task Picker and Focus Session Generator.

## Education Tools — 17 utilities

GPA by Country, Grade Percentage, Citation Generator, Study Schedule, Quiz, Flashcards, Word Counter, Reading Level, Typing Speed, Vocabulary Difficulty, Essay Outline, Exam Countdown, Marks Needed, What Marks Do I Need to Pass, Final Exam Grade Needed, Study Hours Planner and Question Paper Maker.

## Career & Job Tools — 12 utilities

Resume Bullet Generator, ATS Resume Checker, Cover Letter Generator, Interview Question Generator, Salary Comparison, Freelance Hourly Rate, Notice Period, Job Offer Comparison, Career Decision Matrix, LinkedIn Headline, Professional Bio and Employment Gap Explainer.

## Health & Lifestyle Calculators — 10 utilities

BMI, Water Intake, Sleep Cycle, Calorie, Walking Distance, Caffeine Timing, Screen-Time Cost and Pregnancy Week calculators, plus Baby Feeding Tracker and Medicine Reminder Schedule Generator.

These are informational estimates only. The studio displays a health disclaimer and does not diagnose conditions or calculate medicine doses.

## Travel Tools — 12 utilities

Travel Budget, Trip Packing List, Visa Photo Maker, Currency Conversion, Luggage Weight Splitter, Flight Time, Jet Lag Planner, Fuel & Toll Splitter, Travel Itinerary, Country Power Plug Finder, International Clothing Size Converter and Hotel Price Per Person.

## Creator Tools — 12 utilities

Video Script Timer, Words-to-Speech-Time, Podcast Episode Planner, Hook Generator, Content Calendar, Sponsorship Rate, YouTube Revenue Estimator, Short Video Scene Planner, Subtitle Line Breaker, Teleprompter, Brand Collaboration Proposal and Content Repurposing Planner.

## Text & Utility Tools — 14 utilities

Case Converter, Duplicate Line Remover, Text Sorter, Invisible Character Detector, Extra Space Remover, Find and Replace, Text Difference Checker, Random Name Picker, List Randomizer, Number Extractor, Email Extractor, URL Extractor, Emoji Remover and Text to Slug.

## Home & Everyday Tools — 11 utilities

Room Paint, Tile, Curtain Size, Furniture Fit, Moving Box, Grocery Budget, Recipe Quantity, Cooking Measurement, AC Size, Generator Runtime and Solar Panel Requirement calculators.

## Recommended launch tools mapped

- Landed Cost Calculator → **Import Landing Cost & CBM Calculator**
- MOQ Decision Calculator → **MOQ Order Decision Calculator**
- Dead Stock Calculator → **Dead Stock Recovery Calculator**
- Client Profitability Calculator → published focused calculator
- Discount Impact Calculator → **Discount Calculator**, including profit-after-discount comparisons
- Professional/Supplier/WhatsApp messaging → three focused published tools
- Video Script Timer and Teleprompter → standalone tools and also available in Creator Tools
- Caption Formatter → Social Media Tools
- Product Photo Cleaner, Social Image Resizer and Passport Photo Maker → Image Tools
- PDF Print Margin Fixer → PDF & Document Studio
- UTM Link Builder and Social Share Preview → Developer/SEO tools
- Job Offer Comparison, Study Hours, Travel Budget and Room Paint → focused routes plus their category studios

## Quality and verification

- Every requested name is guarded by rendered-coverage tests so removing a capability fails the test suite.
- Representative formula and edge-case tests cover financial, date, health, education, travel, creator and home calculations.
- Large studios are lazy-loaded to reduce initial JavaScript.
- Every major studio supports local draft save/restore and JSON export; file uploads are intentionally excluded.
- Production builds currently generate 91 application routes.
