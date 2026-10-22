/**
 * base（GitHub Pages のサブフォルダ公開時は /hiratsukaen-site/）を考慮したURLヘルパー。
 * HTML属性（href / src / action）に書いたルート相対URLはビルド時に自動で補正されるため（integrations/base-path.mjs）、
 * ここは JSON・構造化データ・クライアントJS など属性以外でURLを組み立てる箇所で使う。
 */
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** '/products/' → '/hiratsukaen-site/products/'（base が '/' のときはそのまま） */
export const withBase = (path: string) => (path.startsWith('/') ? BASE + path.slice(1) : path);

/** '/hiratsukaen-site/products/' → '/products/' */
export const stripBase = (pathname: string) => (pathname.startsWith(BASE) ? `/${pathname.slice(BASE.length)}` : pathname);
