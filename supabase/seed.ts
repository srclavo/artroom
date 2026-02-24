/**
 * ArtRoom Seed Data Script
 *
 * Run with: npx tsx supabase/seed.ts
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS.
 * Creates test users, profiles, designs, portfolios, likes, follows, and purchases.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = [
  { email: 'maya@artroom.test', password: 'Test1234!', username: 'maya', display_name: 'Maya Chen', bio: 'Creative director and brand designer based in Brooklyn. Specializing in visual identity systems for tech companies and cultural institutions.', role: 'creator', skills: ['branding', 'illustration'], is_verified: true },
  { email: 'james@artroom.test', password: 'Test1234!', username: 'james', display_name: 'James Rivera', bio: 'Product designer building design systems and interfaces for SaaS companies. Passionate about component architecture and scalable design.', role: 'creator', skills: ['ui-ux'], is_verified: true },
  { email: 'kira@artroom.test', password: 'Test1234!', username: 'kira', display_name: 'Kira Tanaka', bio: 'Type designer and calligrapher focused on display faces and experimental letterforms.', role: 'creator', skills: ['typography'], is_verified: false },
  { email: 'alex@artroom.test', password: 'Test1234!', username: 'alex', display_name: 'Alex Storm', bio: 'Motion designer creating dynamic visual narratives and experimental animations.', role: 'creator', skills: ['motion', '3d'], is_verified: true },
  { email: 'orion@artroom.test', password: 'Test1234!', username: 'orion', display_name: 'Orion Vale', bio: '3D artist and visualizer creating abstract renders and surreal digital landscapes.', role: 'creator', skills: ['3d', 'illustration'], is_verified: false },
  { email: 'nova@artroom.test', password: 'Test1234!', username: 'nova', display_name: 'Nova Kim', bio: 'Brand strategist and product designer. Bridging strategy with pixel-perfect execution.', role: 'creator', skills: ['branding', 'ui-ux'], is_verified: true },
  { email: 'kai@artroom.test', password: 'Test1234!', username: 'kai', display_name: 'Kai Dubois', bio: 'Illustrator working at the intersection of editorial design and environmental art.', role: 'creator', skills: ['illustration', 'branding'], is_verified: true },
  { email: 'seb@artroom.test', password: 'Test1234!', username: 'seb', display_name: 'Seb Laurent', bio: 'Type and lettering artist creating custom typefaces and brand typography.', role: 'creator', skills: ['typography', 'branding'], is_verified: false },
];

const DESIGNS = [
  { title: 'Lumis Brand Kit', description: 'Complete brand identity system with logos, colors, and guidelines', price: 129, category: 'branding', tags: ['brand', 'identity', 'minimal'], license_type: 'commercial', view_count: 2400, download_count: 180, like_count: 847, is_featured: true, creator_username: 'maya' },
  { title: 'Stellar UI System', description: '200+ components for modern interfaces', price: 199, category: 'ui-ux', tags: ['ui', 'system', 'components'], license_type: 'commercial', view_count: 1800, download_count: 95, like_count: 561, is_featured: true, creator_username: 'james' },
  { title: 'Neue Display', description: 'Modern display typeface with 12 weights', price: 49, category: 'typography', tags: ['type', 'display', 'modern'], license_type: 'personal', view_count: 3200, download_count: 420, like_count: 312, is_featured: false, creator_username: 'kira' },
  { title: 'Motion Kit Pro', description: 'After Effects templates and transitions', price: 89, category: 'motion', tags: ['motion', 'ae', 'animation'], license_type: 'commercial', view_count: 1100, download_count: 63, like_count: 210, is_featured: false, creator_username: 'alex' },
  { title: 'Coastal Illustrations', description: 'Hand-drawn illustration pack with 50+ assets', price: 59, category: 'illustration', tags: ['illustration', 'hand-drawn'], license_type: 'personal', view_count: 890, download_count: 45, like_count: 178, is_featured: false, creator_username: 'maya' },
  { title: 'Geo 3D Shapes', description: 'Abstract 3D shapes and renders', price: 79, category: '3d', tags: ['3d', 'abstract', 'shapes'], license_type: 'commercial', view_count: 1500, download_count: 88, like_count: 345, is_featured: false, creator_username: 'orion' },
  { title: 'Dashboard Templates', description: 'Admin dashboard kit with charts and tables', price: 149, category: 'ui-ux', tags: ['dashboard', 'admin', 'charts'], license_type: 'extended', view_count: 2100, download_count: 134, like_count: 490, is_featured: true, creator_username: 'james' },
  { title: 'Serif Collection', description: 'Premium serif font family', price: 39, category: 'typography', tags: ['type', 'serif', 'elegant'], license_type: 'personal', view_count: 670, download_count: 28, like_count: 98, is_featured: false, creator_username: 'kira' },
  { title: 'Night Shift Brand', description: 'Dark mode brand identity system', price: 109, category: 'branding', tags: ['brand', 'dark', 'identity'], license_type: 'commercial', view_count: 1800, download_count: 76, like_count: 420, is_featured: false, creator_username: 'nova' },
  { title: 'Lottie Pack', description: 'Animated Lottie illustrations for web', price: 69, category: 'motion', tags: ['lottie', 'animation', 'web'], license_type: 'commercial', view_count: 920, download_count: 52, like_count: 189, is_featured: false, creator_username: 'alex' },
  { title: 'Deep Roots Campaign', description: 'Environmental campaign design kit', price: 99, category: 'branding', tags: ['campaign', 'environmental', 'brand'], license_type: 'commercial', view_count: 1450, download_count: 98, like_count: 356, is_featured: false, creator_username: 'kai' },
  { title: 'Crystal Renders', description: 'Premium 3D crystal and glass renders', price: 119, category: '3d', tags: ['3d', 'crystal', 'glass'], license_type: 'commercial', view_count: 2100, download_count: 110, like_count: 502, is_featured: true, creator_username: 'orion' },
  { title: 'Forma Type System', description: 'Variable font with optical sizing', price: 79, category: 'typography', tags: ['type', 'variable', 'system'], license_type: 'commercial', view_count: 1650, download_count: 89, like_count: 278, is_featured: false, creator_username: 'seb' },
  { title: 'Signal Work', description: 'Bold editorial design system', price: 159, category: 'branding', tags: ['editorial', 'bold', 'brand'], license_type: 'extended', view_count: 3100, download_count: 200, like_count: 890, is_featured: true, creator_username: 'maya' },
  { title: 'Wild Botanicals', description: 'Botanical illustration collection', price: 45, category: 'illustration', tags: ['botanical', 'illustration', 'nature'], license_type: 'personal', view_count: 780, download_count: 42, like_count: 156, is_featured: false, creator_username: 'kai' },
  { title: 'App UI System', description: 'Complete mobile app UI kit', price: 189, category: 'ui-ux', tags: ['mobile', 'app', 'ui-kit'], license_type: 'extended', view_count: 2900, download_count: 185, like_count: 710, is_featured: true, creator_username: 'nova' },
];

const PORTFOLIOS = [
  { title: 'Fintech App Redesign', price: 89, category: 'ui-ux', tags: ['fintech', 'app'], view_count: 340, creator_username: 'maya' },
  { title: 'E-commerce Brand System', price: 149, category: 'branding', tags: ['ecommerce', 'brand'], view_count: 560, creator_username: 'james' },
  { title: 'Editorial Layout System', price: 69, category: 'typography', tags: ['editorial', 'layout'], view_count: 210, creator_username: 'kira' },
  { title: 'Animated Logo Pack', price: 59, category: 'motion', tags: ['logo', 'animation'], view_count: 180, creator_username: 'alex' },
  { title: '3D Icon Collection', price: 99, category: '3d', tags: ['3d', 'icons'], view_count: 420, creator_username: 'orion' },
  { title: 'SaaS Landing Page', price: 119, category: 'ui-ux', tags: ['saas', 'landing'], view_count: 690, creator_username: 'nova' },
  { title: 'Eco Branding Suite', price: 109, category: 'branding', tags: ['eco', 'sustainable'], view_count: 380, creator_username: 'kai' },
  { title: 'Lettering Portfolio', price: 49, category: 'typography', tags: ['lettering', 'custom'], view_count: 270, creator_username: 'seb' },
  { title: 'Startup Rebrand', price: 179, category: 'branding', tags: ['startup', 'rebrand'], view_count: 520, creator_username: 'maya' },
  { title: 'Product Showreel', price: 79, category: 'motion', tags: ['showreel', 'product'], view_count: 310, creator_username: 'alex' },
  { title: 'Architectural Renders', price: 139, category: '3d', tags: ['architecture', 'renders'], view_count: 450, creator_username: 'orion' },
  { title: 'Design System Docs', price: 89, category: 'ui-ux', tags: ['design-system', 'docs'], view_count: 610, creator_username: 'james' },
];

async function seed() {
  console.log('🌱 Starting ArtRoom seed...\n');

  // 1. Create users and profiles
  const userMap: Record<string, string> = {}; // username -> user_id

  for (const u of USERS) {
    console.log(`Creating user: ${u.email}`);

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((eu) => eu.email === u.email);

    let userId: string;

    if (existing) {
      userId = existing.id;
      console.log(`  ↳ Already exists (${userId})`);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
      });

      if (error) {
        console.error(`  ✗ Error: ${error.message}`);
        continue;
      }
      userId = data.user.id;
      console.log(`  ✓ Created (${userId})`);
    }

    userMap[u.username] = userId;

    // Upsert profile
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      username: u.username,
      display_name: u.display_name,
      bio: u.bio,
      role: u.role,
      skills: u.skills,
      is_verified: u.is_verified,
    }, { onConflict: 'id' });

    if (profileError) {
      console.error(`  ✗ Profile error: ${profileError.message}`);
    }
  }

  console.log(`\n✅ ${Object.keys(userMap).length} users created\n`);

  // 2. Create designs
  console.log('Creating designs...');
  const designMap: Record<string, string> = {}; // title -> design_id

  for (const d of DESIGNS) {
    const creatorId = userMap[d.creator_username];
    if (!creatorId) {
      console.error(`  ✗ No user found for ${d.creator_username}`);
      continue;
    }

    const { data, error } = await supabase.from('designs').insert({
      creator_id: creatorId,
      title: d.title,
      description: d.description,
      price: d.price,
      category: d.category,
      tags: d.tags,
      thumbnail_url: `https://placehold.co/600x400/${d.category === 'branding' ? 'FFB3C6' : d.category === 'ui-ux' ? '1B4FE8' : d.category === 'typography' ? 'FFE500' : d.category === 'motion' ? '1A7A3C' : d.category === 'illustration' ? 'FF5F1F' : '7B3FA0'}/fff?text=${encodeURIComponent(d.title.charAt(0))}`,
      license_type: d.license_type,
      view_count: d.view_count,
      download_count: d.download_count,
      like_count: d.like_count,
      is_featured: d.is_featured,
      status: 'published',
    } as never).select().single();

    if (error) {
      console.error(`  ✗ ${d.title}: ${error.message}`);
    } else if (data) {
      designMap[d.title] = data.id;
      console.log(`  ✓ ${d.title}`);
    }
  }

  console.log(`\n✅ ${Object.keys(designMap).length} designs created\n`);

  // 3. Create portfolios
  console.log('Creating portfolios...');
  let portfolioCount = 0;

  for (const p of PORTFOLIOS) {
    const creatorId = userMap[p.creator_username];
    if (!creatorId) continue;

    const { error } = await supabase.from('portfolios').insert({
      creator_id: creatorId,
      title: p.title,
      price: p.price,
      category: p.category,
      tags: p.tags,
      thumbnail_url: `https://placehold.co/600x400/f0f0f0/999?text=${encodeURIComponent(p.title.charAt(0))}`,
      view_count: p.view_count,
      status: 'published',
    } as never);

    if (error) {
      console.error(`  ✗ ${p.title}: ${error.message}`);
    } else {
      portfolioCount++;
      console.log(`  ✓ ${p.title}`);
    }
  }

  console.log(`\n✅ ${portfolioCount} portfolios created\n`);

  // 4. Create sample follows
  console.log('Creating follows...');
  const followPairs = [
    ['james', 'maya'], ['kira', 'maya'], ['alex', 'maya'], ['nova', 'maya'],
    ['maya', 'james'], ['kira', 'james'], ['orion', 'james'],
    ['maya', 'kai'], ['james', 'kai'], ['seb', 'kai'],
    ['alex', 'orion'], ['seb', 'orion'],
    ['kai', 'nova'], ['maya', 'nova'], ['james', 'nova'],
  ];

  let followCount = 0;
  for (const [follower, target] of followPairs) {
    const followerId = userMap[follower];
    const targetId = userMap[target];
    if (!followerId || !targetId) continue;

    const { error } = await supabase.from('follows').insert({
      follower_id: followerId,
      following_id: targetId,
    } as never);

    if (!error) followCount++;
  }
  console.log(`✅ ${followCount} follows created\n`);

  // 5. Create sample likes
  console.log('Creating likes...');
  const designTitles = Object.keys(designMap);
  let likeCount = 0;

  for (const username of Object.keys(userMap)) {
    // Each user likes 3-5 random designs
    const numLikes = 3 + Math.floor(Math.random() * 3);
    const shuffled = [...designTitles].sort(() => Math.random() - 0.5).slice(0, numLikes);

    for (const designTitle of shuffled) {
      const { error } = await supabase.from('likes').insert({
        user_id: userMap[username],
        design_id: designMap[designTitle],
      } as never);

      if (!error) likeCount++;
    }
  }
  console.log(`✅ ${likeCount} likes created\n`);

  // 6. Create sample purchases
  console.log('Creating purchases...');
  const samplePurchases = [
    { buyer: 'james', design: 'Lumis Brand Kit', amount: 129 },
    { buyer: 'nova', design: 'Signal Work', amount: 159 },
    { buyer: 'kai', design: 'Stellar UI System', amount: 199 },
    { buyer: 'alex', design: 'Neue Display', amount: 49 },
    { buyer: 'maya', design: 'Dashboard Templates', amount: 149 },
  ];

  let purchaseCount = 0;
  for (const p of samplePurchases) {
    const buyerId = userMap[p.buyer];
    const designId = designMap[p.design];
    if (!buyerId || !designId) continue;

    const platformFee = +(p.amount * 0.15).toFixed(2);
    const creatorPayout = +(p.amount - platformFee).toFixed(2);

    const { error } = await supabase.from('purchases').insert({
      buyer_id: buyerId,
      design_id: designId,
      amount: p.amount,
      platform_fee: platformFee,
      creator_payout: creatorPayout,
      payment_method: 'card',
      status: 'completed',
    } as never);

    if (!error) purchaseCount++;
  }
  console.log(`✅ ${purchaseCount} purchases created\n`);

  // Summary
  console.log('═══════════════════════════════════════');
  console.log('🎉 Seed complete!');
  console.log('═══════════════════════════════════════');
  console.log('\nTest credentials (all passwords: Test1234!):');
  for (const u of USERS) {
    console.log(`  ${u.display_name.padEnd(16)} → ${u.email}`);
  }
  console.log('');
}

seed().catch(console.error);
