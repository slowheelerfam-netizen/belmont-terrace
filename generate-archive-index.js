const fs = require('fs');
const path = require('path');

function walk(dir, base) {
  const results = [];
  for (const item of fs.readdirSync(dir)) {
    if (item.startsWith('.')) continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...walk(full, base));
    } else {
      const rel = path.relative(base, full);
      const parts = rel.split('/');
      results.push({
        filename: item,
        url: '/archive/' + rel,
        year: parts[0],
        month: parts[1],
        size: stat.size,
        ext: path.extname(item).replace('.', '').toLowerCase()
      });
    }
  }
  return results;
}

const index = walk('./public/archive', './public/archive');
fs.writeFileSync('./archive-index.json', JSON.stringify(index, null, 2));
console.log('Generated', index.length, 'entries');