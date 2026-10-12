import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// En local : site servi à la racine. Sur GitHub Pages : sous-dossier /lavage-des-fontaines/
// (BASE_PATH et SITE_URL sont définis dans .github/workflows/deploy.yml).
const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || 'https://www.lavagedesfontaines.fr';

// Préfixe les liens et images écrits en "/..." avec le sous-dossier, après le build
function prefixBase() {
  return {
    name: 'prefix-base',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (base === '/') return;
        const prefix = base.replace(/\/$/, '');
        const segment = prefix.slice(1);
        const re = new RegExp(`(href|src)="/(?!/|${segment}/)`, 'g');
        const walk = async (d) => {
          for (const entry of await readdir(d, { withFileTypes: true })) {
            const p = join(d, entry.name);
            if (entry.isDirectory()) await walk(p);
            else if (p.endsWith('.html')) {
              const html = await readFile(p, 'utf8');
              await writeFile(p, html.replace(re, `$1="${prefix}/`));
            }
          }
        };
        await walk(fileURLToPath(dir));
      },
    },
  };
}

export default defineConfig({
  site,
  base,
  integrations: [prefixBase()],
});
