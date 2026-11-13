import type { FreightSettings } from "@/lib/pricing";

type SeedBrand = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
};

type SeedCategory = {
  slug: string;
  name: string;
  group: "pharma" | "consumables" | "glovx";
  parentSlug?: string;
  description: string;
  tagline?: string;
  image?: string;
  sortOrder: number;
};

type SeedProduct = {
  sku: string;
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  applications: string[];
  images: string[];
  packSize: string;
  unit: string;
  weight?: string;
  basePrice: number;
  taxRate: number;
  moq: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
};

/** Shipping weight of one sellable unit (box, strip, roll, piece) in kg — used by the manual freight worksheet. */
export const PACK_WEIGHT_KG: Record<string, number> = {
  "GLX-NIT-ECO-3G": 0.55,
  "GLX-NIT-STD-4G": 0.62,
  "GLX-NIT-PRM-5G": 0.7,
  "GLX-LAT-PF": 0.6,
  "GLX-VIN-ECO": 0.5,
  "RSM-PAR-650": 0.004,
  "RSM-CET-10": 0.003,
  "RSM-PAN-40": 0.004,
  "RSM-MET-500": 0.004,
  "RSM-ORS-21": 0.024,
  "RSC-MSK-3PLY": 0.35,
  "RSC-N95-MASK": 0.09,
  "RSC-SYR-3ML": 0.03,
  "RSC-IVSET-STD": 0.05,
  "RSC-GAU-SWAB": 0.4,
  "RSC-BAN-CREPE": 1.8,
  "RSC-COT-ROLL": 0.52,
  "RSC-SAN-500": 0.55,
  "RSC-THER-DIG": 0.08,
  "RSC-OXI-FING": 0.12,
};

export const seedBrands: SeedBrand[] = [
  {
    slug: "glov-x",
    name: "GLOV-X",
    tagline: "Medical examination gloves and single-use consumables",
    description:
      "Glov-X is the medical consumables line distributed by RS Medicare Pharma for clinics, hospitals, diagnostic centres, laboratories, medical stores and healthcare facilities. Glov-X products are offered in economic, standard and premium specifications so procurement teams can match the product to the use case and budget.",
  },
  {
    slug: "rs-medicare",
    name: "RS Medicare",
    tagline: "Pharmaceutical range supplied to retailers and institutions",
    description:
      "The RS Medicare pharmaceutical range covers high-rotation generics and institutional requirements. Product availability is confirmed at order review, and batch details are shared with the invoice.",
  },
  {
    slug: "rs-care",
    name: "RS Care",
    tagline: "Hospital and clinic consumables",
    description:
      "RS Care covers everyday medical consumables used across wards, OPDs, diagnostic rooms and nursing stations — wound care, PPE, injection and infusion, diagnostics and hygiene.",
  },
];

export const seedCategories: SeedCategory[] = [
  {
    slug: "pharmaceuticals",
    name: "Pharmaceuticals",
    group: "pharma",
    description:
      "High-rotation generic formulations for retail chemists, nursing homes and institutional pharmacy requirements.",
    tagline: "Retail & institutional pharma range",
    image: "/images/product-pharma.jpg",
    sortOrder: 1,
  },
  { slug: "analgesics", name: "Pain & Fever", group: "pharma", parentSlug: "pharmaceuticals", description: "Everyday pain and fever management formulations.", sortOrder: 1 },
  { slug: "antihistamines", name: "Antihistamines", group: "pharma", parentSlug: "pharmaceuticals", description: "Allergy and antihistamine range for pharmacy counters.", sortOrder: 2 },
  { slug: "gastro-care", name: "Gastro Care", group: "pharma", parentSlug: "pharmaceuticals", description: "Acidity, reflux and gastrointestinal support products.", sortOrder: 3 },
  { slug: "diabetes-care", name: "Diabetes Care", group: "pharma", parentSlug: "pharmaceuticals", description: "Oral diabetes care formulations for repeat pharmacy demand.", sortOrder: 4 },
  { slug: "hydration", name: "ORS & Hydration", group: "pharma", parentSlug: "pharmaceuticals", description: "Oral rehydration and hydration support products.", sortOrder: 5 },
  {
    slug: "medical-consumables",
    name: "Medical Consumables",
    group: "consumables",
    description:
      "Single-use medical disposables and clinical supplies for hospitals, clinics, diagnostic centres and nursing stations.",
    tagline: "Ward-to-OPD essentials",
    image: "/images/product-mask.jpg",
    sortOrder: 2,
  },
  { slug: "examination-gloves", name: "Examination Gloves", group: "consumables", parentSlug: "medical-consumables", description: "Nitrile, latex and vinyl examination gloves.", sortOrder: 1 },
  { slug: "masks-ppe", name: "Masks & PPE", group: "consumables", parentSlug: "medical-consumables", description: "Face masks and personal protective consumables.", sortOrder: 2 },
  { slug: "wound-care", name: "Wound Care", group: "consumables", parentSlug: "medical-consumables", description: "Gauze, bandages and dressing consumables.", sortOrder: 3 },
  { slug: "injection-infusion", name: "Injection & Infusion", group: "consumables", parentSlug: "medical-consumables", description: "Syringes, needles and infusion administration supplies.", sortOrder: 4 },
  { slug: "diagnostics", name: "Diagnostics & Vitals", group: "consumables", parentSlug: "medical-consumables", description: "Basic diagnostic and vitals monitoring devices.", sortOrder: 5 },
  { slug: "hygiene", name: "Hygiene & Disinfection", group: "consumables", parentSlug: "medical-consumables", description: "Hand hygiene and surface disinfection consumables.", sortOrder: 6 },
  {
    slug: "glov-x-range",
    name: "Glov-X Range",
    group: "glovx",
    description:
      "The complete Glov-X medical consumables line — examination gloves across materials and specifications.",
    tagline: "One brand. Three specifications.",
    image: "/images/glovx-nitrile.jpg",
    sortOrder: 3,
  },
  { slug: "glovx-nitrile", name: "Nitrile Gloves", group: "glovx", parentSlug: "glov-x-range", description: "Synthetic nitrile examination gloves in economic, standard and premium weights.", sortOrder: 1 },
  { slug: "glovx-latex", name: "Latex Gloves", group: "glovx", parentSlug: "glov-x-range", description: "Powder-free latex examination gloves for general clinical use.", sortOrder: 2 },
  { slug: "glovx-vinyl", name: "Vinyl Gloves", group: "glovx", parentSlug: "glov-x-range", description: "Light-use vinyl examination gloves.", sortOrder: 3 },
  { slug: "glovx-by-spec", name: "By Specification", group: "glovx", parentSlug: "glov-x-range", description: "Economic, standard and premium specifications for different procurement budgets.", sortOrder: 4 },
  { slug: "glovx-applications", name: "By Application", group: "glovx", parentSlug: "glov-x-range", description: "Glove selection by clinical environment and use case.", sortOrder: 5 },
];

export const seedProducts: SeedProduct[] = [
  {
    sku: "GLX-NIT-ECO-3G",
    slug: "glov-x-economic-nitrile-examination-gloves-3-gram",
    name: "Glov-X Economic Nitrile Examination Gloves — 3 Gram",
    brandSlug: "glov-x",
    categorySlug: "glovx-nitrile",
    subcategory: "Economic Nitrile",
    shortDescription:
      "High-rotation 3 gram nitrile examination gloves for cost-conscious procurement across clinics, diagnostic centres and medical stores.",
    description:
      "Glov-X Economic Nitrile Examination Gloves are a 3 gram nitrile glove positioned for high-rotation, cost-sensitive healthcare procurement. The glove is designed for everyday examination and handling tasks where consumable cost per use is the primary procurement driver. Product pricing is centralised at a single base price, with applicable GST added at checkout and freight calculated separately based on delivery location and order conditions. Product technical documents are shared on request during order review.",
    specifications: {
      Material: "Nitrile (synthetic rubber)",
      Weight: "3 gram",
      Specification: "Economic",
      Type: "Examination glove, non-sterile",
      Size: "S, M, L, XL (mixed carton available)",
      Powder: "Powder-free",
      Colour: "Blue",
      Surface: "Textured fingertips",
      Usage: "Single use",
      Packing: "100 gloves per box",
    },
    applications: ["Clinics", "Diagnostic Centres", "Medical Stores", "Laboratories"],
    images: ["/images/glovx-nitrile.jpg", "/images/hero-supply.jpg"],
    packSize: "100 gloves / box",
    unit: "glove",
    weight: "3 g",
    basePrice: 1,
    taxRate: 12,
    moq: 100,
    stockQuantity: 48000,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    sku: "GLX-NIT-STD-4G",
    slug: "glov-x-standard-nitrile-examination-gloves-4-gram",
    name: "Glov-X Standard Nitrile Examination Gloves — 4 Gram",
    brandSlug: "glov-x",
    categorySlug: "glovx-nitrile",
    subcategory: "Standard Nitrile",
    shortDescription:
      "4 gram nitrile examination gloves balancing durability and consumable cost for busy OPDs and nursing stations.",
    description:
      "Glov-X Standard Nitrile Gloves are a 4 gram examination glove suited to routine OPD, ward and laboratory handling. The standard specification offers a more substantial feel than the economic range while remaining suitable for high-volume procurement. Freight is quoted separately after delivery location review.",
    specifications: {
      Material: "Nitrile (synthetic rubber)",
      Weight: "4 gram",
      Specification: "Standard",
      Type: "Examination glove, non-sterile",
      Size: "S, M, L, XL",
      Powder: "Powder-free",
      Colour: "Blue",
      Usage: "Single use",
      Packing: "100 gloves per box",
    },
    applications: ["Hospitals", "Clinics", "Diagnostic Centres", "Laboratories"],
    images: ["/images/glovx-nitrile.jpg"],
    packSize: "100 gloves / box",
    unit: "glove",
    weight: "4 g",
    basePrice: 1.45,
    taxRate: 12,
    moq: 100,
    stockQuantity: 36000,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    sku: "GLX-NIT-PRM-5G",
    slug: "glov-x-premium-nitrile-examination-gloves-5-gram",
    name: "Glov-X Premium Nitrile Examination Gloves — 5 Gram",
    brandSlug: "glov-x",
    categorySlug: "glovx-nitrile",
    subcategory: "Premium Nitrile",
    shortDescription:
      "5 gram premium nitrile gloves for procedures that call for a heavier, high-tactile examination glove.",
    description:
      "Glov-X Premium Nitrile Examination Gloves use a 5 gram construction for a heavier feel and improved tactile feedback during longer examination sessions. Recommended for premium clinical settings, specialty OPDs and facilities that standardise on a single high-spec glove.",
    specifications: {
      Material: "Nitrile (synthetic rubber)",
      Weight: "5 gram",
      Specification: "Premium",
      Type: "Examination glove, non-sterile",
      Size: "S, M, L, XL",
      Powder: "Powder-free",
      Colour: "Blue",
      Usage: "Single use",
      Packing: "100 gloves per box",
    },
    applications: ["Hospitals", "Clinics", "Laboratories"],
    images: ["/images/glovx-nitrile.jpg"],
    packSize: "100 gloves / box",
    unit: "glove",
    weight: "5 g",
    basePrice: 1.95,
    taxRate: 12,
    moq: 100,
    stockQuantity: 21500,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    sku: "GLX-LAT-PF",
    slug: "glov-x-latex-examination-gloves-powder-free",
    name: "Glov-X Latex Examination Gloves — Powder Free",
    brandSlug: "glov-x",
    categorySlug: "glovx-latex",
    subcategory: "Latex",
    shortDescription:
      "Powder-free latex examination gloves for general clinical examination and handling.",
    description:
      "Glov-X Latex Examination Gloves are powder-free and intended for general clinical examination and handling tasks. Facilities with latex-sensitivity protocols should evaluate the nitrile Glov-X range as an alternative. Base price is per glove; GST and freight are shown separately.",
    specifications: {
      Material: "Natural rubber latex",
      Specification: "Standard",
      Type: "Examination glove, non-sterile",
      Powder: "Powder-free",
      Size: "S, M, L, XL",
      Colour: "Cream",
      Usage: "Single use",
      Packing: "100 gloves per box",
    },
    applications: ["Clinics", "Medical Stores", "Diagnostic Centres"],
    images: ["/images/glovx-latex.jpg"],
    packSize: "100 gloves / box",
    unit: "glove",
    basePrice: 1.2,
    taxRate: 12,
    moq: 100,
    stockQuantity: 18000,
  },
  {
    sku: "GLX-VIN-ECO",
    slug: "glov-x-vinyl-examination-gloves",
    name: "Glov-X Vinyl Examination Gloves",
    brandSlug: "glov-x",
    categorySlug: "glovx-vinyl",
    subcategory: "Vinyl",
    shortDescription:
      "Light-use vinyl examination gloves for short-duration, non-critical handling tasks.",
    description:
      "Glov-X Vinyl Examination Gloves are intended for light-use, short-duration handling where a low-cost disposable glove is appropriate. For clinical examination tasks, the Glov-X nitrile range is recommended by our team based on the use case.",
    specifications: {
      Material: "Vinyl (PVC)",
      Specification: "Economic",
      Type: "Examination glove, non-sterile",
      Powder: "Powder-free",
      Size: "S, M, L, XL",
      Colour: "Clear",
      Usage: "Single use",
      Packing: "100 gloves per box",
    },
    applications: ["Medical Stores", "Healthcare Facilities", "General Medical Use"],
    images: ["/images/glovx-latex.jpg"],
    packSize: "100 gloves / box",
    unit: "glove",
    basePrice: 0.95,
    taxRate: 12,
    moq: 100,
    stockQuantity: 12000,
    isNewArrival: true,
  },
  {
    sku: "RSM-PAR-650",
    slug: "paracetamol-tablets-ip-650-mg",
    name: "Paracetamol Tablets IP 650 mg",
    brandSlug: "rs-medicare",
    categorySlug: "analgesics",
    subcategory: "Pain & Fever",
    shortDescription: "Paracetamol 650 mg tablets in a 10 tablet strip, supplied to pharmacies and institutions.",
    description:
      "Paracetamol Tablets IP 650 mg are supplied as a high-rotation pharmacy line for retail chemists and institutional pharmacy counters. Batch and expiry details are provided with the invoice. Product is supplied against valid trade requirement only.",
    specifications: {
      Composition: "Paracetamol IP 650 mg",
      Packing: "10 tablets / strip",
      "Storage": "Below 30°C, protected from light",
      "Shelf life": "As per batch label",
      "Supply type": "Pharmacy & institution",
    },
    applications: ["Retail Chemists", "Hospitals", "Clinics"],
    images: ["/images/product-pharma.jpg"],
    packSize: "10 tablets / strip",
    unit: "strip",
    basePrice: 18,
    taxRate: 12,
    moq: 20,
    stockQuantity: 4200,
    isBestSeller: true,
  },
  {
    sku: "RSM-CET-10",
    slug: "cetirizine-tablets-10-mg",
    name: "Cetirizine Tablets 10 mg",
    brandSlug: "rs-medicare",
    categorySlug: "antihistamines",
    subcategory: "Antihistamines",
    shortDescription: "Cetirizine 10 mg tablets, a fast-moving antihistamine pharmacy line.",
    description:
      "Cetirizine Tablets 10 mg are supplied for pharmacy counters and institutional requirements. Base price is per strip, with applicable tax and freight billed separately as per order review.",
    specifications: {
      Composition: "Cetirizine 10 mg",
      Packing: "10 tablets / strip",
      Storage: "Below 30°C",
      "Supply type": "Pharmacy & institution",
    },
    applications: ["Retail Chemists", "Clinics"],
    images: ["/images/product-pharma.jpg"],
    packSize: "10 tablets / strip",
    unit: "strip",
    basePrice: 12,
    taxRate: 12,
    moq: 20,
    stockQuantity: 3100,
  },
  {
    sku: "RSM-PAN-40",
    slug: "pantoprazole-tablets-40-mg",
    name: "Pantoprazole Tablets 40 mg",
    brandSlug: "rs-medicare",
    categorySlug: "gastro-care",
    subcategory: "Gastro Care",
    shortDescription: "Pantoprazole 40 mg tablets for gastro care counters and institutional pharmacy stock.",
    description:
      "Pantoprazole Tablets 40 mg are stocked for gastro care pharmacy demand. Supplied in strips with batch details on the invoice. Prices shown are base prices exclusive of applicable GST.",
    specifications: {
      Composition: "Pantoprazole 40 mg",
      Packing: "10 tablets / strip",
      Storage: "Below 30°C",
      "Supply type": "Pharmacy & institution",
    },
    applications: ["Retail Chemists", "Hospitals"],
    images: ["/images/product-pharma.jpg"],
    packSize: "10 tablets / strip",
    unit: "strip",
    basePrice: 32,
    taxRate: 12,
    moq: 20,
    stockQuantity: 2800,
  },
  {
    sku: "RSM-MET-500",
    slug: "metformin-tablets-500-mg",
    name: "Metformin Tablets 500 mg",
    brandSlug: "rs-medicare",
    categorySlug: "diabetes-care",
    subcategory: "Diabetes Care",
    shortDescription: "Metformin 500 mg tablets for repeat pharmacy and institutional supply.",
    description:
      "Metformin Tablets 500 mg form part of the repeat-demand diabetes care range supplied by RS Medicare Pharma. Bulk quantities and institutional schedules can be requested through the bulk enquiry desk.",
    specifications: {
      Composition: "Metformin 500 mg",
      Packing: "10 tablets / strip",
      Storage: "Below 30°C",
      "Supply type": "Pharmacy & institution",
    },
    applications: ["Retail Chemists", "Hospitals", "Clinics"],
    images: ["/images/product-pharma.jpg"],
    packSize: "10 tablets / strip",
    unit: "strip",
    basePrice: 22,
    taxRate: 12,
    moq: 20,
    stockQuantity: 2600,
  },
  {
    sku: "RSM-ORS-21",
    slug: "ors-hydration-powder-21-2-g",
    name: "ORS Hydration Powder 21.2 g",
    brandSlug: "rs-medicare",
    categorySlug: "hydration",
    subcategory: "ORS & Hydration",
    shortDescription: "Oral rehydration powder sachets for pharmacy, clinic and hospital hydration requirements.",
    description:
      "ORS Hydration Powder 21.2 g sachets are a fast-moving hydration line for pharmacies and clinics. Supplied as per pack configuration with quantities and freight confirmed at order review.",
    specifications: {
      Composition: "Oral rehydration salts",
      "Net content": "21.2 g / sachet",
      Packing: "Single sachet",
      Storage: "Cool, dry place",
    },
    applications: ["Retail Chemists", "Clinics", "Hospitals"],
    images: ["/images/product-pharma.jpg"],
    packSize: "1 sachet",
    unit: "sachet",
    basePrice: 8,
    taxRate: 12,
    moq: 50,
    stockQuantity: 9000,
    isFeatured: true,
  },
  {
    sku: "RSC-MSK-3PLY",
    slug: "3-ply-surgical-face-mask",
    name: "3-Ply Surgical Face Mask",
    brandSlug: "rs-care",
    categorySlug: "masks-ppe",
    subcategory: "Masks & PPE",
    shortDescription: "Three-ply disposable face masks for routine clinical and facility use.",
    description:
      "Three-ply disposable face masks with ear loops, supplied in bulk boxes for clinics, hospitals, diagnostic centres and institutional facilities. Base price is per mask, with GST and freight billed separately.",
    specifications: {
      Layers: "3-ply",
      Fastening: "Elastic ear loop",
      Colour: "Blue",
      Usage: "Single use",
      Packing: "100 masks / box",
      Application: "Routine clinical & facility use",
    },
    applications: ["Hospitals", "Clinics", "Diagnostic Centres", "Medical Stores"],
    images: ["/images/product-mask.jpg"],
    packSize: "100 masks / box",
    unit: "mask",
    basePrice: 1.1,
    taxRate: 12,
    moq: 100,
    stockQuantity: 65000,
    isBestSeller: true,
  },
  {
    sku: "RSC-SYR-3ML",
    slug: "disposable-syringe-3ml-with-needle",
    name: "Disposable Syringe 3 ml with Needle",
    brandSlug: "rs-care",
    categorySlug: "injection-infusion",
    subcategory: "Injection & Infusion",
    shortDescription: "3 ml disposable syringe with needle in individual blister packing.",
    description:
      "3 ml disposable syringes with needle are supplied in individually blister-packed form for hospital, clinic and diagnostic use. Available in bulk cartons. Base price is per piece.",
    specifications: {
      Capacity: "3 ml",
      Needle: "23G x 1 inch (24G on request)",
      Packing: "Individual blister, bulk cartons",
      Usage: "Single use",
      "Sterility claim": "As per product label and batch documentation",
    },
    applications: ["Hospitals", "Clinics", "Diagnostic Centres"],
    images: ["/images/product-syringe.jpg"],
    packSize: "100 pcs / box",
    unit: "pc",
    basePrice: 4.2,
    taxRate: 12,
    moq: 100,
    stockQuantity: 24000,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    sku: "RSC-IVSET-STD",
    slug: "iv-infusion-set",
    name: "IV Infusion Set",
    brandSlug: "rs-care",
    categorySlug: "injection-infusion",
    subcategory: "Injection & Infusion",
    shortDescription: "Standard IV infusion administration set for ward and nursing station use.",
    description:
      "Standard disposable IV infusion sets supplied for ward, day-care and nursing station requirements. Bulk pricing is available through the institutional enquiry desk.",
    specifications: {
      Type: "Standard gravity infusion set",
      Packing: "Individual sterile pack",
      Usage: "Single use",
      "Supply type": "Institution only",
    },
    applications: ["Hospitals", "Clinics"],
    images: ["/images/product-syringe.jpg"],
    packSize: "1 set",
    unit: "set",
    basePrice: 14,
    taxRate: 12,
    moq: 50,
    stockQuantity: 5400,
  },
  {
    sku: "RSC-GAU-SWAB",
    slug: "sterile-gauze-swab",
    name: "Sterile Gauze Swab",
    brandSlug: "rs-care",
    categorySlug: "wound-care",
    subcategory: "Wound Care",
    shortDescription: "Sterile gauze swabs for dressing and wound care consumable requirements.",
    description:
      "Sterile gauze swabs supplied for dressing and wound care use across hospitals, clinics and nursing homes. Packs and carton configurations are confirmed at order review.",
    specifications: {
      Type: "Gauze swab",
      Layers: "12 ply",
      Packing: "100 pcs / pack",
      Usage: "Single use",
    },
    applications: ["Hospitals", "Clinics", "Nursing Homes"],
    images: ["/images/product-gauze.jpg"],
    packSize: "100 pcs / pack",
    unit: "pc",
    basePrice: 2.4,
    taxRate: 12,
    moq: 100,
    stockQuantity: 16000,
  },
  {
    sku: "RSC-BAN-CREPE",
    slug: "crepe-bandage-10-cm",
    name: "Crepe Bandage 10 cm",
    brandSlug: "rs-care",
    categorySlug: "wound-care",
    subcategory: "Wound Care",
    shortDescription: "Elastic crepe bandage rolls for support dressing and general ward use.",
    description:
      "Crepe Bandage 10 cm rolls are supplied for support dressing and general ward requirements. Available in bulk cartons with freight quoted separately based on delivery location.",
    specifications: {
      Width: "10 cm",
      Type: "Elastic crepe bandage",
      "Stretch length": "4 m (approx.)",
      Packing: "10 rolls / pack",
      Usage: "Single patient use",
    },
    applications: ["Hospitals", "Clinics", "Medical Stores"],
    images: ["/images/product-gauze.jpg"],
    packSize: "10 rolls / pack",
    unit: "roll",
    basePrice: 38,
    taxRate: 12,
    moq: 10,
    stockQuantity: 3800,
  },
  {
    sku: "RSC-COT-ROLL",
    slug: "absorbent-cotton-roll-500-g",
    name: "Absorbent Cotton Roll 500 g",
    brandSlug: "rs-care",
    categorySlug: "wound-care",
    subcategory: "Wound Care",
    shortDescription: "Absorbent cotton roll for dressing rooms, clinics and pharmacy counters.",
    description:
      "500 g absorbent cotton rolls for dressing and general clinical use. Supplied in bulk cartons for institutions and medical stores.",
    specifications: {
      "Net weight": "500 g",
      Type: "Absorbent cotton roll",
      Packing: "Single roll",
      Storage: "Cool, dry place",
    },
    applications: ["Hospitals", "Clinics", "Medical Stores"],
    images: ["/images/product-gauze.jpg"],
    packSize: "1 roll",
    unit: "roll",
    basePrice: 72,
    taxRate: 12,
    moq: 10,
    stockQuantity: 1900,
  },
  {
    sku: "RSC-SAN-500",
    slug: "hand-sanitizer-500-ml",
    name: "Hand Sanitizer 500 ml",
    brandSlug: "rs-care",
    categorySlug: "hygiene",
    subcategory: "Hygiene & Disinfection",
    shortDescription: "500 ml hand sanitizer bottle for counters, wards and facility hygiene stations.",
    description:
      "500 ml hand sanitizer supplied for pharmacy counters, clinics and facility hygiene stations. Bulk institutional requirements can be quoted through the enquiry desk.",
    specifications: {
      Volume: "500 ml",
      Type: "Hand sanitizer",
      Packing: "1 bottle",
      Storage: "Store away from direct sunlight",
    },
    applications: ["Hospitals", "Clinics", "Medical Stores", "Healthcare Facilities"],
    images: ["/images/product-gauze.jpg"],
    packSize: "1 bottle",
    unit: "bottle",
    basePrice: 85,
    taxRate: 18,
    moq: 12,
    stockQuantity: 1450,
  },
  {
    sku: "RSC-THER-DIG",
    slug: "digital-thermometer",
    name: "Digital Thermometer",
    brandSlug: "rs-care",
    categorySlug: "diagnostics",
    subcategory: "Diagnostics & Vitals",
    shortDescription: "Digital clinical thermometer with flexible tip and quick reading.",
    description:
      "Digital clinical thermometers supplied for clinic, pharmacy and institutional use. Product literature and warranty terms are shared with the supply documentation.",
    specifications: {
      Type: "Digital clinical thermometer",
      Display: "LCD",
      "Measuring unit": "°C / °F",
      Power: "Button cell",
      Packing: "1 unit with case",
    },
    applications: ["Clinics", "Medical Stores", "Hospitals"],
    images: ["/images/product-gauze.jpg"],
    packSize: "1 unit",
    unit: "unit",
    basePrice: 145,
    taxRate: 18,
    moq: 5,
    stockQuantity: 620,
  },
  {
    sku: "RSC-OXI-FING",
    slug: "fingertip-pulse-oximeter",
    name: "Fingertip Pulse Oximeter",
    brandSlug: "rs-care",
    categorySlug: "diagnostics",
    subcategory: "Diagnostics & Vitals",
    shortDescription: "Fingertip pulse oximeter for routine vitals monitoring in clinics and facilities.",
    description:
      "Fingertip pulse oximeters for routine vitals monitoring in clinics, diagnostic centres and facility health rooms. Supplied with standard accessories; device literature is included with the supply.",
    specifications: {
      Type: "Fingertip pulse oximeter",
      Display: "OLED",
      Readings: "SpO2 & pulse rate",
      Power: "2 x AAA batteries",
      Packing: "1 unit with lanyard and pouch",
    },
    applications: ["Clinics", "Diagnostic Centres", "Healthcare Facilities"],
    images: ["/images/product-gauze.jpg"],
    packSize: "1 unit",
    unit: "unit",
    basePrice: 640,
    taxRate: 18,
    moq: 2,
    stockQuantity: 180,
    isNewArrival: true,
  },
  {
    sku: "RSC-N95-MASK",
    slug: "n95-respirator-mask",
    name: "N95 Respirator Mask",
    brandSlug: "rs-care",
    categorySlug: "masks-ppe",
    subcategory: "Masks & PPE",
    shortDescription: "N95 respirator masks with headband fit for facility and clinical use.",
    description:
      "N95 respirator masks supplied for facility and clinical use. Technical documentation is shared on request during order review. Base price is per mask.",
    specifications: {
      Type: "N95 respirator",
      Fastening: "Headband",
      Packing: "10 pcs / box",
      Usage: "Single use",
    },
    applications: ["Hospitals", "Clinics", "Healthcare Facilities"],
    images: ["/images/product-mask.jpg"],
    packSize: "10 pcs / box",
    unit: "pc",
    basePrice: 9,
    taxRate: 12,
    moq: 50,
    stockQuantity: 7800,
    isBestSeller: true,
  },
];

export const seedFaqs = [
  {
    question: "Do I need an account to place an order?",
    answer:
      "No. RS Medicare Pharma supports guest ordering. You can browse the catalogue, add products to the cart and complete checkout with your business and delivery details. Accounts are optional and are intended for customers who want saved details and faster repeat orders.",
    category: "Ordering",
    sortOrder: 1,
  },
  {
    question: "How is pricing structured?",
    answer:
      "Every product carries one centralised base price. Applicable GST is added to the product value at checkout, and freight is calculated separately based on delivery location, order quantity and shipment mode. We do not bake location-specific freight into product prices.",
    category: "Pricing",
    sortOrder: 2,
  },
  {
    question: "When will freight be confirmed?",
    answer:
      "Manual freight review is the default. After your order is received, our team reviews the delivery location, volume and shipment mode, then updates the freight amount on your order. You can track the update with your Order ID and registered mobile number.",
    category: "Freight",
    sortOrder: 3,
  },
  {
    question: "What are the payment options?",
    answer:
      "Available methods are shown at checkout and are controlled by our admin team. Bank transfer, UPI and manual payment verification are commonly enabled. Payment gateway, card/net banking and cash on delivery options can be enabled as operations are set up. Card details are never stored on this website.",
    category: "Payments",
    sortOrder: 4,
  },
  {
    question: "Can institutions request bulk pricing?",
    answer:
      "Yes. Hospitals, clinics, diagnostic centres, distributors, wholesalers and corporate healthcare buyers can submit a bulk or institutional enquiry with product, quantity and delivery location. Our team responds with availability and commercials.",
    category: "B2B",
    sortOrder: 5,
  },
  {
    question: "How do I track my order?",
    answer:
      "Use the Order Tracking page with your Order ID (for example RSM-2026-000001) and the mobile number or email used while ordering. No login is required.",
    category: "Orders",
    sortOrder: 6,
  },
  {
    question: "Are the product images exactly as supplied?",
    answer:
      "Images and specifications are indicative and are provided to help product selection. Packing, labelling and batch presentation can vary between consignments. Where a specification is critical to your procurement, confirm it with our sales team before ordering.",
    category: "Products",
    sortOrder: 7,
  },
  {
    question: "What is the minimum order quantity?",
    answer:
      "Each product listing shows its minimum order quantity (MOQ). MOQ is set per product because medical consumables are usually procured in packs, boxes or cartons rather than single pieces.",
    category: "Ordering",
    sortOrder: 8,
  },
];

export type SeedVariant = {
  sku: string;
  optionType: "size" | "color";
  label: string;
  skuSuffix?: string;
  priceDelta?: number;
  swatch?: string;
  stockQuantity: number;
};

/** Size and colour options per product — editable from the admin product form. */
export const seedVariants: SeedVariant[] = [
  { sku: "GLX-NIT-ECO-3G", optionType: "size", label: "S", skuSuffix: "-S", stockQuantity: 9000 },
  { sku: "GLX-NIT-ECO-3G", optionType: "size", label: "M", skuSuffix: "-M", stockQuantity: 16000 },
  { sku: "GLX-NIT-ECO-3G", optionType: "size", label: "L", skuSuffix: "-L", stockQuantity: 15000 },
  { sku: "GLX-NIT-ECO-3G", optionType: "size", label: "XL", skuSuffix: "-XL", stockQuantity: 8000 },
  { sku: "GLX-NIT-STD-4G", optionType: "size", label: "S", skuSuffix: "-S", stockQuantity: 7000 },
  { sku: "GLX-NIT-STD-4G", optionType: "size", label: "M", skuSuffix: "-M", stockQuantity: 12000 },
  { sku: "GLX-NIT-STD-4G", optionType: "size", label: "L", skuSuffix: "-L", stockQuantity: 11000 },
  { sku: "GLX-NIT-STD-4G", optionType: "size", label: "XL", skuSuffix: "-XL", stockQuantity: 6000 },
  { sku: "GLX-NIT-PRM-5G", optionType: "size", label: "S", skuSuffix: "-S", stockQuantity: 4000 },
  { sku: "GLX-NIT-PRM-5G", optionType: "size", label: "M", skuSuffix: "-M", stockQuantity: 7500 },
  { sku: "GLX-NIT-PRM-5G", optionType: "size", label: "L", skuSuffix: "-L", stockQuantity: 7000 },
  { sku: "GLX-NIT-PRM-5G", optionType: "size", label: "XL", skuSuffix: "-XL", stockQuantity: 3000 },
  { sku: "GLX-LAT-PF", optionType: "size", label: "S", skuSuffix: "-S", stockQuantity: 3500 },
  { sku: "GLX-LAT-PF", optionType: "size", label: "M", skuSuffix: "-M", stockQuantity: 6000 },
  { sku: "GLX-LAT-PF", optionType: "size", label: "L", skuSuffix: "-L", stockQuantity: 5500 },
  { sku: "GLX-LAT-PF", optionType: "size", label: "XL", skuSuffix: "-XL", stockQuantity: 3000 },
  { sku: "GLX-VIN-ECO", optionType: "size", label: "S", skuSuffix: "-S", stockQuantity: 2400 },
  { sku: "GLX-VIN-ECO", optionType: "size", label: "M", skuSuffix: "-M", stockQuantity: 4200 },
  { sku: "GLX-VIN-ECO", optionType: "size", label: "L", skuSuffix: "-L", stockQuantity: 3600 },
  { sku: "GLX-VIN-ECO", optionType: "size", label: "XL", skuSuffix: "-XL", stockQuantity: 1800 },
  { sku: "GLX-NIT-ECO-3G", optionType: "color", label: "Blue", swatch: "#2563eb", stockQuantity: 30000 },
  { sku: "GLX-NIT-ECO-3G", optionType: "color", label: "Black", swatch: "#111827", priceDelta: 0.1, stockQuantity: 12000 },
  { sku: "GLX-NIT-PRM-5G", optionType: "color", label: "Blue", swatch: "#2563eb", stockQuantity: 14000 },
  { sku: "GLX-NIT-PRM-5G", optionType: "color", label: "Violet", swatch: "#7c3aed", priceDelta: 0.15, stockQuantity: 7500 },
  { sku: "RSC-MSK-3PLY", optionType: "color", label: "Sky Blue", swatch: "#38bdf8", stockQuantity: 32000 },
  { sku: "RSC-MSK-3PLY", optionType: "color", label: "White", swatch: "#f8fafc", stockQuantity: 33000 },
  { sku: "RSC-MSK-3PLY", optionType: "color", label: "Green", swatch: "#22c55e", priceDelta: 0.05, stockQuantity: 18000 },
  { sku: "RSC-N95-MASK", optionType: "color", label: "White", swatch: "#f8fafc", stockQuantity: 4200 },
  { sku: "RSC-N95-MASK", optionType: "color", label: "Grey", swatch: "#6b7280", priceDelta: 0.5, stockQuantity: 3600 },
  { sku: "RSC-BAN-CREPE", optionType: "color", label: "Beige", swatch: "#d6c3a5", stockQuantity: 2200 },
  { sku: "RSC-BAN-CREPE", optionType: "color", label: "White", swatch: "#f8fafc", stockQuantity: 1600 },
];

/** Realistic per-product GST slabs as per Indian medical supply practice. */
export const GST_BY_SKU: Record<string, number> = {
  "GLX-NIT-ECO-3G": 12,
  "GLX-NIT-STD-4G": 12,
  "GLX-NIT-PRM-5G": 12,
  "GLX-LAT-PF": 12,
  "GLX-VIN-ECO": 12,
  "RSM-PAR-650": 5,
  "RSM-CET-10": 5,
  "RSM-PAN-40": 5,
  "RSM-MET-500": 5,
  "RSM-ORS-21": 5,
  "RSC-MSK-3PLY": 5,
  "RSC-N95-MASK": 5,
  "RSC-SYR-3ML": 12,
  "RSC-IVSET-STD": 12,
  "RSC-GAU-SWAB": 5,
  "RSC-BAN-CREPE": 5,
  "RSC-COT-ROLL": 5,
  "RSC-SAN-500": 18,
  "RSC-THER-DIG": 18,
  "RSC-OXI-FING": 18,
};

export const defaultSettings: Record<string, unknown> = {
  storeName: "RS Medicare Pharma",
  companyPhone: "+91 98100 00000",
  whatsappNumber: "919810000000",
  salesEmail: "sales@rsmedicarepharma.com",
  supportEmail: "support@rsmedicarepharma.com",
  officeAddress:
    "Distribution Office, Plot 24, Sector 18, Gurugram, Haryana 122015, India",
  businessHours: "Monday – Saturday, 9:30 AM – 7:00 PM IST",
  announcement:
    "B2B pricing is centralised. GST is applied at checkout and freight is confirmed after delivery-location review.",
  freeFreightThreshold: 0,
  flatFreight: 0,
  freightMode: "manual",
  taxEnabled: true,
  defaultTaxRate: 12,
  paymentBankTransfer: true,
  paymentUpi: true,
  paymentGateway: false,
  paymentCod: false,
  paymentManualVerification: true,
  abandonedCartReminder: false,
  lowStockAlert: true,
  riskOrderValueThreshold: 100000,
  bulkEnquiryEmail: "sales@rsmedicarepharma.com",
  companyState: "Haryana",
} satisfies Record<string, unknown>;

export const defaultFreightSettings: FreightSettings = {
  mode: "manual",
  flatFreight: 0,
  freeFreightThreshold: 0,
  taxEnabled: true,
  defaultTaxRate: 12,
};
