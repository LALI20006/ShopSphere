const fs = require('fs');
const path = require('path');
const { CATEGORIES } = require('../../dist/data/categories.js');

const DATA_DIR = path.resolve(__dirname, '../../data');
const CACHE_FILE = path.join(DATA_DIR, 'harvested_amazon_images.json');

let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch (e) {
    cache = {};
  }
}

function getQueries(cat, sub) {
  const cleanSub = sub.name.replace(/&/g, ' ').replace(/[^\w\s]/g, '').trim();
  const cleanCat = cat.name.split(',')[0].replace(/&/g, ' ').trim();
  return [
    cleanSub,
    `${cleanCat} ${cleanSub}`,
    sub.slug.replace(/-/g, ' '),
  ];
}

async function fetchAmazonIds(query) {
  const ids = [];
  for (const page of [1, 2]) {
    try {
      const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&page=${page}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });
      if (!res.ok) continue;
      const text = await res.text();
      const re = /https:\/\/m\.media-amazon\.com\/images\/I\/([A-Za-z0-9+_-]+?)(?:\._[^\"]+)?\.jpg/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        const id = m[1];
        if (
          id.length >= 8 &&
          id.length <= 14 &&
          !id.includes('grey') &&
          !id.includes('transparent') &&
          !id.includes('pixel') &&
          !id.includes('placeholder')
        ) {
          if (!ids.includes(id)) {
            ids.push(id);
          }
        }
      }
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 400));
  }
  return ids;
}

async function runHarvest() {
  console.log('Starting Amazon product image harvest...');
  let totalSaved = 0;

  for (let cIdx = 0; cIdx < CATEGORIES.length; cIdx++) {
    const cat = CATEGORIES[cIdx];
    for (let sIdx = 0; sIdx < cat.subcategories.length; sIdx++) {
      const sub = cat.subcategories[sIdx];
      const key = `${cat.slug}::${sub.slug}`;

      if (cache[key] && cache[key].length >= 30) {
        totalSaved += cache[key].length;
        continue;
      }

      console.log(`[${cIdx + 1}/${CATEGORIES.length}] Harvesting for ${cat.name} -> ${sub.name}...`);
      const queries = getQueries(cat, sub);
      const subIds = new Set(cache[key] || []);

      for (const q of queries) {
        if (subIds.size >= 40) break;
        const fetched = await fetchAmazonIds(q);
        fetched.forEach((id) => subIds.add(id));
      }

      cache[key] = Array.from(subIds);
      console.log(`   Found ${cache[key].length} Amazon image IDs for "${sub.name}".`);
      totalSaved += cache[key].length;

      // Persist periodically
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log(`Harvest complete! Total cached images: ${totalSaved}`);
}

runHarvest().catch(console.error);
