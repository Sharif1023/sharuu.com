import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  RefreshCcw,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../contexts/StoreContext';

export default function Home() {
  const {
    settings,
    categories = [],
    publicProducts = [],
    loading
  } = useStore();

  const roots = categories
    .filter(item => !item.parentId && item.active)
    .sort(
      (a, b) =>
        (a.sortOrder || 0) - (b.sortOrder || 0)
    );

  const featured = publicProducts
    .filter(item => item.featured)
    .slice(0, 8);

  const modelImages = (
    settings?.newArrivalModels || []
  ).filter(item => item.active !== false);

  const brandingBanners = (
    settings?.brandingBanners || []
  ).filter(item => item.active !== false);

  if (loading && !settings) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-white">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-600" />
          Loading store...
        </div>
      </div>
    );
  }

  return (
    <main className="overflow-hidden bg-[#faf9f6] text-slate-950">
      {/* Hero */}
      <section
        className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-slate-950 bg-cover bg-center text-white sm:min-h-[700px] lg:min-h-[760px]"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(2, 6, 23, 0.94) 0%,
              rgba(2, 6, 23, 0.82) 45%,
              rgba(2, 6, 23, 0.18) 100%
            ),
            url("${settings?.heroImage || ''}")
          `
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />

        <div className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-tl-[160px] border-l border-t border-white/10 bg-white/[0.03]" />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8 lg:px-6">
          <div className="max-w-[760px]">
            <span className="inline-block border-l-2 border-amber-500 pl-4 text-[11px] font-black uppercase tracking-[0.28em] text-amber-400">
              Universal Commerce
            </span>

            <h1 className="mt-7 max-w-[800px] font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl lg:text-[82px]">
              {settings?.heroTitle}
            </h1>

            <p className="mt-7 max-w-[620px] text-base leading-8 text-slate-300 sm:text-lg">
              {settings?.heroSubtitle}
            </p>

            <Link
              to="/shop"
              className="group mt-9 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-amber-600 px-7 text-sm font-black text-white shadow-[0_20px_45px_rgba(217,119,6,0.28)] transition duration-300 hover:-translate-y-1 hover:bg-amber-500"
            >
              {settings?.heroButtonText || 'Shop Now'}

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-20 mx-auto -mt-10 grid w-[calc(100%-24px)] max-w-[1180px] gap-3 sm:grid-cols-2 lg:-mt-12 lg:grid-cols-4 lg:gap-4">
        <BenefitItem
          icon={<Truck size={23} />}
          title="Fast Delivery"
          description="Editable shipping zones"
        />

        <BenefitItem
          icon={<BadgeCheck size={23} />}
          title="Quality Products"
          description="Carefully selected items"
        />

        <BenefitItem
          icon={<RefreshCcw size={23} />}
          title="Easy Returns"
          description="Product-specific policies"
        />

        <BenefitItem
          icon={<Headphones size={23} />}
          title="Support"
          description={settings?.supportPhone}
        />
      </section>

      {/* Categories */}
{roots.length > 0 && (
  <section className="mx-auto w-full max-w-[1180px] px-3 py-14 sm:px-6 sm:py-20 lg:px-6 lg:py-24">
    <SectionHeading
      eyebrow="Explore departments"
      title="Shop by Category"
      linkText="View all"
    />

    <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-4 lg:gap-5">
      {roots.map(category => (
        <Link
          key={category.id}
          to={`/shop?category=${category.id}`}
          className={[
            'group relative isolate overflow-hidden',
            'min-h-[155px] rounded-[16px] bg-slate-900',
            'shadow-[0_12px_35px_rgba(15,23,42,0.12)]',
            'sm:min-h-[240px] sm:rounded-[24px]',
            'lg:min-h-[320px] lg:rounded-[30px]'
          ].join(' ')}
        >
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className={[
                'absolute inset-0 h-full w-full object-cover',
                'transition duration-700 ease-out',
                'group-hover:scale-[1.07]'
              ].join(' ')}
            />
          )}

          {/* Dark overlay */}
          <span className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Hover border */}
          <span
            className={[
              'pointer-events-none absolute inset-2',
              'rounded-[12px] border border-white/20',
              'opacity-0 transition duration-300',
              'group-hover:opacity-100',
              'sm:inset-3 sm:rounded-[18px]',
              'lg:rounded-[22px]'
            ].join(' ')}
          />

          {/* Category information */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-5 lg:p-7">
            <h3
              className={[
                'line-clamp-2 font-serif font-semibold',
                'text-sm leading-tight text-white',
                'sm:text-xl',
                'lg:text-3xl'
              ].join(' ')}
            >
              {category.name}
            </h3>

            {category.description && (
              <p
                className={[
                  'mt-1 hidden text-xs leading-5 text-slate-300',
                  'sm:line-clamp-2 sm:block',
                  'lg:mt-3 lg:text-sm lg:leading-6'
                ].join(' ')}
              >
                {category.description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  </section>
)}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="relative overflow-hidden bg-[#f1eee7] py-20 sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute -right-44 -top-44 h-[420px] w-[420px] rounded-full border border-slate-900/5" />

          <div className="relative mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-6">
            <SectionHeading
              eyebrow="Selected for you"
              title="Featured Products"
              linkText="Shop all"
            />

            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {featured.map(product => (
                <div
                  key={product.id}
                  className="min-w-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Branding Banners */}
      {brandingBanners.length > 0 && (
        <section className="mx-auto grid w-full max-w-[1180px] gap-5 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:px-6 lg:py-28">
          {brandingBanners.map((banner, index) => (
            <Link
              key={banner.id || index}
              to={banner.link || '/shop'}
              className={[
                'group relative isolate flex min-h-[440px] items-end overflow-hidden rounded-[32px]',
                'bg-slate-950 bg-cover bg-center shadow-[0_28px_75px_rgba(15,23,42,0.16)]',
                'transition duration-500 hover:-translate-y-2',
                index === 0 && brandingBanners.length > 1
                  ? 'lg:min-h-[540px]'
                  : 'lg:min-h-[480px]'
              ].join(' ')}
              style={{
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(2, 6, 23, 0.88),
                    rgba(2, 6, 23, 0.12)
                  ),
                  url("${banner.image}")
                `
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <span className="pointer-events-none absolute inset-3 rounded-[24px] border border-white/20" />

              <div className="relative z-10 max-w-xl p-8 sm:p-10">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-400">
                  Exclusive edit
                </span>

                <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.02] text-white sm:text-5xl">
                  {banner.title}
                </h2>

                {banner.subtitle && (
                  <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                    {banner.subtitle}
                  </p>
                )}

                <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black text-slate-950 transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                  {banner.buttonText || 'Explore'}

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* New Arrivals */}
      {modelImages.length > 0 && (
        <section className="mx-auto w-full max-w-[1180px] px-5 pb-20 sm:px-8 sm:pb-24 lg:px-6 lg:pb-28">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-600">
              Campaign gallery
            </span>

            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-5xl">
              New Arrivals
            </h2>

            <p className="max-w-2xl text-sm leading-7 text-slate-500">
              Fresh model looks selected for this season.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12 lg:auto-rows-[250px]">
            {modelImages.map((item, index) => {
              const layoutClass =
                index === 0
                  ? 'col-span-2 lg:col-span-7 lg:row-span-2'
                  : index === 1
                    ? 'lg:col-span-5'
                    : index === 2
                      ? 'lg:col-span-5'
                      : 'lg:col-span-4';

              return (
                <article
                  key={item.id || index}
                  className={[
                    'group relative isolate min-h-[300px] overflow-hidden rounded-[28px] bg-slate-950',
                    'shadow-[0_22px_60px_rgba(15,23,42,0.14)]',
                    layoutClass
                  ].join(' ')}
                >
                  <img
                    src={item.image}
                    alt={
                      item.alt ||
                      item.title ||
                      `New arrival model ${index + 1}`
                    }
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.07]"
                  />

                  <span className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

                  <span className="pointer-events-none absolute inset-3 rounded-[20px] border border-white/15" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400 sm:text-[10px]">
                      {item.kicker || 'New season'}
                    </span>

                    <h3
                      className={[
                        'mt-2 font-serif font-semibold text-white',
                        index === 0
                          ? 'text-3xl sm:text-4xl'
                          : 'text-xl sm:text-2xl'
                      ].join(' ')}
                    >
                      {item.title || 'Fresh Arrival'}
                    </h3>

                    {item.subtitle && (
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

function BenefitItem({
  icon,
  title,
  description
}) {
  return (
    <div className="group relative flex min-h-[112px] items-center gap-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 hover:border-amber-200">
      <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f7f2e8] text-amber-700 transition duration-300 group-hover:bg-amber-600 group-hover:text-white">
        {icon}
      </span>

      <span className="relative z-10 min-w-0">
        <strong className="block text-sm font-black text-slate-950">
          {title}
        </strong>

        <small className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </small>
      </span>

      <span className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-amber-500/[0.06]" />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  linkText
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-600">
          {eyebrow}
        </span>

        <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-5xl">
          {title}
        </h2>
      </div>

      <Link
        to="/shop"
        className="group inline-flex w-max items-center gap-2 border-b border-slate-300 pb-1 text-sm font-black text-slate-800 transition hover:border-amber-600 hover:text-amber-600"
      >
        {linkText}

        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}