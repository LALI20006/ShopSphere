const { CATEGORIES } = require('../../dist/data/categories.js');

const queryMap = {};

for (const cat of CATEGORIES) {
  for (const sub of cat.subcategories) {
    // Generate clean search terms from subcategory name
    const terms = [
      sub.name.toLowerCase().replace(/[&,]/g, ' ').replace(/\s+/g, '-'),
      sub.slug,
    ];
    queryMap[sub.slug] = {
      category: cat.name,
      subcategory: sub.name,
      slug: sub.slug,
      queries: terms,
    };
  }
}

console.log('Total mapped subcategories:', Object.keys(queryMap).length);
console.log('Sample mapping:');
console.log(Object.values(queryMap).slice(0, 5));
