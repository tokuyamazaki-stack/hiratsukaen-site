import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * base（例：/hiratsukaen-site）配下で公開するビルドのとき、
 * HTMLに手書きしたルート相対URL（href="/products/" など）へ base を付け足す。
 * base が "/" のとき（ローカル開発・本番ドメイン直下）は何もしない。
 */
export default function basePath() {
  let prefix = '';
  return {
    name: 'base-path',
    hooks: {
      'astro:config:done': ({ config }) => {
        prefix = config.base.replace(/\/$/, '');
      },
      'astro:build:done': async ({ dir, logger }) => {
        if (!prefix) return;
        const attr = /(\s(?:href|src|action)=")(\/[^"]*)"/g;
        let count = 0;
        for (const file of await htmlFiles(fileURLToPath(dir))) {
          const html = await readFile(file, 'utf8');
          const out = html.replace(attr, (match, head, url) => {
            if (url.startsWith('//') || url === prefix || url.startsWith(`${prefix}/`)) return match;
            count++;
            return `${head}${prefix}${url}"`;
          });
          if (out !== html) await writeFile(file, out);
        }
        logger.info(`added base "${prefix}" to ${count} URLs`);
      },
    },
  };
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith('.html')).map((e) => join(e.parentPath, e.name));
}
