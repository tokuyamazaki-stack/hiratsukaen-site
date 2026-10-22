import productsJson from './products.json';

export type Product = {
  id: string;
  name: string;
  spec: string | null;
  price: number;
  category: string;
  series: string | null;
  grade: string | null;
  desc: string;
  image: string;
  recommend: boolean;
  bestseller: number | null;
};

export const products = productsJson as Product[];

export const company = {
  name: '有限会社 平塚園',
  shopName: '狭山茶の平塚園',
  tagline: '農林水産大臣賞 四度受賞の狭山茶',
  ceo: '平塚 尚吾',
  zip: '358-0011',
  address: '埼玉県入間市下藤沢645',
  tel: '04-2962-2443',
  fax: '04-2965-6767',
  email: 'naosyah-co@yahoo.co.jp',
  founded: '昭和24年',
  established: '昭和47年4月',
  business: '狭山茶の製造・販売',
  freeShippingThreshold: 5000,
};

export const stores = [
  {
    id: 'honten',
    name: '入間本店',
    en: 'IRUMA MAIN STORE',
    zip: '358-0011',
    address: '埼玉県入間市下藤沢645',
    tel: '04-2962-2443',
    fax: '04-2965-6767',
    image: '/images/photo/field-iruma-1.jpg',
    lead: '茶畑の広がる入間の地で、自園で育てた狭山茶を製造・販売しています。',
    features: ['自園・自製の狭山茶を全種類取り揃え', '贈り物のご相談も承ります'],
    mapQuery: '埼玉県入間市下藤沢645',
  },
  {
    id: 'saiboku',
    name: '日高サイボク店',
    en: 'HIDAKA SAIBOKU STORE',
    zip: null,
    address: '埼玉県日高市下大谷沢546',
    tel: '042-985-5343',
    fax: '042-985-5343',
    image: '/images/photo/hojicha-leaves.jpg',
    lead: 'お買いもの、レストラン、天然温泉などが楽しめるサイボクの敷地内にあるお店です。',
    features: ['土・日・祝日は催事テントで、ほうじ茶を炒りながら販売', '焙じたての香ばしい香りをお楽しみいただけます'],
    mapQuery: '埼玉県日高市下大谷沢546',
  },
];

export type Category = {
  slug: string;
  name: string;
  en: string;
  group: 'green' | 'roasted' | 'easy' | 'gift';
  icon: string;
  lead: string;
};

export const categories: Category[] = [
  { slug: 'sencha', name: '煎茶', en: 'SENCHA', group: 'green', icon: 'cup', lead: '狭山茶の真髄。茶摘みの時期と茶葉の部位で味わいの異なる9種類をご用意しています。' },
  { slug: 'kukicha', name: 'くき茶', en: 'KUKICHA', group: 'green', icon: 'stem', lead: '上級煎茶を選別する際に出る茎を集めたお茶。すっきりとした香りと上品な味わいです。' },
  { slug: 'mecha', name: '芽茶', en: 'MECHA', group: 'green', icon: 'bud', lead: '若芽の先の芽を集めたお茶。うまみと渋みが強く、濃い味わいがお好みの方に。' },
  { slug: 'konacha', name: '粉茶', en: 'KONACHA', group: 'green', icon: 'powder', lead: '一番茶の煎茶を製造する過程で出る粉を集めたお茶。短時間でしっかり色と味が出ます。' },
  { slug: 'aracha', name: '荒茶', en: 'ARACHA', group: 'green', icon: 'leaf', lead: '製造過程で何も取り除いていない、昔ながらのお茶本来の味が楽しめます。' },
  { slug: 'hojicha', name: 'ほうじ茶', en: 'HOJICHA', group: 'roasted', icon: 'roast', lead: '番茶を強火で炒って香ばしい香りを引き出したお茶。カフェインが少なく、食後や就寝前にも。' },
  { slug: 'bancha', name: '番茶', en: 'BANCHA', group: 'roasted', icon: 'kettle', lead: '遅摘みの茶葉の硬い部分から造るお茶。カフェインが少なめで、どなたにもやさしい味わいです。' },
  { slug: 'genmaicha', name: '玄米茶', en: 'GENMAICHA', group: 'roasted', icon: 'rice', lead: '上級のもち米玄米や抹茶を合わせた、香ばしく親しみやすいお茶です。' },
  { slug: 'teabag', name: 'ティーバッグ', en: 'TEA BAG', group: 'easy', icon: 'teabag', lead: 'ポットや水筒、マグカップで手軽に。水出し用のティーパックもございます。' },
  { slug: 'powder', name: 'パウダー茶', en: 'POWDER', group: 'easy', icon: 'spoon', lead: '茶葉を抹茶状にひいたお茶。水でもお湯でも溶かすだけで、茶葉の栄養をまるごと。' },
  { slug: 'gift', name: '贈り物用', en: 'GIFT', group: 'gift', icon: 'gift', lead: '袋箱入り・缶セット・吟撰缶セットなど、大切な方への贈り物に。' },
  { slug: 'sweets', name: 'お菓子', en: 'SWEETS', group: 'gift', icon: 'sweets', lead: '狭山茶を練り込んだようかんや茶飴。お茶のおともに。' },
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

export const categoryGroups = [
  { id: 'green', name: '緑茶', sub: '煎茶・くき茶・芽茶・粉茶・荒茶', href: '/products/?group=green' },
  { id: 'roasted', name: '香ばしいお茶', sub: 'ほうじ茶・番茶・玄米茶', href: '/products/?group=roasted' },
  { id: 'gift', name: '贈り物・お菓子', sub: '袋箱入り・缶セット・ようかん', href: '/products/?group=gift' },
];

/** 煎茶のシリーズ（伊藤園の「ブランドコンセプト」に相当） */
export const series = [
  {
    id: 'mideno',
    name: '見出野',
    en: 'MIDENO',
    catch: '一番に摘んだ、\n最上の一杯。',
    body: '茶摘みのなかでも特に早い時期に摘まれた茶葉で造る、当園最上級の煎茶。旨みがありまろやかで、香りには格別の品があります。',
    image: '/images/photo/field-iruma-1.jpg',
    product: '16443609',
  },
  {
    id: 'kaori',
    name: '狭山かおり',
    en: 'SAYAMA KAORI',
    catch: '狭山ならではの、\nまろやかなコク。',
    body: '5月上旬に摘まれた茶葉で造る上級煎茶。狭山茶独特のまろやかさとコクを、もっとも素直に味わえる一品です。',
    image: '/images/photo/cup-sencha.jpg',
    product: '16443483',
  },
  {
    id: 'hachijuhachiya',
    name: '八十八夜摘',
    en: 'HACHIJUHACHIYA',
    catch: '縁起のよい、\n八十八夜の新茶。',
    body: '立春から数えて八十八日目、八十八夜前後に摘まれた茶葉で造るお茶。渋みの中に、まろやかさとコクが広がります。',
    image: '/images/photo/field-iruma-3.jpg',
    product: '16443434',
  },
  {
    id: 'tsubaki',
    name: '狭山つばき',
    en: 'SAYAMA TSUBAKI',
    catch: 'ふくよかな香りの、\n平塚園の定番。',
    body: 'ふくよかな香り、コクと旨みが特徴。お使い物にはこのクラスから選ばれる方が多い、いちばん人気の煎茶です。',
    image: '/images/photo/kyusu-cup.jpg',
    product: '16443669',
  },
];

/** お知らせ（※デザイン確認用のサンプルを含みます。公開前に差し替えてください） */
export const news = [
  { date: '2026.10.22', tag: 'お知らせ', type: 'info', title: 'ホームページをリニューアルしました', href: '/news/' },
  { date: '2026.10.01', tag: '商品', type: 'item', title: '秋冬はコクのある仕上げの煎茶をお届けしています', href: '/about/#season' },
  { date: '2026.09.12', tag: '商品', type: 'item', title: '贈り物用の袋箱入り・缶セットのご案内', href: '/gift/' },
  { date: '2026.06.20', tag: '商品', type: 'item', title: '夏の冷茶に「特選水出し茶 ティーパック」がおすすめです', href: '/products/16445080/' },
  { date: '2026.05.02', tag: 'お店', type: 'store', title: '日高サイボク店では土・日・祝日にほうじ茶の焙煎販売を行っています', href: '/shops/#saiboku' },
  { date: '2026.04.01', tag: 'ご注意', type: 'info', title: '当園の狭山茶は当サイトおよび直営店以外では販売しておりません', href: '/news/#notice' },
];

export const nav = [
  {
    label: '商品を探す',
    href: '/products/',
    mega: 'products',
  },
  { label: '贈り物', href: '/gift/' },
  {
    label: 'お茶を知る・楽しむ',
    href: '/learn/',
    mega: 'learn',
  },
  { label: '平塚園について', href: '/about/' },
  { label: '店舗案内', href: '/shops/' },
  { label: 'ご利用ガイド', href: '/guide/' },
];

export const learnLinks = [
  { title: 'おいしいいれ方', en: 'HOW TO BREW', href: '/learn/brew/', image: '/images/photo/cup-sencha-deep.jpg', text: '湯温と時間で、同じ茶葉が驚くほど変わります。種類別のいれ方の目安をご紹介。' },
  { title: 'お茶の種類', en: 'TEA TYPES', href: '/learn/types/', image: '/images/photo/genmaicha.jpg', text: '煎茶、くき茶、芽茶、ほうじ茶…。それぞれの特徴と、おすすめの楽しみ方。' },
  { title: '狭山茶とは', en: 'ABOUT SAYAMA TEA', href: '/learn/sayamacha/', image: '/images/photo/field-sayama.jpg', text: '「味は狭山でとどめさす」と歌われた、狭山茶の歴史とおいしさの理由。' },
  { title: '茶園の一年', en: 'TEA CALENDAR', href: '/learn/sayamacha/#calendar', image: '/images/photo/leaves-sayama.jpg', text: '新芽の芽吹きから一番茶、二番茶、そして冬の休眠まで。茶園の四季をたどります。' },
];

export const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;

/** 種類ごとのいれ方の目安 */
export const brewGuides: Record<string, { label: string; leaf: string; water: string; temp: string; time: string; note?: string }> = {
  premium: { label: '上級煎茶', leaf: '6g（ティースプーン約3杯）', water: '180ml（3人分）', temp: '70〜80℃', time: '60〜90秒', note: '湯冷ましでじっくり冷ますと、旨みと甘みが引き立ちます。' },
  sencha: { label: '煎茶', leaf: '10g（ティースプーン約5杯）', water: '450ml（5人分）', temp: '80〜90℃', time: '30〜60秒', note: '最後の一滴まで注ぎ切ると、二煎目もおいしくいただけます。' },
  kukicha: { label: 'くき茶', leaf: '6g', water: '180ml（3人分）', temp: '80℃', time: '60秒', note: '茎ならではの爽やかな香りを楽しむなら、少し低めの温度で。' },
  mecha: { label: '芽茶', leaf: '5g', water: '180ml（3人分）', temp: '80℃', time: '30秒', note: '味が濃く出やすいので、短めの浸出がおすすめです。' },
  konacha: { label: '粉茶', leaf: '3g', water: '180ml（3人分）', temp: '80〜90℃', time: '10〜20秒', note: '茶こしや目の細かい急須をお使いください。' },
  aracha: { label: '荒茶', leaf: '6g', water: '180ml（3人分）', temp: '80℃', time: '60秒' },
  roasted: { label: 'ほうじ茶・番茶・玄米茶', leaf: '10g', water: '450ml（5人分）', temp: '熱湯（95℃以上）', time: '30秒', note: '熱湯で手早くいれると、香ばしい香りがいっそう立ちます。' },
  teabag: { label: 'ティーバッグ', leaf: '5gパック1袋', water: '300〜500ml', temp: '熱湯', time: '1〜2分', note: 'ひも付き（2g）はマグカップ1杯（150〜200ml）が目安です。' },
  cold: { label: '水出し', leaf: 'ティーパック1袋', water: '水 500ml〜1L', temp: '冷水', time: '冷蔵庫で約2〜3時間', note: '氷と一緒に水筒へ入れれば、外出先でも冷茶が楽しめます。' },
  powder: { label: 'パウダー茶', leaf: '小さじ1/2（約0.5g）', water: '150ml', temp: '水またはお湯', time: '溶かすだけ', note: '牛乳や料理に混ぜても楽しめます。' },
};

export function brewKeyFor(p: Product): string | null {
  if (p.category === 'sencha') return ['mideno', 'kaori', 'hachijuhachiya'].includes(p.series ?? '') ? 'premium' : 'sencha';
  if (p.category === 'gift') return p.series ? (['mideno', 'kaori', 'hachijuhachiya'].includes(p.series) ? 'premium' : 'sencha') : null;
  if (['hojicha', 'bancha', 'genmaicha'].includes(p.category)) return 'roasted';
  if (p.category === 'teabag') return p.name.includes('水出し') ? 'cold' : 'teabag';
  if (p.category === 'sweets') return null;
  return p.category in brewGuides ? p.category : null;
}
