'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';

const SEED_CATALOG = [
  {
    id: 'ky31_fescue',
    category: 'turf',
    name: 'KY 31 Tall Fescue',
    bulkPrice50lb: 81.00,
    desc: 'Drought tolerant, persistent utility field and turf fescue. Exceptional for high-traffic environments, home lawns, and robust erosion control applications.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'turf',
    specs: { seedPerLb: '225,000', lbsAcre: '260 to 435', lbs1000: '6 to 10', cycle: 'Perennial' }
  },
  {
    id: 'easy_beauty',
    category: 'turf',
    name: 'Easy Beauty® Lawn Mix',
    bulkPrice50lb: 89.50,
    desc: 'Premium professional lawn mix blend: 30% Tribute II, 30% Falcon IV, 20% Renegade DT Turf Type Tall Fescues, and 20% Line Drive II Perennial Ryegrass.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'turf',
    specs: { seedPerLb: 'Varies by Blend', lbsAcre: '260 to 390', lbs1000: '6 to 9', cycle: 'Perennial' }
  },
  {
    id: 'emerald_excellence',
    category: 'turf',
    name: 'Emerald Excellence Ryegrass Blend',
    bulkPrice50lb: 102.50,
    desc: 'Elite athletic and golf-grade 3-way perennial ryegrass mix: 32% Palmer III, 33% Line Drive II, and 35% Prelude IV Perennial Ryegrass.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'turf',
    specs: { seedPerLb: '270,000', lbsAcre: '175 to 260', lbs1000: '4 to 6', cycle: 'Perennial' }
  },
  {
    id: 'shady_lawn',
    category: 'turf',
    name: 'Shady Lawn Mix',
    bulkPrice50lb: 120.00,
    desc: 'Premium low-light formulation: 50% Creeping Red Fescue, 11% Prelude IV, 11% Line Drive II, 11% Palmer III Perennial Ryegrasses, and 17% Kenblue Kentucky Bluegrass.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'turf',
    specs: { seedPerLb: 'Varies by Blend', lbsAcre: '130 to 220', lbs1000: '3 to 5', cycle: 'Perennial Blend' }
  },
  {
    id: 'vista_fescue',
    category: 'turf',
    name: 'Vista® Turf Type Tall Fescue Blend',
    bulkPrice50lb: 81.50,
    desc: 'High-performance 3-way turf fescue network: 33% Renegade DT, 34% Falcon IV, and 33% Tribute II Turf Type Tall Fescue. Ideal for beautiful deep green cover.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'turf',
    specs: { seedPerLb: '225,000', lbsAcre: '260 to 435', lbs1000: '6 to 10', cycle: 'Perennial Blend' }
  },
  {
    id: 'creeping_red_fescue',
    category: 'turf',
    name: 'Creeping Red Fescue (Shade Only)',
    bulkPrice50lb: 122.50,
    desc: 'Fine-textured cool season grass that spreads smoothly via underground rhizomes. Excellent shade choice for dense forest coverage or canopy landscaping.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'turf',
    specs: { seedPerLb: '615,000', lbsAcre: '130 to 220', lbs1000: '3 to 5', cycle: 'Perennial' }
  },
  {
    id: 'kentucky_bluegrass_kenblue',
    category: 'turf',
    name: 'Kentucky Bluegrass - Kenblue',
    bulkPrice50lb: 117.50,
    desc: 'Classic, dense blue-green lawn grass turf standard. Delivers excellent self-healing durability, cold resistance, and a beautiful premium aesthetic barefoot feel.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'turf',
    specs: { seedPerLb: '2,200,000', lbsAcre: '90 to 130', lbs1000: '2 to 3', cycle: 'Perennial' }
  },
  {
    id: 'bermudagrass',
    category: 'turf',
    name: 'Bermudagrass',
    bulkPrice50lb: 145.00,
    desc: 'Aggressive warm-season turf grass designed for intense summer traffic, full sun exposure, and exceptional heat tolerance during the warmest months.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'turf',
    specs: { seedPerLb: '1,787,000', lbsAcre: '45 to 90', lbs1000: '1 to 2', cycle: 'Perennial' }
  },
  {
    id: 'zoysiagrass',
    category: 'turf',
    name: 'Zoysiagrass',
    bulkPrice50lb: 195.00,
    desc: 'Premium slow-growing warm-season grass producing a highly uniform, low-weed, carpet-dense profile that chokes out weeds and requires less mowing.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'turf',
    specs: { seedPerLb: '1,200,000', lbsAcre: '45 to 90', lbs1000: '1 to 2', cycle: 'Perennial' }
  },

  {
    id: 'alfalfa_vernal',
    category: 'pasture',
    name: 'Vernal Alfalfa (Not Coated)',
    bulkPrice50lb: 131.50,
    desc: 'High-yielding, foundational perennial legume forage known for excellent winter hardiness, rich protein levels, and superior cattle feed production.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '18 to 30', depth: '1/4"', lbsBu: '60', seedsPerLb: '220,000', cycle: 'Perennial' }
  },
  {
    id: 'clover_alsike',
    category: 'pasture',
    name: 'Alsike Clover (Not Coated)',
    bulkPrice50lb: 195.50,
    desc: 'Short-lived perennial clover customized specifically for damp, low-lying environments, wet clay, and cool, acidic soil management configurations.',
    img: 'alsike_clover.png',
    chartType: 'field',
    specs: { lbsAcre: '4 to 6', depth: '0 to 1/4"', lbsBu: '60', seedsPerLb: '680,000', cycle: 'Biennial' }
  },
  {
    id: 'clover_crimson',
    category: 'cover',
    name: 'Crimson Clover (Not Coated)',
    bulkPrice50lb: 72.00,
    desc: 'Fast-growing nitrogen fixer and annual winter cover choice that acts as a powerful weed suppressor while building beneficial organic soil matter.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '15 to 20', depth: '0 to 1/4"', lbsBu: '60', seedsPerLb: '150,000', cycle: 'Annual' }
  },
  {
    id: 'clover_ladino_comm',
    category: 'pasture',
    name: 'Ladino Clover - Common (Not Coated)',
    bulkPrice50lb: 233.50,
    desc: 'High-forage nutrient profile. Long-lived companion white clover built to enrich pasturage operations, protein balances, and long-term soil health.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '1 to 3', depth: '0 to 1/4"', lbsBu: '60', seedsPerLb: '860,000', cycle: 'Perennial' }
  },
  {
    id: 'clover_medium_red',
    category: 'pasture',
    name: 'Medium Red Clover - US Origin (Not Coated)',
    bulkPrice50lb: 141.50,
    desc: 'Aggressive multi-purpose biennial legume choice engineered for high-tonnage hay cutting, pasture enrichment, and effective green manure cover.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '8 to 12', depth: '0 to 1/4"', lbsBu: '60', seedsPerLb: '275,000', cycle: 'Biennial' }
  },
  {
    id: 'clover_sweet',
    category: 'pasture',
    name: 'Sweet Clover (Not Coated)',
    bulkPrice50lb: 135.00,
    desc: 'Deep-taproot biennial clover that breaks up tight clay hardpan soils while generating massive volumes of biomass growth and pollinator feed.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '15 to 20', depth: '0 to 1/4"', lbsBu: '60', seedsPerLb: '260,000', cycle: 'Biennial' }
  },
  {
    id: 'clover_white_dutch',
    category: 'pasture',
    name: 'White Dutch Clover (Not Coated)',
    bulkPrice50lb: 276.50,
    desc: 'Low-growing, highly persistent white clover built to withstand close grazing, frequent livestock foot traffic, and aggressive lawn blending.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '15 lb (Broadcast)', depth: '1/4" - 1/2"', lbsBu: '60', seedsPerLb: 'Varies', cycle: 'Perennial' }
  },
  {
    id: 'lespedeza_korean',
    category: 'pasture',
    name: 'Unhulled Korean Lespedeza (Hull On)',
    bulkPrice50lb: 220.00,
    desc: 'Warm-season annual legume that maintains high nutritional forage value during the peak summer heat waves when cool season fields slow down.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '20 to 25', depth: '0 to 1/4"', lbsBu: '25', seedsPerLb: '240,000', cycle: 'Summer Annual' }
  },
  {
    id: 'orchardgrass_potomac',
    category: 'pasture',
    name: 'Orchardgrass - Potomac',
    bulkPrice50lb: 137.00,
    desc: 'Productive, rust-resistant classic agricultural variety producing palatable, clean, high-quality cattle forage and orchard horse hay mixes.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '15 to 25', depth: '0 to 1/2"', lbsBu: '14', seedsPerLb: '590,000', cycle: 'Perennial' }
  },
  {
    id: 'orchardgrass_warrior',
    category: 'pasture',
    name: 'Orchardgrass - Warrior II',
    bulkPrice50lb: 182.50,
    desc: 'Elite modern generation orchardgrass variant providing enhanced high yields, ultra-fast regrowth, and extreme field survival metrics under pressure.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '15 to 25', depth: '0 to 1/2"', lbsBu: '14', seedsPerLb: '590,000', cycle: 'Perennial' }
  },
  {
    id: 'redtop',
    category: 'pasture',
    name: 'Redtop',
    bulkPrice50lb: 337.50,
    desc: 'Highly adaptive utility grass that easily handles marginal, swampy, and acidic field locations where other seed varieties completely fail.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '6 to 10', depth: '0 to 1/4"', lbsBu: '27', seedsPerLb: '5,100,000', cycle: 'Perennial' }
  },
  {
    id: 'timothy_baseline',
    category: 'pasture',
    name: 'Timothy',
    bulkPrice50lb: 114.50,
    desc: 'Foundational clean cool-season companion grass valued globally for clean premium equine / horse hay production grids.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '8 to 12', depth: '0 to 1/2"', lbsBu: '45', seedsPerLb: '1,230,000', cycle: 'Perennial' }
  },
  {
    id: 'timothy_tenho',
    category: 'pasture',
    name: 'Timothy - Certified Tenho',
    bulkPrice50lb: 126.00,
    desc: 'Certified elite Timothy variant showing accelerated spring start-up speeds and balanced, palatable leaf-to-stem properties.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '8 to 12', depth: '0 to 1/2"', lbsBu: '45', seedsPerLb: '1,230,000', cycle: 'Perennial' }
  },
  {
    id: 'barley_grain',
    category: 'cover',
    name: 'Barley Grain',
    bulkPrice50lb: 24.50,
    desc: 'Aggressive cool-season companion nurse crop providing early pasturage forage options and rapid soil erosion field protection.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '72 to 96', depth: '1/2 to 1"', lbsBu: '48', seedsPerLb: '14,000', cycle: 'Winter Annual' }
  },
  {
    id: 'oats_spring',
    category: 'cover',
    name: 'Spring Oats (Shelby/Jerry)',
    bulkPrice50lb: 26.50,
    desc: 'High biomass producer that provides quick nurse crop ground cover or direct livestock forage clipping options early in the year.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '64 to 80', depth: '1/2"', lbsBu: '32', seedsPerLb: '22,800', cycle: 'Spring Annual' }
  },
  {
    id: 'oats_winter',
    category: 'cover',
    name: 'Winter Oats - Cosaque',
    bulkPrice50lb: 24.75,
    desc: 'Excellent forage profiling winter oat variety bred carefully to stand strong through harsh cold seasonal freezing cycles.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '64 to 80', depth: '1/2"', lbsBu: '32', seedsPerLb: '22,800', cycle: 'Winter Annual' }
  },
  {
    id: 'winter_wheat_grain',
    category: 'cover',
    name: 'Winter Wheat',
    bulkPrice50lb: 16.00,
    desc: 'Hardy agricultural grain solution ideal for building cost-effective winter cover, preventing mud runoff, or machine harvesting.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '60 to 120', depth: '1/2 to 3/4"', lbsBu: '60', seedsPerLb: '12,000', cycle: 'Winter Annual' }
  },
  {
    id: 'ryegrain_winter',
    category: 'cover',
    name: 'Winter Ryegrain',
    bulkPrice50lb: 19.50,
    desc: 'The gold standard for winter agricultural cover crops. Unmatched deep nutrient scavenging ability and severe cold weather hardiness.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '50 to 90', depth: '1/2 to 3/4"', lbsBu: '56', seedsPerLb: '19,000', cycle: 'Winter Annual' }
  },
  {
    id: 'enduro_pasture_mix',
    category: 'pasture',
    name: 'Enduro® Pasture Mix',
    bulkPrice50lb: 152.50,
    desc: 'Rugged professional perennial forage blend: 50% Warrior II Orchardgrass, 20% Tenho Timothy, 27% Bestfor Tetrapod Ryegrass, and 3% Redtop.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '20 to 25', depth: '0 to 1/4"', lbsBu: 'Varies', seedsPerLb: 'Varies', cycle: 'Perennial Blend' }
  },
  {
    id: 'green_valley_mix',
    category: 'pasture',
    name: 'Green Valley® Hay & Pasture Mix',
    bulkPrice50lb: 148.50,
    desc: 'Elite premium cattle and livestock mix: 34% Potomac Orchardgrass, 24% Vernal Alfalfa, 20% Timothy, 20% Medium Red Clover, and 2% Ladino Clover.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '20 to 25', depth: '0 to 1/4"', lbsBu: 'Varies', seedsPerLb: 'Varies', cycle: 'Perennial / Biennial Mix' }
  },
  {
    id: 'sorghum_sudangrass_hygain',
    category: 'cover',
    name: 'Sorghum Sudangrass Hybrid - HyGain',
    bulkPrice50lb: 41.75,
    desc: 'Massive summer biomass builder that easily tolerates extreme heat and dry spells. Ideal for summer hay cropping or rotational cattle fields.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '15 to 30', depth: '1/2 to 3/4"', lbsBu: '40', seedsPerLb: '15,000', cycle: 'Summer Annual' }
  },
  {
    id: 'pearl_millet',
    category: 'cover',
    name: 'Pearl Millet',
    bulkPrice50lb: 48.00,
    desc: 'High-performing warm-season field option that provides heavy livestock grazing with absolutely zero prussic acid chemical risks.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '15 to 30', depth: '1/2 to 3/4"', lbsBu: '50', seedsPerLb: '83,000', cycle: 'Summer Annual' }
  },

  // --- WILDLIFE PLOTS & SPECIALTY DEER INVENTORY ---
  {
    id: 'austrian_winter_peas',
    category: 'wildlife',
    name: 'Austrian Winter Peas',
    bulkPrice50lb: 112.00,
    desc: 'Excellent cool season sweet viney forage choice. Highly attractive winter feed source preferred instantly by deer and wild turkey networks.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Excellent winter feed source for deer and turkey', rate: 'Broadcast 50 lb per acre, cover 1/4 inch deep', type: 'Winter annual legume', notes: 'Top quality forage for deer' }
  },
  {
    id: 'bluestem_little',
    category: 'wildlife',
    name: 'Bluestem - Little',
    bulkPrice50lb: 165.00,
    desc: 'Foundational native bunchgrass providing premium nesting structural habitat and seasonal bedding safety for upland game birds and local wildlife.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Provides forage for deer, good food source for turkey', rate: 'Drill 3-5 pls lb per acre 1/4 inch deep', type: 'Warm season perennial grass', notes: 'Wildlife cover and nesting for birds, slow to establish' }
  },
  {
    id: 'bromegrass_wildlife',
    category: 'wildlife',
    name: 'Bromegrass',
    bulkPrice50lb: 112.50,
    desc: 'Perennial forage grass that creates excellent multi-season cover, nesting perimeters, and highly dependable structural wildlife sanctuary zones.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Forage and food source for waterfowl, quail, turkey and deer', rate: 'Drill or broadcast 20 lb per acre, cover 1/4 inch deep', type: 'Perennial grass', notes: 'Provides good nesting areas' }
  },
  {
    id: 'buckwheat_wildlife',
    category: 'wildlife',
    name: 'Buckwheat',
    bulkPrice50lb: 61.00,
    desc: 'Fast-maturing summer annual that creates exceptional early honeybee feed plots while radically scavenging phosphorus to build poor soils up fast.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Excellent food for quail, pheasant, dove, turkey, ducks and deer', rate: 'Broadcast 50 lb per acre, cover 1/4 inch deep', type: 'Summer annual, 10-12 weeks to mature', notes: 'Soil improvement, honey production, easy to establish' }
  },
  {
    id: 'chicory_wildlife',
    category: 'wildlife',
    name: 'Chicory (Coated)',
    bulkPrice50lb: 347.00,
    desc: 'High-protein perennial herb exhibiting incredible drought resilience, deep taproots, and unmatched summer leaf palatability for big buck management.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'High in nutrient feed value for deer in summer', rate: 'Drill or broadcast 5 lb per acre, cover 1/4 inch deep', type: 'Perennial herb', notes: 'Very palatable for summer and fall grazing' }
  },
  {
    id: 'chufa_wildlife',
    category: 'wildlife',
    name: 'Chufa',
    bulkPrice50lb: 185.00,
    desc: 'Nut-sedge variant that produces high energy, underground sweet tubers scratch-harvested heavily and targeted by wild turkeys.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Excellent food for turkey, ducks, deer, quail and dove', rate: 'Broadcast 50 lb per acre', type: 'Annual', notes: 'Sandy soil works best, grows underground' }
  },
  {
    id: 'egyptian_wheat',
    category: 'wildlife',
    name: 'Egyptian Wheat',
    bulkPrice50lb: 170.50,
    desc: 'Massive, towering structural cane crop used extensively to engineer blind screening borders, safe entry lanes, and secluded deer bedding blocks.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Excellent high protein food source for game birds and deer safety', rate: 'Broadcast 20 lb or drill 14 lb per acre', type: 'Summer annual 8-10 feet tall', notes: 'A tall sorghum with a grain head that feeds birds as it bends over' }
  },
  {
    id: 'hairy_vetch_wildlife',
    category: 'wildlife',
    name: 'Hairy Vetch',
    bulkPrice50lb: 115.00,
    desc: 'Extreme cold winter hardiness profile. High-nitrogen vining annual legume offering rich, sugary late-season browse when other food plots freeze out.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Good fall food and insect source for turkey, dove and quail', rate: 'Broadcast 50 lb per acre, cover 1/4 inch deep', type: 'Winter annual legume', notes: 'Very cold tolerant, Excellent reeder' }
  },
  {
    id: 'cowpeas_iron_clay',
    category: 'wildlife',
    name: 'Iron & Clay Cowpeas',
    bulkPrice50lb: 78.00,
    desc: 'Vigorous warm-season legume choice producing endless premium vine canopy browse under high summer deer herd clipping pressure.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Excellent food source for deer browse, quail and turkey protection', rate: 'Broadcast 60 lb per acre, cover 1-1.5 inches deep', type: 'Summer annual legume', notes: 'Forage after 45 days' }
  },
  {
    id: 'radish_daikon',
    category: 'wildlife',
    name: 'Radish - Daikon Type',
    bulkPrice50lb: 138.00,
    desc: 'High-nutrient deep-scavenging forage tillage radishes that serve as excellent sweet winter attractant magnets after frost sets in.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '20 to 25', depth: '1/4 to 1/2"', lbsBu: 'Varies', seedsPerLb: 'Varies', cycle: 'Annual Forage' }
  },
  {
    id: 'rapeseed_winter',
    category: 'wildlife',
    name: 'Rapeseed - Winter',
    bulkPrice50lb: 117.50,
    desc: 'Sweet leafy structural brassica forage choice that spikes dramatically in sugar concentration following late fall cold cycles.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '6 to 10', depth: '0 to 1/4"', lbsBu: 'Varies', seedsPerLb: 'Varies', cycle: 'Cool Annual' }
  },
  {
    id: 'turnip_purple_top',
    category: 'wildlife',
    name: 'Turnip - Purple Top',
    bulkPrice50lb: 133.50,
    desc: 'Highly reliable dual hunting plot producer supplying both heavy leafy green top browse and premium energy-rich winter root bulbs.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'field',
    specs: { lbsAcre: '6 to 10', depth: '0 to 1/4"', lbsBu: 'Varies', seedsPerLb: 'Varies', cycle: 'Cool Annual' }
  },
  {
    id: 'sugar_beets_wildlife',
    category: 'wildlife',
    name: 'Sugar Beets',
    bulkPrice50lb: 457.50,
    desc: 'Extremely high sugar energy storage root option coveted by white-tailed deer tracking programs during intense late winter freezes.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Premium energy and sugar root source for deep winter deer attraction', rate: 'Broadcast 15-20 lb per acre, cover 1/2 inch', type: 'Annual root asset', notes: 'Provides massive taproot nutrition profiles' }
  },
  {
    id: 'cre_wildlife_mix',
    category: 'wildlife',
    name: 'CRE Wildlife Mix (15 lb bag)',
    bulkPrice50lb: 250.00,
    desc: 'Custom proprietary multi-variant seed plot layout tailored exactly by Cane Run Enterprise advisors for premium regional deer management.',
    img: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?auto=format&fit=crop&w=600&q=80',
    chartType: 'wildlife',
    specs: { wildlifeUse: 'Complete balanced multi-stage food plot drawing action', rate: 'Pre-packaged 15 lb field unit rates', type: 'Mixed Stand Asset', notes: 'Proprietary custom seed blend allocation tracking' }
  }
];

function calculateTieredPrice(bulkPrice50lb, pounds) {
  const baseRatePerLb = bulkPrice50lb / 50; 
  let tierMultiplier = 1.0;

  if (pounds < 10) tierMultiplier = 1.65; 
  else if (pounds < 25) tierMultiplier = 1.35; 
  else if (pounds < 50) tierMultiplier = 1.15; 

  const calculatedRate = baseRatePerLb * tierMultiplier;
  return Math.round((pounds * calculatedRate) * 100) / 100;
}

export default function HomePage() {
  const { cart, addToCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSeed, setSelectedSeed] = useState(null); 
  const [customPounds, setCustomPounds] = useState(50);   

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filteredProducts = activeTab === 'all' ? SEED_CATALOG : SEED_CATALOG.filter(p => p.category === activeTab);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-500 font-semibold text-xs tracking-wide">Syncing Cane Run Inventories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      {/* --- REFINED LIGHT HEADER --- */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-bold block mb-0.5">Catalog Ledger</span>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Cane Run Enterprises</h1>
          </div>
          <Link href="/cart" className="group flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl shadow-xs transition-all text-xs">
            <span>Review Order Batch</span>
            <span className="bg-white/10 text-white text-xs font-bold px-2 py-0.5 rounded-md min-w-[20px] text-center">
              {totalItems}
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* --- NAVIGATION TABS --- */}
        <div className="border-b border-slate-100 pb-5 mb-8">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Inventory' },
              { id: 'turf', label: 'Retail Turf & Lawn' },
              { id: 'pasture', label: 'Agricultural Forages' },
              { id: 'cover', label: 'Field Grains & Cover' },
              { id: 'wildlife', label: 'Wildlife Food Plots' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all border ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 border-slate-900 text-white' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- CARD GRID --- */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((seed) => {
            const sample5lbPrice = calculateTieredPrice(seed.bulkPrice50lb, 5);
            return (
              <div key={seed.id} className="bg-white rounded-xl border border-gray-400 shadow-xs flex flex-col justify-between overflow-hidden group hover:border-slate-200 transition-all duration-150">
                <div className="h-40 w-full overflow-hidden relative bg-slate-50 border-b border-slate-50">
                  <img 
                    src={seed.img} 
                    alt={seed.name}
                    className="w-full h-full object-cover grayscale-25 group-hover:grayscale-0 transition-all duration-200"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white border border-slate-100 text-[9px] text-slate-400 font-mono font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {seed.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 mb-1.5">{seed.name}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4">{seed.desc}</p>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 border border-slate-100 p-3 rounded-lg space-y-1">
                    <p className="flex justify-between">
                      <span>Base 50 lb Bag:</span> 
                      <span className="font-bold text-slate-700">${seed.bulkPrice50lb.toFixed(2)} (${(seed.bulkPrice50lb/50).toFixed(2)}/lb)</span>
                    </p>
                    <p className="flex justify-between border-t border-slate-100 pt-1 mt-1">
                      <span>Min 5 lb Split:</span> 
                      <span className="font-bold text-slate-700">${(sample5lbPrice / 5).toFixed(2)}/lb</span>
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    {seed.chartType} metrics
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSeed(seed);
                      setCustomPounds(50); 
                    }}
                    className="bg-white hover:bg-slate-900 border border-slate-200 text-slate-700 hover:text-white font-bold py-1 px-3 rounded-lg text-xs transition-all shadow-2xs"
                  >
                    Select Weight
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {selectedSeed && (
        <div className="fixed inset-0 z-50 bg-slate-900/10 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 relative shadow-lg animate-in fade-in zoom-in-95 duration-100">
            <button onClick={() => setSelectedSeed(null)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 font-bold text-xs">✕</button>

            <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block mb-1">Specification Matrix</span>
            <h2 className="text-base font-black text-green-600 tracking-tight mb-4">{selectedSeed.name}</h2>
            
            <div className="border border-slate-100 rounded-xl p-3.5 mb-4 text-xs font-mono">
              {selectedSeed.chartType === 'turf' && (
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                  <div><span className="text-slate-400 text-[10px] uppercase block">Seeds / Lb</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.seedPerLb}</p></div>
                  <div><span className="text-slate-400 text-[10px] uppercase block">Pounds / Acre</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.lbsAcre}</p></div>
                  <div><span className="text-slate-400 text-[10px] uppercase block">Lbs / 1,000 ft²</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.lbs1000}</p></div>
                  <div><span className="text-slate-400 text-[10px] uppercase block">Life Cycle</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.cycle}</p></div>
                </div>
              )}

              {selectedSeed.chartType === 'field' && (
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                  <div><span className="text-slate-400 text-[10px] uppercase block">Pounds / Acre</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.lbsAcre}</p></div>
                  <div><span className="text-slate-400 text-[10px] uppercase block">Planting Depth</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.depth}</p></div>
                  <div><span className="text-slate-400 text-[10px] uppercase block">Lbs / Bushel</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.lbsBu}</p></div>
                  <div><span className="text-slate-400 text-[10px] uppercase block">Approx Seeds/Lb</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.seedsPerLb}</p></div>
                  <div className="col-span-2 border-t border-slate-100 pt-2 mt-1"><span className="text-slate-400 text-[10px] uppercase block">Growth Cycle</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.cycle}</p></div>
                </div>
              )}

              {selectedSeed.chartType === 'wildlife' && (
                <div className="space-y-2.5">
                  <div><span className="text-slate-400 text-[10px] uppercase block">Wildlife Application</span> <p className="text-slate-700 font-medium font-sans text-xs">{selectedSeed.specs.wildlifeUse}</p></div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-2">
                    <div><span className="text-slate-400 text-[10px] uppercase block">Rate Plan</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.rate}</p></div>
                    <div><span className="text-slate-400 text-[10px] uppercase block">Asset Profile</span> <p className="text-slate-800 font-bold">{selectedSeed.specs.type || 'Custom Plot'}</p></div>
                  </div>
                  <div className="border-t border-slate-100 pt-2 text-[10px] text-slate-500 font-sans">
                    <span className="font-bold">Field Notes:</span> {selectedSeed.specs.notes}
                  </div>
                </div>
              )}
            </div>

            {/* --- PRICING METRICS --- */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-4 text-xs font-mono text-slate-600">
              <div className="flex justify-between items-center mb-1">
                <span>Selected Capacity:</span>
                <span className="font-bold text-slate-800">{customPounds} lbs</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Rate Per Pound:</span>
                <span className="font-bold text-slate-800">
                  ${(calculateTieredPrice(selectedSeed.bulkPrice50lb, customPounds) / customPounds).toFixed(2)} / lb
                </span>
              </div>
              <div className="border-t border-slate-200/60 pt-2.5 flex justify-between items-center text-green-600">
                <span className="font-bold">Calculated Price:</span>
                <span className="text-lg font-black">${calculateTieredPrice(selectedSeed.bulkPrice50lb, customPounds).toFixed(2)}</span>
              </div>
            </div>

            {/* --- WEIGHT CALIBRATOR SLIDER --- */}
            <div className="mb-4">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-green-600 mb-1">Adjust Weight Scale (5 - 50 lbs)</label>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={customPounds}
                onChange={(e) => setCustomPounds(parseInt(e.target.value) || 5)}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                <span>Min: 5 lbs</span>
                <span>Max Bag: 50 lbs</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {[5, 25, 50].map((lb) => (
                <button
                  key={lb}
                  onClick={() => setCustomPounds(lb)}
                  className={`py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                    customPounds === lb 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {lb} lb Bag
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const computedPrice = calculateTieredPrice(selectedSeed.bulkPrice50lb, customPounds);
                addToCart({
                  id: `${selectedSeed.id}_${customPounds}lb`, 
                  name: `${selectedSeed.name} (${customPounds} lb Bag)`,
                  price: computedPrice,
                  weightOz: customPounds * 16 
                });
                setSelectedSeed(null);
              }}
              className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2.5 rounded-lg text-xs text-center transition-all shadow-xs"
            >
              Stage Custom Bag Weight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
