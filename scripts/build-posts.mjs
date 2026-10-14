// Gera posts/index.json a partir dos arquivos posts/*.md
// Uso: node scripts/build-posts.mjs
// Arquivos que começam com "_" (ex.: _modelo.md) e posts com "draft: true" são ignorados.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'posts';

function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let [, key, val] = kv;
    val = val.trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      val = val.replace(/^["']|["']$/g, '');
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
    }
    data[key] = val;
  }
  return { data, body: m[2] };
}

const files = (await readdir(DIR)).filter(f => f.endsWith('.md') && !f.startsWith('_'));
const posts = [];

for (const file of files) {
  const { data, body } = parseFrontmatter(await readFile(join(DIR, file), 'utf8'));
  if (data.draft === true) continue;
  if (!data.title || !data.date) {
    console.warn(`⚠ ${file}: faltando "title" ou "date" no cabeçalho, ignorado.`);
    continue;
  }
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  posts.push({
    slug: file.replace(/\.md$/, ''),
    title: data.title,
    date: data.date,
    summary: data.summary || body.replace(/[#>*_`\[\]()!-]/g, '').trim().slice(0, 160) + '…',
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
    cover: data.cover || null,
    readingTime: Math.max(1, Math.round(words / 200)),
  });
}

posts.sort((a, b) => b.date.localeCompare(a.date));
await writeFile(join(DIR, 'index.json'), JSON.stringify(posts, null, 2) + '\n');
console.log(`✔ ${posts.length} post(s) em ${DIR}/index.json`);
