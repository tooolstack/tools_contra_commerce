// Public entry point for @contra/tools-kit.
// Add each new tool's component + logic exports here.

// --- shared UI primitives (optional, for building custom layouts) ---
export * from './components/ui';

// --- Profit Calculator ---
export { ProfitCalculator } from './components/ProfitCalculator';
export type { ProfitCalculatorProps } from './components/ProfitCalculator';
export { calcProfit } from './logic/profit';
export type { CodChargeMode, ProfitInput, ProfitResult } from './logic/profit';

// --- Facebook Ads Break-even ---
export { AdsBreakeven } from './components/AdsBreakeven';
export type { AdsBreakevenProps } from './components/AdsBreakeven';
export { calcAdsBreakeven } from './logic/ads-breakeven';
export type { AdsInput, AdsResult, AdsVerdict } from './logic/ads-breakeven';

// --- Import Landing Cost & CBM ---
export { CbmCalculator } from './components/CbmCalculator';
export type { CbmCalculatorProps } from './components/CbmCalculator';
export { calcCbm } from './logic/cbm';
export type { CbmInput, CbmResult } from './logic/cbm';

// --- Courier Return Loss ---
export { ReturnLossCalculator } from './components/ReturnLossCalculator';
export type { ReturnLossCalculatorProps } from './components/ReturnLossCalculator';
export { calcReturnLoss } from './logic/return-loss';
export type { ReturnLossInput, ReturnLossResult } from './logic/return-loss';

// --- Product Selling Price ---
export { SellingPriceCalculator } from './components/SellingPriceCalculator';
export type { SellingPriceCalculatorProps } from './components/SellingPriceCalculator';
export { calcSellingPrice } from './logic/selling-price';
export type { SellingPriceInput, SellingPriceResult } from './logic/selling-price';

// --- Discount ---
export { DiscountCalculator } from './components/DiscountCalculator';
export type { DiscountCalculatorProps } from './components/DiscountCalculator';
export { calcDiscount } from './logic/discount';
export type {
  BundleResult,
  DiscountInput,
  DiscountResult,
  DiscountRow,
  DiscountStatus,
} from './logic/discount';

// --- Dead Stock Recovery ---
export { DeadStockCalculator } from './components/DeadStockCalculator';
export type { DeadStockCalculatorProps } from './components/DeadStockCalculator';
export { calcDeadStock } from './logic/dead-stock';
export type { DeadStockInput, DeadStockResult } from './logic/dead-stock';

// --- Size Ratio ---
export { SizeRatioCalculator } from './components/SizeRatioCalculator';
export type { SizeRatioCalculatorProps } from './components/SizeRatioCalculator';
export { calcSizeRatio, SIZE_PRESETS } from './logic/size-ratio';
export type { SizeRatioInput, SizeRatioResult } from './logic/size-ratio';

// --- COD Settlement ---
export { CodSettlementCalculator } from './components/CodSettlementCalculator';
export type { CodSettlementCalculatorProps } from './components/CodSettlementCalculator';
export { calcCodSettlement } from './logic/cod-settlement';
export type { CodSettlementInput, CodSettlementResult } from './logic/cod-settlement';

// --- WhatsApp Order Link ---
export { WhatsappLinkGenerator } from './components/WhatsappLinkGenerator';
export type { WhatsappLinkGeneratorProps } from './components/WhatsappLinkGenerator';
export { buildWhatsappLink, normalizeBdPhone } from './logic/whatsapp-link';
export type { WhatsappInput, WhatsappResult } from './logic/whatsapp-link';

// --- Invoice & Packing Slip ---
export { InvoiceGenerator } from './components/InvoiceGenerator';
export type { InvoiceGeneratorProps } from './components/InvoiceGenerator';
export { calcInvoice } from './logic/invoice';
export type { InvoiceInput, InvoiceItem, InvoiceResult } from './logic/invoice';

// --- First-launch focused utility collection ---
export { LaunchToolSuite } from './components/LaunchToolSuite';
export type { LaunchToolSlug } from './components/LaunchToolSuite';
export { PdfDocumentStudio } from './components/PdfDocumentStudio';
export { DeveloperToolsStudio } from './components/DeveloperToolsStudio';
export { WebsiteSeoStudio } from './components/WebsiteSeoStudio';
export { CalculatorToolsStudio } from './components/CalculatorToolsStudio';
export { ProductivityToolsStudio } from './components/ProductivityToolsStudio';
export { EducationToolsStudio } from './components/EducationToolsStudio';
export { CareerToolsStudio } from './components/CareerToolsStudio';
export { HealthToolsStudio } from './components/HealthToolsStudio';
export { TravelToolsStudio } from './components/TravelToolsStudio';
export { CreatorToolsStudio } from './components/CreatorToolsStudio';
export { TextUtilityStudio } from './components/TextUtilityStudio';
export { HomeToolsStudio } from './components/HomeToolsStudio';
export { ImageToolsStudio } from './components/ImageToolsStudio';

// --- Business QR Code ---
export { QrGenerator } from './components/QrGenerator';
export type { QrGeneratorProps } from './components/QrGenerator';
export { buildQrContent, QR_TYPE_OPTIONS } from './logic/qr';
export type { QrInput, QrType } from './logic/qr';

// --- Campaign Offer Builder ---
export { CampaignOfferBuilder } from './components/CampaignOfferBuilder';
export type { CampaignOfferBuilderProps } from './components/CampaignOfferBuilder';
export { buildCampaignOffer, CAMPAIGN_GOALS } from './logic/campaign-offer';
export type { CampaignInput, CampaignResult, CampaignGoal } from './logic/campaign-offer';

// --- Courier Charge Comparison ---
export { CourierChargeComparison } from './components/CourierChargeComparison';
export type { CourierChargeComparisonProps } from './components/CourierChargeComparison';
export {
  compareCourierCharges,
  detectCourierZone,
  COURIER_RATES,
  DISTRICT_OPTIONS,
  ZONE_OPTIONS,
} from './logic/courier-charge';
export type {
  CourierChargeInput,
  CourierChargeResult,
  CourierLocationInput,
  CourierQuote,
  CourierRate,
  CourierRateStatus,
  CourierZone,
} from './logic/courier-charge';

// --- Operational Order Risk ---
export { assessOperationalOrderRisk } from './logic/order-risk';
export type {
  OperationalRiskLevel,
  OrderRiskAssessment,
  OrderRiskEvidence,
  OrderRiskVerdict,
} from './logic/order-risk';


// --- Bangladesh Address Formatter ---
export { AddressFormatter } from './components/AddressFormatter';
export type { AddressFormatterProps } from './components/AddressFormatter';
export { parseAddress, BD_DISTRICTS } from './logic/address-formatter';
export type { AddressInput, AddressResult } from './logic/address-formatter';

// --- Facebook Ad Copy Generator (LLM) ---
export { AdCopyGenerator } from './components/AdCopyGenerator';
export type { AdCopyGeneratorProps } from './components/AdCopyGenerator';

// --- Product Description Generator (LLM) ---
export { ProductDescriptionGenerator } from './components/ProductDescriptionGenerator';
export type { ProductDescriptionGeneratorProps } from './components/ProductDescriptionGenerator';

// --- Fake Order Risk Checker (API) ---
export { FraudChecker } from './components/FraudChecker';
export type { FraudCheckerProps } from './components/FraudChecker';

// --- Courier Parcel Tracking Hub (API) ---
export { ParcelTracking } from './components/ParcelTracking';
export type { ParcelTrackingProps } from './components/ParcelTracking';

// --- Free Store Health Checker (API) ---
export { StoreHealthChecker } from './components/StoreHealthChecker';
export type { StoreHealthCheckerProps } from './components/StoreHealthChecker';

// --- Business Name & Domain Checker ---
export { NameChecker } from './components/NameChecker';
export type { NameCheckerProps } from './components/NameChecker';
export { generateNames } from './logic/name-ideas';
export type { NameIdeasResult } from './logic/name-ideas';

// --- Product Demand Survey Maker ---
export { DemandSurveyMaker } from './components/DemandSurveyMaker';
export type { DemandSurveyMakerProps } from './components/DemandSurveyMaker';
export { encodeSurvey, decodeSurvey, buildSurveyLink } from './logic/demand-survey';
export type { Survey } from './logic/demand-survey';
