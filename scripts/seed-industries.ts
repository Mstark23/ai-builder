/**
 * VERKTORLABS - Generate SQL Seed File
 * 
 * This script generates the seed-industries.sql file from all industry data.
 * 
 * Usage: npx ts-node scripts/generate-seed-sql.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import all industry data
import { coreIndustries } from '../data/core-industries';
import { ecommerceIndustries } from '../data/ecommerce-industries';
import { localServiceIndustries } from '../data/local-services-industries';
import { professionalIndustries } from '../data/professional-industries';
import { techCreativeIndustries } from '../data/tech-creative-industries';
import type { IndustryIntelligence } from '../types/industry';

// Combine all industries
const allIndustries: IndustryIntelligence[] = [
  ...coreIndustries,
  ...ecommerceIndustries,
  ...localServiceIndustries,
  ...professionalIndustries,
  ...techCreativeIndustries,
];

/**
 * Escape single quotes for SQL
 */
function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

/**
 * Convert an industry object to JSONB format for SQL
 */
function industryToJsonb(industry: IndustryIntelligence): string {
  // We need to escape the JSON for SQL insertion
  const json = JSON.stringify(industry, null, 0);
  return escapeSql(json);
}

/**
 * Generate INSERT statement for an industry
 */
function generateInsert(industry: IndustryIntelligence): string {
  const jsonb = industryToJsonb(industry);
  return `INSERT INTO industries (id, name, category, intelligence) VALUES (
  '${escapeSql(industry.id)}',
  '${escapeSql(industry.name)}',
  '${escapeSql(industry.category)}',
  '${jsonb}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  intelligence = EXCLUDED.intelligence,
  updated_at = NOW();`;
}

/**
 * Generate the complete SQL seed file
 */
function generateSeedSql(): string {
  const header = `-- ═══════════════════════════════════════════════════════════════════════════════
-- VERKTORLABS - Industry Intelligence Seed Data
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- This file contains INSERT statements for all ${allIndustries.length} industries.
-- Generated from TypeScript source files.
--
-- Categories:
-- - Core Industries: ${coreIndustries.length}
-- - E-commerce: ${ecommerceIndustries.length}
-- - Local Services: ${localServiceIndustries.length}
-- - Professional Services: ${professionalIndustries.length}
-- - Tech & Creative: ${techCreativeIndustries.length}
--
-- Usage:
--   psql -d your_database -f seed-industries.sql
-- Or via Supabase:
--   Copy contents to SQL Editor and run
--
-- ═══════════════════════════════════════════════════════════════════════════════

-- Start transaction for safety
BEGIN;

-- Ensure the table exists (idempotent)
CREATE TABLE IF NOT EXISTS industries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  intelligence JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_industries_category ON industries(category);
CREATE INDEX IF NOT EXISTS idx_industries_intelligence ON industries USING GIN (intelligence);

`;

  const sections: string[] = [];

  // Group by source for organization
  const groups = [
    { name: 'CORE INDUSTRIES', data: coreIndustries },
    { name: 'E-COMMERCE INDUSTRIES', data: ecommerceIndustries },
    { name: 'LOCAL SERVICE INDUSTRIES', data: localServiceIndustries },
    { name: 'PROFESSIONAL SERVICE INDUSTRIES', data: professionalIndustries },
    { name: 'TECH & CREATIVE INDUSTRIES', data: techCreativeIndustries },
  ];

  for (const group of groups) {
    sections.push(`
-- ═══════════════════════════════════════════════════════════════════════════════
-- ${group.name} (${group.data.length})
-- ═══════════════════════════════════════════════════════════════════════════════
`);

    for (const industry of group.data) {
      sections.push(`
-- ${industry.name}
${generateInsert(industry)}
`);
    }
  }

  const footer = `
-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION
-- ═══════════════════════════════════════════════════════════════════════════════

-- Commit the transaction
COMMIT;

-- Show summary
SELECT 
  category,
  COUNT(*) as count
FROM industries
GROUP BY category
ORDER BY count DESC;

SELECT 'Total industries seeded: ' || COUNT(*)::text as summary FROM industries;
`;

  return header + sections.join('') + footer;
}

// Main execution
const sql = generateSeedSql();
const outputPath = path.join(__dirname, '..', 'supabase', 'seed-industries.sql');

fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`✅ Generated ${outputPath}`);
console.log(`   Total industries: ${allIndustries.length}`);
