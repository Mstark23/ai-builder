/**
 * VERKTORLABS - Industry Intelligence Seed Script
 * 
 * Seeds all 44 industries from all category files into Supabase.
 * 
 * Usage:
 *   npx ts-node scripts/seed-industries.ts
 * 
 * Or with environment variables:
 *   SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx npx ts-node scripts/seed-industries.ts
 * 
 * Options:
 *   --category <name>  Seed only a specific category (core, ecommerce, local-services, professional, tech-creative)
 *   --dry-run          Preview what would be seeded without making changes
 */

import { createClient } from '@supabase/supabase-js';

// Import all industry data
import { coreIndustries } from '../data/core-industries';
import { ecommerceIndustries } from '../data/ecommerce-industries';
import { localServiceIndustries } from '../data/local-services-industries';
import { professionalIndustries } from '../data/professional-industries';
import { techCreativeIndustries } from '../data/tech-creative-industries';
import type { IndustryIntelligence } from '../types/industry';

// All industries combined
const allIndustries: IndustryIntelligence[] = [
  ...coreIndustries,
  ...ecommerceIndustries,
  ...localServiceIndustries,
  ...professionalIndustries,
  ...techCreativeIndustries,
];

// Industries by category for selective seeding
const industriesByCategory: Record<string, IndustryIntelligence[]> = {
  core: coreIndustries,
  ecommerce: ecommerceIndustries,
  'local-services': localServiceIndustries,
  professional: professionalIndustries,
  'tech-creative': techCreativeIndustries,
};

// Parse command line arguments
const args = process.argv.slice(2);
const categoryIndex = args.indexOf('--category');
const selectedCategory = categoryIndex !== -1 ? args[categoryIndex + 1] : null;
const isDryRun = args.includes('--dry-run');

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedIndustries() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       VERKTORLABS - Industry Intelligence Seeder          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  // Determine which industries to seed
  let industriesToSeed: IndustryIntelligence[];
  
  if (selectedCategory) {
    if (!industriesByCategory[selectedCategory]) {
      console.error(`❌ Unknown category: ${selectedCategory}`);
      console.error(`   Valid categories: ${Object.keys(industriesByCategory).join(', ')}`);
      process.exit(1);
    }
    industriesToSeed = industriesByCategory[selectedCategory];
    console.log(`📂 Seeding category: ${selectedCategory} (${industriesToSeed.length} industries)\n`);
  } else {
    industriesToSeed = allIndustries;
    console.log(`📂 Seeding all categories (${industriesToSeed.length} industries)\n`);
  }

  // Display category breakdown
  console.log('📊 Category Breakdown:');
  console.log('────────────────────────────────────────');
  Object.entries(industriesByCategory).forEach(([cat, industries]) => {
    const marker = !selectedCategory || selectedCategory === cat ? '✓' : '○';
    console.log(`   ${marker} ${cat}: ${industries.length} industries`);
  });
  console.log('────────────────────────────────────────\n');

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  // Group by category for organized output
  const groupedByCategory = industriesToSeed.reduce((acc, ind) => {
    const cat = ind.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ind);
    return acc;
  }, {} as Record<string, IndustryIntelligence[]>);

  for (const [category, industries] of Object.entries(groupedByCategory)) {
    console.log(`\n📦 Category: ${category}`);
    console.log('─'.repeat(40));

    for (const industry of industries) {
      process.stdout.write(`   • ${industry.name} (${industry.id})... `);

      if (isDryRun) {
        console.log('WOULD SEED');
        skippedCount++;
        continue;
      }

      try {
        const row = {
          id: industry.id,
          name: industry.name,
          category: industry.category,
          intelligence: industry as IndustryIntelligence,
        };

        const { error } = await supabase
          .from('industries')
          .upsert(row, {
            onConflict: 'id',
            ignoreDuplicates: false,
          });

        if (error) {
          console.log(`❌ ${error.message}`);
          errorCount++;
        } else {
          console.log('✅');
          successCount++;
        }
      } catch (err) {
        console.log(`❌ ${err}`);
        errorCount++;
      }
    }
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                        SUMMARY                             ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  
  if (isDryRun) {
    console.log(`║  Would seed: ${skippedCount.toString().padEnd(3)} industries                               ║`);
  } else {
    console.log(`║  ✅ Seeded:  ${successCount.toString().padEnd(3)} industries                               ║`);
    if (errorCount > 0) {
      console.log(`║  ❌ Errors:  ${errorCount.toString().padEnd(3)} industries                               ║`);
    }
  }
  
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Verification (skip if dry run)
  if (!isDryRun) {
    console.log('🔍 Verifying seeded data...\n');

    const { data, error } = await supabase
      .from('industries')
      .select('id, name, category')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Verification failed:', error.message);
    } else {
      console.log(`Found ${data?.length || 0} industries in database:\n`);
      
      // Group by category for display
      const byCategory = (data || []).reduce((acc, ind) => {
        if (!acc[ind.category]) acc[ind.category] = [];
        acc[ind.category].push(ind);
        return acc;
      }, {} as Record<string, typeof data>);

      for (const [cat, industries] of Object.entries(byCategory)) {
        console.log(`  📂 ${cat} (${industries?.length || 0})`);
        for (const ind of industries || []) {
          console.log(`     • ${ind.name} [${ind.id}]`);
        }
        console.log('');
      }
    }
  }
}

// Run the seed
seedIndustries()
  .then(() => {
    console.log('🎉 Seed complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Seed failed:', err);
    process.exit(1);
  });
