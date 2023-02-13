// ? JSON -> Typescript Types generator from the result of `algolia.search()`

export interface AlgoliaSearchResults {
  results: Result[];
}

export interface Result {
  hits: Hit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  exhaustive: Exhaustive;
  query: Query;
  params: string;
  index: string;
  renderingContent: RenderingContent;
  processingTimeMS: number;
  processingTimingsMS: ProcessingTimingsMS;
  serverTimeMS: number;
}

export interface Exhaustive {
  nbHits: boolean;
  typo: boolean;
}

export interface Hit {
  title: Title;
  updated_at: Date;
  _tags: string[];
  handle: Handle;
  vendor: Vendor;
  product_type: ProductType;
  template_suffix: string;
  sku: string;
  barcode: string;
  position: number;
  requires_shipping: boolean;
  taxable: boolean;
  inventory_quantity: number;
  option1: string;
  option2: null | string;
  option3: null;
  id: number;
  tags: any[];
  option_names: OptionName[];
  variants_count: number;
  variants_min_price: number;
  variants_max_price: number;
  variants_inventory_count: number;
  product_image: string;
  published_at: Date;
  body_html_safe: string;
  variant_title: string;
  inventory_policy: InventoryPolicy;
  inventory_management: InventoryManagement;
  inventory_management_shopify: number;
  inventory_available: boolean;
  options: Options;
  price: number;
  compare_at_price: number;
  price_ratio: number;
  price_range: string;
  grams: number;
  weight: Weight;
  image: string;
  named_tags: RenderingContent;
  named_tags_names: any[];
  created_at: Date;
  recently_ordered_count?: number;
  objectID: string;
  _snippetResult: SnippetResult;
  _highlightResult: HighlightResult;
}

export interface HighlightResult {
  title: Barcode;
  handle: Barcode;
  vendor: Barcode;
  product_type: Barcode;
  sku: Barcode;
  barcode: Barcode;
  body_html_safe: Barcode;
  variant_title: Barcode;
}

export interface Barcode {
  value: string;
  matchLevel: MatchLevel;
  matchedWords: Query[];
  fullyHighlighted?: boolean;
}

export enum MatchLevel {
  Full = 'full',
  None = 'none'
}

export enum Query {
  Shirt = 'shirt'
}

export interface SnippetResult {
  body_html_safe: BodyHTMLSafe;
}

export interface BodyHTMLSafe {
  value: string;
  matchLevel: MatchLevel;
}

export enum Handle {
  Ascent275MountainBike21Speed = 'ascent-27-5-mountain-bike-21-speed',
  BeaumontPlusCityBikeStepThrough8Speed = 'beaumont-plus-city-bike-step-through-8-speed',
  CulverRoadBike14Speed = 'culver-road-bike-14-speed',
  ShirtWithImageVariants = 'shirt-with-image-variants'
}

export enum InventoryManagement {
  Shopify = 'shopify'
}

export enum InventoryPolicy {
  Deny = 'deny'
}

export interface RenderingContent {}

export enum OptionName {
  Color = 'color',
  Size = 'size'
}

export interface Options {
  color?: string;
  size?: string;
}

export enum ProductType {
  CityBike = 'City Bike',
  MountainBike = 'Mountain Bike',
  RoadBike = 'Road Bike',
  TShirt = 'T-Shirt'
}

export enum Title {
  Ascent275MountainBike21Speed = 'Ascent 27.5" Mountain Bike - 21 Speed',
  BeaumontPlusCityBikeStepThrough8Speed = 'Beaumont Plus City Bike - Step Through 8 Speed',
  CulverRoadBike14Speed = 'Culver Road Bike - 14 Speed',
  ShirtWithImageVariants = 'Shirt with Image Variants!'
}

export enum Vendor {
  HeliosCycles = 'Helios Cycles'
}

export enum Weight {
  The00Pounds = '0.0POUNDS',
  The240Pounds = '24.0POUNDS',
  The50LB = '5.0lb'
}

export interface ProcessingTimingsMS {
  request: Request;
  total: number;
}

export interface Request {
  roundTrip: number;
}
