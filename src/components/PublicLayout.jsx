import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Facebook,
  Home,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PackageSearch,
  Phone,
  ShoppingBag,
  Store,
  X
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useLocation
} from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';

export default function PublicLayout() {
  const {
    settings,
    categories = [],
    pages = []
  } = useStore();

  const { count } = useCart();
  const location = useLocation();

  const footerRef = useRef(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [
    openMobileCategory,
    setOpenMobileCategory
  ] = useState(null);

  const [
    footerVisible,
    setFooterVisible
  ] = useState(false);

  const activeCategoryId =
    new URLSearchParams(
      location.search
    ).get('category');

  const primaryColor =
    settings?.primaryColor || '#0f172a';

  const secondaryColor =
    settings?.secondaryColor || '#d97706';

  const themeVariables = {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,

    '--on-primary':
      getContrastColor(primaryColor),

    '--on-secondary':
      getContrastColor(secondaryColor),

    '--primary-dark': `color-mix(in srgb, ${primaryColor} 84%, black)`,

    '--primary-soft': `color-mix(in srgb, ${primaryColor} 8%, white)`,

    '--primary-border': `color-mix(in srgb, ${primaryColor} 20%, white)`,

    '--secondary-dark': `color-mix(in srgb, ${secondaryColor} 84%, black)`,

    '--secondary-soft': `color-mix(in srgb, ${secondaryColor} 11%, white)`,

    '--secondary-border': `color-mix(in srgb, ${secondaryColor} 28%, white)`
  };

  const topCategories = useMemo(
    () =>
      categories
        .filter(
          item =>
            !item.parentId &&
            item.active &&
            item.showInMenu !== false
        )
        .sort(
          (a, b) =>
            Number(a.sortOrder || 0) -
            Number(b.sortOrder || 0)
        ),
    [categories]
  );

  const publishedPages = useMemo(
    () =>
      pages
        .filter(
          page =>
            page.status === 'published'
        )
        .slice(0, 6),
    [pages]
  );

  const socials =
    settings?.socialLinks || {};

  const whatsappNumber =
    socials.whatsapp
      ? socials.whatsapp.replace(
          /\D/g,
          ''
        )
      : '';

  const currentYear =
    new Date().getFullYear();

  const getSubcategories = parentId =>
    categories
      .filter(
        item =>
          String(item.parentId) ===
            String(parentId) &&
          item.active
      )
      .sort(
        (a, b) =>
          Number(a.sortOrder || 0) -
          Number(b.sortOrder || 0)
      );

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setOpenMobileCategory(null);
  };

  const toggleMobileCategory =
    categoryId => {
      setOpenMobileCategory(current =>
        String(current) ===
        String(categoryId)
          ? null
          : categoryId
      );
    };

  useEffect(() => {
    setMenuOpen(false);
    setOpenMobileCategory(null);
  }, [
    location.pathname,
    location.search
  ]);

  useEffect(() => {
    document.body.style.overflow =
      menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /*
   * পুরোনো global CSS-এ body/html margin বা bottom padding
   * থাকলেও footer-এর পরে extra space যেন না আসে।
   */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previous = {
      htmlMargin: html.style.margin,
      htmlPadding: html.style.padding,
      bodyMargin: body.style.margin,
      bodyPadding: body.style.padding,
      bodyMinHeight: body.style.minHeight,
      bodyOverflowX: body.style.overflowX
    };

    html.style.margin = '0';
    html.style.padding = '0';
    body.style.margin = '0';
    body.style.padding = '0';
    body.style.minHeight = '100%';
    body.style.overflowX = 'hidden';

    return () => {
      html.style.margin = previous.htmlMargin;
      html.style.padding = previous.htmlPadding;
      body.style.margin = previous.bodyMargin;
      body.style.padding = previous.bodyPadding;
      body.style.minHeight = previous.bodyMinHeight;
      body.style.overflowX = previous.bodyOverflowX;
    };
  }, []);

  /*
   * Footer screen-এ দেখা শুরু করলে
   * mobile bottom navigation hide হবে।
   */
  useEffect(() => {
    const footerElement =
      footerRef.current;

    if (
      !footerElement ||
      typeof IntersectionObserver ===
        'undefined'
    ) {
      return undefined;
    }

    const observer =
      new IntersectionObserver(
        entries => {
          const [entry] = entries;

          setFooterVisible(
            entry.isIntersecting
          );
        },
        {
          threshold: 0.01,
          rootMargin:
            '0px 0px 70px 0px'
        }
      );

    observer.observe(footerElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  const mobileBottomLinkClass = ({
    isActive
  }) =>
    [
      'relative flex flex-col items-center',
      'justify-center gap-1 rounded-2xl',
      'px-2 py-1.5 text-[10px]',
      'font-semibold text-white',
      'transition duration-200',
      isActive
        ? 'bg-[var(--secondary-color)]'
        : 'hover:bg-white/10'
    ].join(' ');

  return (
    <div
      style={themeVariables}
      className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-white text-slate-900"
    >
      {/* Announcement */}
      {settings?.announcement && (
        <div className="relative overflow-hidden bg-[var(--primary-dark)] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-[var(--on-primary)]">
          <span className="relative z-10">
            {settings.announcement}
          </span>

          <span className="absolute -left-16 top-0 h-full w-24 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto grid min-h-[72px] w-full max-w-[1280px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 lg:min-h-[88px] lg:gap-5">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMenuOpen(true)
            }
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-800 transition hover:border-[var(--secondary-color)] hover:text-[var(--secondary-color)] lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Brand */}
          <Link
            to="/"
            aria-label="Go to home"
            className="flex min-w-0 items-center gap-3"
          >
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt={
                  settings?.storeName ||
                  'Sharuu Universal Store'
                }
                className="h-11 w-11 shrink-0 object-contain lg:h-12 lg:w-12"
              />
            ) : (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--primary-color)] font-serif text-xl font-bold text-[var(--on-primary)] shadow-lg lg:h-12 lg:w-12">
                S
              </span>
            )}

            <span className="min-w-0">
              <strong className="block truncate text-sm font-black tracking-tight text-slate-950 lg:text-base">
                {settings?.storeName ||
                  'Sharuu Universal Store'}
              </strong>

              {settings?.slogan && (
                <small className="hidden max-w-[190px] truncate text-[11px] text-slate-500 sm:block">
                  {settings.slogan}
                </small>
              )}
            </span>
          </Link>

        {/* Desktop Categories */}
<nav className="hidden min-w-0 flex-wrap items-center justify-center gap-1 lg:flex">
  {/* All Products */}
  <Link
    to="/shop"
    className={[
      'mr-1 inline-flex min-h-10',
      'shrink-0 items-center gap-2',
      'rounded-xl px-4 py-2',
      'text-xs font-black !text-white',
      'transition duration-200',
      location.pathname === '/shop' && !activeCategoryId
        ? 'bg-[var(--secondary-color)] shadow-md'
        : 'bg-[var(--primary-color)] hover:bg-[var(--secondary-color)]'
    ].join(' ')}
  >
    <Store
      size={16}
      className="shrink-0 !text-white"
    />

    <span className="!text-white">
      All Products
    </span>
  </Link>

  {/* Main Categories */}
  {topCategories.map(category => {
    const subcategories = getSubcategories(
      category.id
    );

    const categoryIsActive =
      String(activeCategoryId) ===
        String(category.id) ||
      subcategories.some(
        child =>
          String(child.id) ===
          String(activeCategoryId)
      );

    return (
      <div
        key={category.id}
        className="group relative"
      >
        {/* Category Link */}
        <Link
          to={`/shop?category=${category.id}`}
          className={[
            'relative flex min-h-10',
            'shrink-0 items-center',
            'gap-1.5 rounded-xl',
            'px-3 py-2 text-xs',
            'font-extrabold transition duration-200',
            categoryIsActive
              ? 'bg-[var(--secondary-soft)] text-[var(--secondary-color)]'
              : 'text-slate-600 hover:bg-[var(--secondary-soft)] hover:text-[var(--secondary-color)]'
          ].join(' ')}
        >
          <span>
            {category.name}
          </span>

          {subcategories.length > 0 && (
            <ChevronDown
              size={14}
              className="shrink-0 transition-transform duration-200 group-hover:rotate-180"
            />
          )}

          {/* Active underline */}
          <span
            className={[
              'absolute bottom-0',
              'left-3 right-3 h-0.5',
              'origin-center rounded-full',
              'bg-[var(--secondary-color)]',
              'transition-transform duration-200',
              categoryIsActive
                ? 'scale-x-100'
                : 'scale-x-0 group-hover:scale-x-100'
            ].join(' ')}
          />
        </Link>


                    {/* Category Dropdown */}
                    {subcategories.length >
                      0 && (
                      <div className="invisible absolute left-0 top-full z-[100] w-[260px] translate-y-3 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
                          <div className="relative overflow-hidden rounded-2xl bg-[var(--primary-color)] p-5 text-[var(--on-primary)]">
                            <h3 className="relative z-10 font-serif text-2xl font-bold">
                              {category.name}
                            </h3>

                            <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--secondary-color)] opacity-20" />
                          </div>

                          <Link
                            to={`/shop?category=${category.id}`}
                            className="mt-2 flex items-center justify-between border-b border-slate-100 px-3 py-3 text-xs font-black text-[var(--secondary-color)] transition hover:bg-[var(--secondary-soft)]"
                          >
                            <span>
                              View all{' '}
                              {category.name}
                            </span>

                            <ArrowRight
                              size={16}
                            />
                          </Link>

                          <div className="mt-1 max-h-80 space-y-1 overflow-y-auto">
                            {subcategories.map(
                              child => {
                                const childIsActive =
                                  String(
                                    activeCategoryId
                                  ) ===
                                  String(
                                    child.id
                                  );

                                return (
                                  <Link
                                    key={
                                      child.id
                                    }
                                    to={`/shop?category=${child.id}`}
                                    className={[
                                      'flex items-center',
                                      'justify-between',
                                      'rounded-xl px-3',
                                      'py-3 text-sm',
                                      'font-bold transition',
                                      'duration-200',
                                      childIsActive
                                        ? 'bg-[var(--secondary-soft)] pl-4 text-[var(--secondary-color)]'
                                        : 'text-slate-600 hover:bg-slate-50 hover:pl-4 hover:text-[var(--secondary-color)]'
                                    ].join(
                                      ' '
                                    )}
                                  >
                                    <span>
                                      {
                                        child.name
                                      }
                                    </span>

                                    <ChevronRight
                                      size={15}
                                    />
                                  </Link>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/track-order"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-[var(--secondary-soft)] hover:text-[var(--secondary-color)] sm:flex"
            >
              <PackageSearch size={20} />

              <span className="hidden xl:inline">
                Track
              </span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-[var(--secondary-soft)] hover:text-[var(--secondary-color)]"
            >
              <ShoppingBag size={21} />

              <span className="hidden xl:inline">
                Cart
              </span>

              {count > 0 && (
                <b className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--secondary-color)] px-1 text-[10px] font-black text-[var(--on-secondary)] shadow">
                  {count}
                </b>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={[
          'fixed inset-0 z-[100] lg:hidden',
          menuOpen
            ? 'pointer-events-auto'
            : 'pointer-events-none'
        ].join(' ')}
      >
        <button
          type="button"
          onClick={closeMobileMenu}
          aria-label="Close menu"
          className={[
            'absolute inset-0',
            'bg-slate-950/60',
            'backdrop-blur-sm',
            'transition-opacity duration-300',
            menuOpen
              ? 'opacity-100'
              : 'opacity-0'
          ].join(' ')}
        />

        <aside
          className={[
            'absolute inset-y-0 left-0',
            'flex w-[min(90vw,390px)]',
            'flex-col bg-white shadow-2xl',
            'transition-transform duration-300',
            menuOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          ].join(' ')}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex min-w-0 items-center gap-3"
            >
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={
                    settings?.storeName ||
                    'Store'
                  }
                  className="h-11 w-11 shrink-0 object-contain"
                />
              ) : (
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--primary-color)] font-serif text-xl font-bold text-[var(--on-primary)]">
                  S
                </span>
              )}

              <span className="min-w-0">
                <strong className="block truncate text-sm font-black text-slate-950">
                  {settings?.storeName ||
                    'Sharuu Universal Store'}
                </strong>

                {settings?.slogan && (
                  <small className="block truncate text-[11px] text-slate-500">
                    {settings.slogan}
                  </small>
                )}
              </span>
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-red-50 hover:text-red-600"
            >
              <X size={21} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Main Links */}
            <div className="space-y-1">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={({
                  isActive
                }) =>
                  [
                    'flex items-center gap-3',
                    'rounded-xl px-3 py-3',
                    'text-sm font-extrabold',
                    'transition',
                    isActive
                      ? 'bg-[var(--secondary-soft)] text-[var(--secondary-color)]'
                      : 'text-slate-700 hover:bg-slate-100'
                  ].join(' ')
                }
              >
                <Home size={18} />
                Home
              </NavLink>

              <Link
                to="/shop"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-[var(--secondary-soft)] hover:text-[var(--secondary-color)]"
              >
                <Store size={18} />
                All Products
              </Link>
            </div>

            <div className="mb-2 mt-7 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--secondary-color)]">
              Shop by category
            </div>

            {/* Mobile Categories */}
            <div className="divide-y divide-slate-100">
              {topCategories.map(
                category => {
                  const subcategories =
                    getSubcategories(
                      category.id
                    );

                  const isOpen =
                    String(
                      openMobileCategory
                    ) ===
                    String(category.id);

                  return (
                    <div key={category.id}>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/shop?category=${category.id}`}
                          onClick={
                            closeMobileMenu
                          }
                          className="flex-1 py-3.5 text-sm font-extrabold text-slate-800 transition hover:text-[var(--secondary-color)]"
                        >
                          {category.name}
                        </Link>

                        {subcategories.length >
                          0 && (
                          <button
                            type="button"
                            onClick={() =>
                              toggleMobileCategory(
                                category.id
                              )
                            }
                            aria-label={`Toggle ${category.name} subcategories`}
                            aria-expanded={
                              isOpen
                            }
                            className={[
                              'grid h-10 w-10',
                              'place-items-center',
                              'rounded-xl',
                              'transition',
                              isOpen
                                ? 'bg-[var(--secondary-soft)] text-[var(--secondary-color)]'
                                : 'bg-slate-100 text-slate-500'
                            ].join(' ')}
                          >
                            <ChevronDown
                              size={18}
                              className={[
                                'transition-transform',
                                'duration-200',
                                isOpen
                                  ? 'rotate-180'
                                  : ''
                              ].join(
                                ' '
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {subcategories.length >
                        0 && (
                        <div
                          className={[
                            'grid overflow-hidden',
                            'transition-all',
                            'duration-300',
                            'ease-in-out',
                            isOpen
                              ? 'grid-rows-[1fr] pb-3 opacity-100'
                              : 'grid-rows-[0fr] opacity-0'
                          ].join(' ')}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div className="ml-3 space-y-1 border-l-2 border-[var(--secondary-border)] pl-3">
                              <Link
                                to={`/shop?category=${category.id}`}
                                onClick={
                                  closeMobileMenu
                                }
                                className="block rounded-lg px-3 py-2.5 text-xs font-extrabold text-[var(--secondary-color)] transition hover:bg-[var(--secondary-soft)]"
                              >
                                View all{' '}
                                {category.name}
                              </Link>

                              {subcategories.map(
                                child => (
                                  <Link
                                    key={
                                      child.id
                                    }
                                    to={`/shop?category=${child.id}`}
                                    onClick={
                                      closeMobileMenu
                                    }
                                    className="block rounded-lg px-3 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-[var(--secondary-color)]"
                                  >
                                    {
                                      child.name
                                    }
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            {/* Mobile Social */}
            <div className="mt-7">
              <p className="mb-3 text-xs font-extrabold text-slate-700">
                Follow us
              </p>

              <div className="flex gap-2">
                {socials.facebook && (
                  <a
                    href={
                      socials.facebook
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--on-secondary)]"
                  >
                    <Facebook size={19} />
                  </a>
                )}

                {socials.instagram && (
                  <a
                    href={
                      socials.instagram
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--on-secondary)]"
                  >
                    <Instagram size={19} />
                  </a>
                )}

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--on-secondary)]"
                  >
                    <MessageCircle
                      size={19}
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="relative mt-0 shrink-0 overflow-hidden bg-[var(--primary-dark)] text-slate-300"
      >
        <span className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full border border-white/5" />

        <span className="pointer-events-none absolute -bottom-52 left-1/4 h-96 w-96 rounded-full bg-[var(--secondary-color)] opacity-[0.04]" />

        <div className="relative mx-auto w-full max-w-[1180px] px-4">
          {/* Mobile: two sections per row */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 py-12 sm:gap-x-8 sm:py-14 lg:grid-cols-[1.5fr_.8fr_.9fr_1.15fr] lg:gap-12 lg:py-16">
            {/* Brand */}
            <div className="min-w-0">
              <Link
                to="/"
                className="inline-flex max-w-full items-center gap-2 sm:gap-3"
              >
                {settings?.logo ? (
                  <img
                    src={settings.logo}
                    alt={
                      settings?.storeName ||
                      'Sharuu Universal Store'
                    }
                    className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
                  />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-color)] font-serif text-lg font-bold text-[var(--on-primary)] shadow-xl sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                    S
                  </span>
                )}

                <span className="min-w-0">
                  <strong className="block break-words text-sm font-black leading-5 text-white sm:text-base">
                    {settings?.storeName ||
                      'Sharuu Universal Store'}
                  </strong>

                  {settings?.slogan && (
                    <small className="mt-1 block break-words text-[10px] leading-4 text-slate-500 sm:text-[11px]">
                      {settings.slogan}
                    </small>
                  )}
                </span>
              </Link>

              <p className="mt-5 break-words text-xs leading-6 text-slate-400 sm:mt-6 sm:text-sm sm:leading-7">
                {settings?.footerDescription ||
                  settings?.description ||
                  'Discover carefully selected fashion, lifestyle and everyday products in one trusted destination.'}
              </p>

              <p className="mb-3 mt-5 text-[11px] font-extrabold text-white sm:mt-6 sm:text-xs">
                Follow our journey
              </p>

              <div className="flex flex-wrap gap-2">
                {socials.facebook && (
                  <a
                    href={
                      socials.facebook
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:-translate-y-1 hover:border-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--on-secondary)] sm:h-11 sm:w-11"
                  >
                    <Facebook size={17} />
                  </a>
                )}

                {socials.instagram && (
                  <a
                    href={
                      socials.instagram
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:-translate-y-1 hover:border-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--on-secondary)] sm:h-11 sm:w-11"
                  >
                    <Instagram size={17} />
                  </a>
                )}

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:-translate-y-1 hover:border-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--on-secondary)] sm:h-11 sm:w-11"
                  >
                    <MessageCircle
                      size={17}
                    />
                  </a>
                )}
              </div>
            </div>

            {/* Shop */}
            <div className="min-w-0">
              <FooterHeading>
                {settings
                  ?.footerColumns?.[0]
                  ?.title || 'Shop'}
              </FooterHeading>

              <FooterLink to="/shop">
                All Products
              </FooterLink>

              {topCategories
                .slice(0, 6)
                .map(item => (
                  <FooterLink
                    key={item.id}
                    to={`/shop?category=${item.id}`}
                  >
                    {item.name}
                  </FooterLink>
                ))}
            </div>

            {/* Information */}
            <div className="min-w-0">
              <FooterHeading>
                {settings
                  ?.footerColumns?.[1]
                  ?.title ||
                  'Information'}
              </FooterHeading>

              <FooterLink to="/track-order">
                Track Order
              </FooterLink>

              <FooterLink to="/cart">
                Shopping Cart
              </FooterLink>

              {publishedPages.map(page => (
                <FooterLink
                  key={page.id}
                  to={`/page/${page.slug}`}
                >
                  {page.title}
                </FooterLink>
              ))}
            </div>

            {/* Contact */}
            <div className="min-w-0">
              <FooterHeading>
                {settings
                  ?.footerContactTitle ||
                  'Contact'}
              </FooterHeading>

              <div className="space-y-4">
                {settings?.supportPhone && (
                  <a
                    href={`tel:${settings.supportPhone}`}
                    className="flex min-w-0 items-start gap-2 text-xs text-slate-300 transition hover:text-white sm:gap-3 sm:text-sm"
                  >
                    <FooterContactIcon>
                      <Phone size={16} />
                    </FooterContactIcon>

                    <span className="min-w-0">
                      <small className="mb-1 block text-[9px] font-black uppercase tracking-wider text-slate-600 sm:text-[10px]">
                        Phone support
                      </small>

                      <span className="break-all">
                        {
                          settings.supportPhone
                        }
                      </span>
                    </span>
                  </a>
                )}

                {settings?.supportEmail && (
                  <a
                    href={`mailto:${settings.supportEmail}`}
                    className="flex min-w-0 items-start gap-2 text-xs text-slate-300 transition hover:text-white sm:gap-3 sm:text-sm"
                  >
                    <FooterContactIcon>
                      <Mail size={16} />
                    </FooterContactIcon>

                    <span className="min-w-0">
                      <small className="mb-1 block text-[9px] font-black uppercase tracking-wider text-slate-600 sm:text-[10px]">
                        Email support
                      </small>

                      <span className="break-all">
                        {
                          settings.supportEmail
                        }
                      </span>
                    </span>
                  </a>
                )}

                {settings?.address && (
                  <div className="flex min-w-0 items-start gap-2 text-xs leading-5 text-slate-300 sm:gap-3 sm:text-sm sm:leading-6">
                    <FooterContactIcon>
                      <MapPin size={16} />
                    </FooterContactIcon>

                    <span className="min-w-0 break-words">
                      <small className="mb-1 block text-[9px] font-black uppercase tracking-wider text-slate-600 sm:text-[10px]">
                        Store address
                      </small>

                      {settings.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="grid grid-cols-2 items-center gap-3 border-t border-white/[0.08] py-5 text-[9px] leading-4 text-slate-500 sm:py-7 sm:text-xs">
  <span className="min-w-0 text-left">
    {settings?.footerText ||
      `© ${currentYear} ${
        settings?.storeName ||
        'Sharuu Universal Store'
      }. All rights reserved.`}
  </span>

  <span className="min-w-0 text-right">
    {settings?.footerBottomText ||
      'Secure shopping · Fast delivery · Easy support'}
  </span>
</div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav
        className={[
          'fixed bottom-2 left-2 right-2',
          'z-50 grid grid-cols-5',
          'rounded-3xl border',
          'border-white/10',
          'bg-[var(--primary-dark)]',
          'p-2 text-white shadow-2xl',
          'backdrop-blur-xl',
          'transition-all duration-300',
          'lg:hidden',
          footerVisible
            ? 'pointer-events-none translate-y-[140%] opacity-0'
            : 'translate-y-0 opacity-100'
        ].join(' ')}
      >
        <NavLink
          to="/"
          className={
            mobileBottomLinkClass
          }
        >
          <Home
            size={20}
            className="text-white"
          />

          <span className="text-white">
            Home
          </span>
        </NavLink>

        <NavLink
          to="/shop"
          className={
            mobileBottomLinkClass
          }
        >
          <Store
            size={20}
            className="text-white"
          />

          <span className="text-white">
            Shop
          </span>
        </NavLink>

        <button
          type="button"
          onClick={() =>
            setMenuOpen(true)
          }
          className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[10px] font-semibold text-white transition hover:bg-white/10"
        >
          <Menu
            size={20}
            className="text-white"
          />

          <span className="text-white">
            Menu
          </span>
        </button>

        <NavLink
          to="/track-order"
          className={
            mobileBottomLinkClass
          }
        >
          <PackageSearch
            size={20}
            className="text-white"
          />

          <span className="text-white">
            Track
          </span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `${mobileBottomLinkClass({
              isActive
            })} relative`
          }
        >
          <ShoppingBag
            size={20}
            className="text-white"
          />

          <span className="text-white">
            Cart
          </span>

          {count > 0 && (
            <b className="absolute right-2 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--secondary-color)] px-1 text-[9px] font-black text-[var(--on-secondary)]">
              {count}
            </b>
          )}
        </NavLink>
      </nav>
    </div>
  );
}

function FooterHeading({ children }) {
  return (
    <h4 className="relative mb-5 break-words pb-3 font-serif text-base font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-[var(--secondary-color)] sm:mb-6 sm:text-lg sm:after:w-9">
      {children}
    </h4>
  );
}

function FooterLink({
  to,
  children
}) {
  return (
    <Link
      to={to}
      className="group flex min-w-0 items-start gap-1 py-1.5 text-xs text-slate-400 transition hover:translate-x-1 hover:text-white sm:gap-1.5 sm:py-2 sm:text-sm"
    >
      <ChevronRight
        size={14}
        className="mt-0.5 shrink-0 text-[var(--secondary-color)]"
      />

      <span className="min-w-0 break-words">
        {children}
      </span>
    </Link>
  );
}

function FooterContactIcon({
  children
}) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[var(--secondary-color)] sm:h-10 sm:w-10 sm:rounded-xl">
      {children}
    </span>
  );
}

function getContrastColor(hexColor) {
  const fallback = '#ffffff';

  if (
    !hexColor ||
    typeof hexColor !== 'string'
  ) {
    return fallback;
  }

  let hex = hexColor
    .replace('#', '')
    .trim();

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(
        character =>
          character + character
      )
      .join('');
  }

  if (hex.length !== 6) {
    return fallback;
  }

  const red = parseInt(
    hex.substring(0, 2),
    16
  );

  const green = parseInt(
    hex.substring(2, 4),
    16
  );

  const blue = parseInt(
    hex.substring(4, 6),
    16
  );

  if (
    Number.isNaN(red) ||
    Number.isNaN(green) ||
    Number.isNaN(blue)
  ) {
    return fallback;
  }

  const brightness =
    (red * 299 +
      green * 587 +
      blue * 114) /
    1000;

  return brightness > 165
    ? '#0f172a'
    : '#ffffff';
}