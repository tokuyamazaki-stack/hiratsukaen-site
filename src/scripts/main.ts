/**
 * 狭山茶の平塚園 — サイト全体のインタラクション
 * （フレームワーク不使用・素のTypeScript）
 */

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isPC = () => window.matchMedia('(min-width: 1024px)').matches;

/* ---------- body scroll lock ---------- */
let lockCount = 0;
function lock(on: boolean) {
  lockCount = Math.max(0, lockCount + (on ? 1 : -1));
  document.body.classList.toggle('is-locked', lockCount > 0);
}

/* =========================================================
   ヘッダー
   ========================================================= */
function initHeader() {
  const header = $('#header');
  if (!header) return;

  // スクロールで縮小
  const pagetop = $('.js-pagetop');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 80);
    pagetop?.classList.toggle('is-show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // メガメニュー（ホバー＋キーボード）
  const items = $$('.h-nav__item.has-mega', header);
  let closeTimer: number | undefined;
  const closeAll = (except?: Element) =>
    items.forEach((it) => {
      if (it === except) return;
      it.classList.remove('is-open');
      $('.h-nav__label', it)?.setAttribute('aria-expanded', 'false');
    });
  const open = (it: Element) => {
    closeAll(it);
    it.classList.add('is-open');
    $('.h-nav__label', it)?.setAttribute('aria-expanded', 'true');
    toggleSearch(false);
  };
  items.forEach((it) => {
    it.addEventListener('mouseenter', () => {
      if (!isPC()) return;
      window.clearTimeout(closeTimer);
      open(it);
    });
    it.addEventListener('mouseleave', () => {
      closeTimer = window.setTimeout(() => closeAll(), 160);
    });
    it.addEventListener('focusin', () => isPC() && open(it));
    it.addEventListener('focusout', (e) => {
      if (!it.contains((e as FocusEvent).relatedTarget as Node)) it.classList.remove('is-open');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAll();
      toggleSearch(false);
    }
  });

  // 検索レイヤー
  const searchBtn = $('.js-search-toggle', header);
  const layer = $('#search-layer');
  function toggleSearch(force?: boolean) {
    if (!layer || !searchBtn) return;
    const show = force ?? layer.hidden;
    layer.hidden = !show;
    searchBtn.setAttribute('aria-expanded', String(show));
    if (show) {
      closeAll();
      $<HTMLInputElement>('input', layer)?.focus();
    }
  }
  searchBtn?.addEventListener('click', () => toggleSearch());
  document.addEventListener('click', (e) => {
    if (layer && !layer.hidden && !header.contains(e.target as Node)) toggleSearch(false);
  });

  // SPドロワー
  const drawer = $('#drawer');
  const openBtn = $('.js-drawer-open');
  const setDrawer = (show: boolean) => {
    if (!drawer) return;
    if (show) {
      drawer.hidden = false;
      requestAnimationFrame(() => drawer.classList.add('is-open'));
      lock(true);
      $<HTMLElement>('.drawer__close', drawer)?.focus();
    } else {
      drawer.classList.remove('is-open');
      lock(false);
      window.setTimeout(() => (drawer.hidden = true), 400);
      openBtn?.focus();
    }
    openBtn?.setAttribute('aria-expanded', String(show));
  };
  openBtn?.addEventListener('click', () => setDrawer(true));
  $$('.js-drawer-close').forEach((b) => b.addEventListener('click', () => setDrawer(false)));
  $$('.drawer__accBtn').forEach((btn) =>
    btn.addEventListener('click', () => {
      const li = btn.closest('.drawer__acc');
      const openNow = !li?.classList.contains('is-open');
      li?.classList.toggle('is-open', openNow);
      btn.setAttribute('aria-expanded', String(openNow));
    }),
  );
}

/* =========================================================
   メインビジュアル スライダー
   ========================================================= */
function initMV() {
  const root = $('.js-mv');
  if (!root) return;
  const slides = $$('.mv__slide', root);
  const dots = $$('.js-mv-dot', root);
  const pauseBtn = $('.js-mv-pause', root);
  let index = 0;
  let playing = !reduceMotion;
  let timer: number | undefined;

  const go = (i: number) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      s.classList.toggle('is-active', n === index);
      s.setAttribute('aria-hidden', String(n !== index));
      $$('a, button', s).forEach((a) => (n === index ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
    });
    dots.forEach((d, n) => {
      d.classList.toggle('is-active', n === index);
      d.setAttribute('aria-selected', String(n === index));
    });
  };
  const schedule = () => {
    window.clearInterval(timer);
    if (playing) timer = window.setInterval(() => go(index + 1), 6500);
  };
  const setPlaying = (p: boolean) => {
    playing = p;
    if (pauseBtn) {
      pauseBtn.innerHTML = p
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 5v14M15 5v14"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M8 5l11 7-11 7z"/></svg>';
      pauseBtn.setAttribute('aria-label', p ? '自動再生を停止' : '自動再生を開始');
    }
    schedule();
  };

  $('.js-mv-prev', root)?.addEventListener('click', () => (go(index - 1), schedule()));
  $('.js-mv-next', root)?.addEventListener('click', () => (go(index + 1), schedule()));
  dots.forEach((d) => d.addEventListener('click', () => (go(Number(d.dataset.index)), schedule())));
  pauseBtn?.addEventListener('click', () => setPlaying(!playing));
  root.addEventListener('focusin', () => window.clearInterval(timer));
  root.addEventListener('focusout', schedule);
  addSwipe($('.mv__viewport', root), (dir) => (go(index + dir), schedule()));

  go(0);
  setPlaying(playing);
}

/* =========================================================
   煎茶シリーズ スライダー（伊藤園ブランドコンセプト）
   ========================================================= */
function initBrand() {
  const root = $('.js-brand');
  if (!root) return;
  const track = $('.js-brand-track', root)!;
  const items = $$('.js-brand-item', root);
  const current = $('.js-brand-current', root);
  let index = 0;

  const go = (i: number) => {
    index = (i + items.length) % items.length;
    const first = items[0];
    const step = items.length > 1 ? items[1].offsetLeft - first.offsetLeft : 0;
    track.style.transform = `translateX(${-step * index}px)`;
    items.forEach((it, n) => {
      it.classList.toggle('is-active', n === index);
      it.classList.toggle('is-prev', n < index);
      $$('.js-fade', it).forEach((f) => n === index && f.classList.add('is-in'));
    });
    if (current) current.textContent = String(index + 1);
  };
  $('.js-brand-next', root)?.addEventListener('click', () => go(index + 1));
  $('.js-brand-prev', root)?.addEventListener('click', () => go(index - 1));
  addSwipe(track, (dir) => go(index + dir));
  window.addEventListener('resize', () => go(index));
}

function addSwipe(el: HTMLElement | null, cb: (dir: 1 | -1) => void) {
  if (!el) return;
  let x0: number | null = null;
  let y0 = 0;
  el.addEventListener('touchstart', (e) => {
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) cb(dx < 0 ? 1 : -1);
    x0 = null;
  });
}

/* =========================================================
   タブ（WAI-ARIA tabs）
   ========================================================= */
function initTabs() {
  $$('.js-tabs').forEach((root) => {
    const tabs = $$<HTMLButtonElement>('[role="tab"]', root);
    const select = (tab: HTMLButtonElement) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls') ?? '');
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = (e as KeyboardEvent).key;
        if (k !== 'ArrowRight' && k !== 'ArrowLeft') return;
        const next = tabs[(i + (k === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        next.focus();
        select(next);
      });
    });
  });
}

/* =========================================================
   スクロールでフェードイン
   ========================================================= */
function initFade() {
  const els = $$('.js-fade');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    els.forEach((e) => e.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  els.forEach((e) => io.observe(e));
}

/* =========================================================
   フローティングヘルプ
   ========================================================= */
function initHelp() {
  const root = $('.js-help');
  if (!root) return;
  const panel = $('#help-panel');
  const main = $('.help__toggle', root);
  $$('.js-help-toggle', root).forEach((b) =>
    b.addEventListener('click', () => {
      if (!panel) return;
      const show = panel.hidden;
      panel.hidden = !show;
      root.classList.toggle('is-open', show);
      main?.setAttribute('aria-expanded', String(show));
      if (show) $<HTMLElement>('.help__list a', panel)?.focus();
      else main?.focus();
    }),
  );
}

/* =========================================================
   カート（localStorage・決済なし）
   ========================================================= */
type Catalog = Record<string, { name: string; spec: string | null; price: number; image: string }>;
const CART_KEY = 'hiratsukaen:cart';

function initCart() {
  const catalog: Catalog = JSON.parse($('#catalog-data')?.textContent ?? '{}');
  const root = $('#cart');
  if (!root) return;
  const free = Number(root.dataset.free ?? 5000);
  const list = $('.js-cart-list', root)!;
  const empty = $('.js-cart-empty', root)!;
  const foot = $('.js-cart-foot', root)!;
  const shipText = $('.js-cart-ship-text', root)!;
  const shipBar = $('.js-cart-ship-bar', root)!;
  const ship = $('.js-cart-ship', root)!;

  const read = (): Record<string, number> => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) ?? '{}');
    } catch {
      return {};
    }
  };
  let cart = read();
  const save = () => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* プライベートモード等では保存しない */
    }
    render();
  };

  function render() {
    const ids = Object.keys(cart).filter((id) => catalog[id] && cart[id] > 0);
    const count = ids.reduce((s, id) => s + cart[id], 0);
    const total = ids.reduce((s, id) => s + catalog[id].price * cart[id], 0);

    $$('.js-cart-count').forEach((b) => {
      b.textContent = String(count);
      b.hidden = count === 0;
    });

    empty.hidden = ids.length > 0;
    foot.hidden = ids.length === 0;
    ship.hidden = ids.length === 0;
    list.innerHTML = ids
      .map((id) => {
        const p = catalog[id];
        const q = cart[id];
        return `<li class="cart__item">
          <a class="cart__img" href="${BASE}products/${id}/"><img src="${p.image}" alt="" /></a>
          <div>
            <p class="cart__name"><a href="${BASE}products/${id}/">${p.name}</a></p>
            ${p.spec ? `<p class="cart__spec">${p.spec}</p>` : ''}
            <div class="cart__row">
              <div class="qty" data-id="${id}">
                <button type="button" data-step="-1" aria-label="数量を減らす" ${q <= 1 ? 'disabled' : ''}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14"/></svg></button>
                <input type="number" min="1" max="99" value="${q}" aria-label="数量" />
                <button type="button" data-step="1" aria-label="数量を増やす"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg></button>
              </div>
              <p class="cart__price">${yen(p.price * q)}</p>
            </div>
            <button type="button" class="cart__remove" data-remove="${id}">削除する</button>
          </div>
        </li>`;
      })
      .join('');

    const sub = $('.js-cart-subtotal', root);
    if (sub) sub.textContent = yen(total);
    const rest = free - total;
    shipText.classList.toggle('is-free', rest <= 0);
    shipText.innerHTML =
      rest > 0
        ? `あと <strong>${yen(rest)}</strong> のお買い上げで送料無料`
        : '送料無料の対象です（ご自宅への配送に限ります）';
    shipBar.style.width = `${Math.min(100, (total / free) * 100)}%`;
  }

  const setQty = (id: string, q: number) => {
    cart[id] = Math.max(1, Math.min(99, q || 1));
    save();
  };
  list.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const rm = t.closest<HTMLElement>('[data-remove]');
    if (rm) {
      delete cart[rm.dataset.remove!];
      save();
      return;
    }
    const step = t.closest<HTMLElement>('[data-step]');
    if (step) {
      const id = step.closest<HTMLElement>('.qty')!.dataset.id!;
      setQty(id, cart[id] + Number(step.dataset.step));
    }
  });
  list.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    const id = input.closest<HTMLElement>('.qty')?.dataset.id;
    if (id) setQty(id, Number(input.value));
  });

  // 開閉
  let lastFocus: HTMLElement | null = null;
  const setOpen = (show: boolean) => {
    if (show) {
      $('.js-toast')?.classList.remove('is-show');
      lastFocus = document.activeElement as HTMLElement;
      root.hidden = false;
      requestAnimationFrame(() => root.classList.add('is-open'));
      lock(true);
      $<HTMLElement>('.cart__close', root)?.focus();
    } else {
      root.classList.remove('is-open');
      lock(false);
      window.setTimeout(() => (root.hidden = true), 400);
      lastFocus?.focus();
    }
  };
  $$('.js-cart-open').forEach((b) => b.addEventListener('click', () => setOpen(true)));
  $$('.js-cart-close', root).forEach((b) => b.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !root.hidden && setOpen(false));

  // カートに入れる
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.js-add-cart');
    if (!btn) return;
    const id = btn.dataset.id!;
    if (!catalog[id]) return;
    const qtyInput = btn.dataset.qty ? $<HTMLInputElement>(btn.dataset.qty) : null;
    const q = Math.max(1, Number(qtyInput?.value ?? 1));
    cart[id] = Math.min(99, (cart[id] ?? 0) + q);
    save();
    toast(`「${catalog[id].name}」をカートに入れました`, 'カートを見る', () => setOpen(true));
  });

  // 購入手続き（デモ）
  $('.js-checkout', root)?.addEventListener('click', () => {
    setOpen(false);
    showModal(
      'ご購入手続きについて',
      `<p>このサイトはリニューアル用のプロトタイプのため、決済機能は実装していません。</p>
       <p>本番環境では、ここから既存のカートシステム（カラーミーショップ等）または新しい決済サービスのご購入画面へ進む想定です。</p>
       <p>お急ぎの方はお電話でもご注文いただけます。</p>
       <a class="modal__tel" href="tel:0429622443">04-2962-2443</a>`,
    );
  });

  render();
  window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) {
      cart = read();
      render();
    }
  });
}

/* ---------- toast / modal ---------- */
let toastTimer: number | undefined;
function toast(msg: string, action?: string, onAction?: () => void) {
  const el = $('.js-toast');
  if (!el) return;
  el.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = msg;
  el.append(span);
  if (action && onAction) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = action;
    b.addEventListener('click', () => {
      el.classList.remove('is-show');
      onAction();
    });
    el.append(b);
  }
  el.classList.add('is-show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-show'), 4000);
}

function showModal(title: string, html: string) {
  const m = $('#modal');
  if (!m) return;
  $('.js-modal-title', m)!.textContent = title;
  $('.js-modal-body', m)!.innerHTML = html;
  m.hidden = false;
  lock(true);
  $<HTMLElement>('.c-btn', m)?.focus();
}
function initModal() {
  const m = $('#modal');
  if (!m) return;
  const close = () => {
    m.hidden = true;
    lock(false);
  };
  $$('.js-modal-close', m).forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !m.hidden && close());
}

/* =========================================================
   商品一覧：絞り込み・並び替え（URLパラメータ連動）
   ========================================================= */
function initProductList() {
  const root = $('.js-plist');
  if (!root) return;
  const grid = $('.js-plist-grid', root)!;
  const cards = $$('[data-product]', grid);
  const countEl = $('.js-plist-count', root);
  const emptyEl = $('.js-plist-empty', root);
  const qInput = $<HTMLInputElement>('.js-plist-q', root);
  const sortSel = $<HTMLSelectElement>('.js-plist-sort', root);
  const intro = $('.js-plist-intro', root);
  const chips = $('.js-plist-chips', root);
  const catInfo: Record<string, { name: string; en: string; lead: string; icon: string }> = JSON.parse(
    $('#cat-data')?.textContent ?? '{}',
  );
  const groupInfo: Record<string, { name: string; sub: string }> = JSON.parse($('#group-data')?.textContent ?? '{}');
  const originalOrder = cards.slice();

  const state = new URLSearchParams(location.search);
  const get = (k: string) => state.get(k) ?? '';

  function apply() {
    const cat = get('cat');
    const group = get('group');
    const price = get('price');
    const q = get('q').trim().toLowerCase();
    const sort = get('sort') || 'reco';
    const [min, max] = price ? price.split('-').map((v) => (v === '' ? NaN : Number(v))) : [NaN, NaN];
    const words = q.split(/[\s　]+/).filter(Boolean);

    let shown = 0;
    cards.forEach((c) => {
      const d = c.dataset;
      const p = Number(d.price);
      const ok =
        (!cat || d.cat === cat) &&
        (!group || d.group === group) &&
        (isNaN(min) || p >= min) &&
        (isNaN(max) || p < max) &&
        words.every((w) => (d.search ?? '').toLowerCase().includes(w));
      c.hidden = !ok;
      if (ok) shown++;
    });

    const sorted = originalOrder.slice();
    if (sort === 'price-asc') sorted.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    if (sort === 'price-desc') sorted.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    if (sort === 'rank') sorted.sort((a, b) => Number(a.dataset.rank) - Number(b.dataset.rank));
    sorted.forEach((c) => grid.append(c));

    if (countEl) countEl.textContent = String(shown);
    if (emptyEl) emptyEl.hidden = shown > 0;
    if (qInput && document.activeElement !== qInput) qInput.value = get('q');
    if (sortSel) sortSel.value = sort;

    // サイドバーの選択状態
    $$('[data-filter-cat]', root).forEach((a) => a.classList.toggle('is-active', (a.dataset.filterCat ?? '') === cat && !group));
    $$('[data-filter-group]', root).forEach((a) => a.classList.toggle('is-active', a.dataset.filterGroup === group));
    $$('[data-filter-price]', root).forEach((b) => b.classList.toggle('is-active', (b.dataset.filterPrice ?? '') === price));

    // カテゴリ紹介
    if (intro) {
      const info = cat ? catInfo[cat] : null;
      const g = group ? groupInfo[group] : null;
      intro.hidden = !info && !g;
      if (info) {
        intro.innerHTML = `<div><p class="plist__introTitle">${info.name}<small>${info.en}</small></p><p class="plist__introText">${info.lead}</p></div>`;
      } else if (g) {
        intro.innerHTML = `<div><p class="plist__introTitle">${g.name}</p><p class="plist__introText">${g.sub}</p></div>`;
      }
    }

    // 適用中の条件チップ
    if (chips) {
      const items: [string, string][] = [];
      if (q) items.push(['q', `「${get('q')}」`]);
      if (price) {
        const label = price.endsWith('-') ? `${Number(price.slice(0, -1)).toLocaleString()}円〜` : price.replace(/(\d+)-(\d+)/, (_, a, b) => `${Number(a).toLocaleString()}〜${Number(b).toLocaleString()}円`).replace(/^0〜/, '〜');
        items.push(['price', label]);
      }
      chips.innerHTML = items
        .map(([k, l]) => `<button type="button" data-clear="${k}">${l}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5l14 14M19 5 5 19"/></svg></button>`)
        .join('');
      chips.hidden = items.length === 0;
    }

    // 見出し
    const title = $('.page-head__title');
    if (title) title.textContent = cat ? catInfo[cat]?.name ?? '商品一覧' : group ? groupInfo[group]?.name ?? '商品一覧' : q ? '検索結果' : '商品一覧';
  }

  const update = (patch: Record<string, string | null>) => {
    Object.entries(patch).forEach(([k, v]) => (v ? state.set(k, v) : state.delete(k)));
    const qs = state.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
    apply();
  };

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const catA = t.closest<HTMLElement>('[data-filter-cat]');
    if (catA) {
      e.preventDefault();
      update({ cat: catA.dataset.filterCat || null, group: null });
      closeSide();
      grid.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const grpA = t.closest<HTMLElement>('[data-filter-group]');
    if (grpA) {
      e.preventDefault();
      update({ group: grpA.dataset.filterGroup || null, cat: null });
      closeSide();
      return;
    }
    const pr = t.closest<HTMLElement>('[data-filter-price]');
    if (pr) {
      update({ price: pr.classList.contains('is-active') ? null : pr.dataset.filterPrice || null });
      closeSide();
      return;
    }
    const clr = t.closest<HTMLElement>('[data-clear]');
    if (clr) update({ [clr.dataset.clear!]: null });
    if (t.closest('.js-plist-reset')) update({ cat: null, group: null, price: null, q: null });
  });
  let qTimer: number | undefined;
  qInput?.addEventListener('input', () => {
    window.clearTimeout(qTimer);
    qTimer = window.setTimeout(() => update({ q: qInput.value || null }), 200);
  });
  qInput?.closest('form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    update({ q: qInput.value || null });
    closeSide();
  });
  sortSel?.addEventListener('change', () => update({ sort: sortSel.value === 'reco' ? null : sortSel.value }));

  // SP：絞り込みパネル
  const side = $('.js-plist-side', root);
  function closeSide() {
    if (side?.classList.contains('is-open')) {
      side.classList.remove('is-open');
      lock(false);
    }
  }
  $('.js-plist-filter', root)?.addEventListener('click', () => {
    side?.classList.add('is-open');
    lock(true);
  });
  $$('.js-plist-side-close', root).forEach((b) => b.addEventListener('click', closeSide));

  apply();
}

/* =========================================================
   商品詳細：数量・追従購入バー
   ========================================================= */
function initDetail() {
  $$('.js-qty').forEach((q) => {
    const input = $<HTMLInputElement>('input', q)!;
    const minus = $<HTMLButtonElement>('[data-step="-1"]', q)!;
    const sync = () => {
      input.value = String(Math.max(1, Math.min(99, Number(input.value) || 1)));
      minus.disabled = Number(input.value) <= 1;
    };
    q.addEventListener('click', (e) => {
      const s = (e.target as HTMLElement).closest<HTMLElement>('[data-step]');
      if (!s) return;
      input.value = String(Number(input.value) + Number(s.dataset.step));
      sync();
    });
    input.addEventListener('change', sync);
    sync();
  });

  const bar = $('.js-buybar');
  const target = $('.js-buy-main');
  if (bar && target && 'IntersectionObserver' in window) {
    document.body.classList.add('has-buybar');
    new IntersectionObserver(([en]) => {
      const passed = !en.isIntersecting && en.boundingClientRect.top < 0;
      bar.classList.toggle('is-show', passed);
    }).observe(target);
  }
}

/* =========================================================
   お問い合わせフォーム（送信しないデモ）
   ========================================================= */
function initForms() {
  $$<HTMLFormElement>('.js-demo-form').forEach((f) =>
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      showModal(
        'お問い合わせを受け付けました（デモ）',
        '<p>このサイトはプロトタイプのため、実際には送信されていません。</p><p>本番環境では、入力内容の確認画面と自動返信メールを用意する想定です。</p>',
      );
      f.reset();
    }),
  );
}

/* ---------- init ---------- */
document.documentElement.classList.remove('no-js');
initHeader();
initMV();
initBrand();
initTabs();
initFade();
initHelp();
initModal();
initCart();
initProductList();
initDetail();
initForms();
