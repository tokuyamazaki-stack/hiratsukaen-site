// @ts-check
import { defineConfig } from 'astro/config';
import basePath from './integrations/base-path.mjs';

// GitHub Pages などサブフォルダで公開するときは、SITE_URL / BASE_PATH を環境変数で渡す（.github/workflows/deploy.yml）
export default defineConfig({
  site: process.env.SITE_URL || 'https://www.hiratsukaen.co.jp',
  base: process.env.BASE_PATH || '/',
  devToolbar: { enabled: false },
  integrations: [basePath()],
});
