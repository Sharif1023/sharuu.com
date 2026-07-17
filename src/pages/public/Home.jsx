import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  RefreshCcw,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useStore } from "../../contexts/StoreContext";

const DEFAULT_PRIMARY_COLOR = "#0f172a";
const DEFAULT_SECONDARY_COLOR = "#d97706";

export default function Home() {
  const {
    settings,
    categories = [],
    publicProducts = [],
    loading,
  } = useStore();

  const primaryColor = getSafeColor(
    settings?.primaryColor,
    DEFAULT_PRIMARY_COLOR,
  );

  const secondaryColor = getSafeColor(
    settings?.secondaryColor,
    DEFAULT_SECONDARY_COLOR,
  );

  const themeStyle = {
    "--store-primary": primaryColor,
    "--store-secondary": secondaryColor,
    "--store-secondary-shadow": hexToRgba(secondaryColor, 0.3),
  };

  const roots = categories
    .filter((item) => !item.parentId && item.active)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const featured = publicProducts.filter((item) => item.featured).slice(0, 8);

  const modelImages = (settings?.newArrivalModels || []).filter(
    (item) => item.active !== false,
  );

  const brandingBanners = (settings?.brandingBanners || []).filter(
    (item) => item.active !== false,
  );

  if (loading && !settings) {
    return (
      <div
        style={themeStyle}
        className="grid min-h-[60vh] place-items-center bg-white"
      >
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <span
            className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200"
            style={{
              borderTopColor: secondaryColor,
            }}
          />
          Loading store...
        </div>
      </div>
    );
  }

  return (
    <main
      style={themeStyle}
      className="home-page-enter overflow-hidden bg-[#faf9f6] text-[var(--store-primary)]"
    >
      <style>{`
        @keyframes homePageEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .home-page-enter {
          animation: homePageEnter 600ms cubic-bezier(.22, 1, .36, 1) both;
        }

        .home-reveal {
          opacity: 0;
          transform: translateY(28px) scale(.992);
          filter: blur(3px);
          transition:
            opacity 650ms cubic-bezier(.22, 1, .36, 1),
            transform 650ms cubic-bezier(.22, 1, .36, 1),
            filter 650ms cubic-bezier(.22, 1, .36, 1);
          will-change: opacity, transform, filter;
        }

        .home-reveal.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }

        .home-theme-link {
          color: #1e293b;
          border-color: #cbd5e1;
        }

        .home-theme-link:hover {
          color: var(--store-secondary);
          border-color: var(--store-secondary);
        }

        .home-secondary-button {
          background: var(--store-secondary);
          box-shadow: 0 20px 45px var(--store-secondary-shadow);
        }

        .home-secondary-button:hover {
          filter: brightness(1.08);
        }

        .home-benefit-card:hover {
          border-color: #cbd5e1;
        }

        .home-benefit-icon {
          background: #f1f5f9;
          color: #0f172a;
        }

        .home-benefit-card:hover .home-benefit-icon {
          background: #0f172a;
          color: #ffffff;
        }

        .home-banner-button {
          color: #0f172a;
        }

        .home-banner-card:hover .home-banner-button {
          background: #0f172a;
          color: #ffffff;
        }

        @media (prefers-reduced-motion: reduce) {
          .home-page-enter,
          .home-reveal,
          .home-reveal.is-visible {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Hero */}
      <section
        className="relative isolate flex min-h-[580px] items-center overflow-hidden bg-slate-950 bg-cover bg-center text-white sm:min-h-[620px] lg:min-h-[680px]"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(2, 6, 23, 0.92) 0%,
              rgba(2, 6, 23, 0.74) 45%,
              rgba(2, 6, 23, 0.12) 100%
            ),
            url("${settings?.heroImage || ""}")
          `,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-tl-[160px] border-l border-t border-white/10 bg-white/[0.03]" />

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 sm:py-20 lg:px-6 lg:py-24">
          <div className="max-w-[760px]">
            <span className="inline-block border-l-2 border-[var(--store-secondary)] pl-4 text-[11px] font-black uppercase tracking-[0.28em] text-[var(--store-secondary)]">
              Universal Commerce
            </span>

            <h1 className="mt-6 max-w-[800px] font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl lg:text-[78px]">
              {settings?.heroTitle || "Discover your next favorite"}
            </h1>

            <p className="mt-6 max-w-[620px] text-base leading-8 text-slate-200 sm:text-lg">
              {settings?.heroSubtitle}
            </p>

            <Link
              to="/shop"
              className="home-secondary-button group mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-sm font-black text-white transition duration-300 hover:-translate-y-1"
            >
              {settings?.heroButtonText || "Shop Now"}

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      

      {/* Categories */}
      {roots.length > 0 && (
        <RevealSection className="mx-auto w-full max-w-[1180px] px-3 py-10 sm:px-6 sm:py-12 lg:px-6 lg:py-14">
          <SectionHeading
            eyebrow="Explore departments"
            title="Shop by Category"
            linkText="View all"
          />

          <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4 lg:gap-5">
            {roots.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className={[
                  "group relative isolate overflow-hidden",
                  "min-h-[155px] rounded-[16px] bg-slate-900",
                  "shadow-[0_12px_35px_rgba(15,23,42,0.12)]",
                  "transition duration-500 hover:-translate-y-1",
                  "sm:min-h-[240px] sm:rounded-[24px]",
                  "lg:min-h-[320px] lg:rounded-[30px]",
                ].join(" ")}
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className={[
                      "absolute inset-0 h-full w-full object-cover",
                      "transition duration-700 ease-out",
                      "group-hover:scale-[1.07]",
                    ].join(" ")}
                  />
                )}

                <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <span
                  className={[
                    "pointer-events-none absolute inset-2",
                    "rounded-[12px] border border-white/20",
                    "opacity-0 transition duration-300",
                    "group-hover:opacity-100",
                    "sm:inset-3 sm:rounded-[18px]",
                    "lg:rounded-[22px]",
                  ].join(" ")}
                />

                <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-5 lg:p-7">
                  <h3
                    className={[
                      "line-clamp-2 font-serif font-semibold",
                      "text-sm leading-tight text-white",
                      "sm:text-xl",
                      "lg:text-3xl",
                    ].join(" ")}
                  >
                    {category.name}
                  </h3>

                  {category.description && (
                    <p
                      className={[
                        "mt-1 hidden text-xs leading-5 text-slate-200",
                        "sm:line-clamp-2 sm:block",
                        "lg:mt-3 lg:text-sm lg:leading-6",
                      ].join(" ")}
                    >
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <RevealSection className="relative overflow-hidden bg-[#f1eee7] py-12 sm:py-14 lg:py-16">
          <div className="pointer-events-none absolute -right-44 -top-44 h-[420px] w-[420px] rounded-full border border-slate-900/5" />

          <div className="relative mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-6">
            <SectionHeading
              eyebrow="Selected for you"
              title="Featured Products"
              linkText="Shop all"
            />

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="min-w-0 transition duration-300 hover:-translate-y-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {/* Branding Banners */}
      {brandingBanners.length > 0 && (
        <RevealSection className="mx-auto grid w-full max-w-[1180px] gap-4 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-2 lg:px-6 lg:py-16">
          {brandingBanners.map((banner, index) => (
            <Link
              key={banner.id || index}
              to={banner.link || "/shop"}
              className={[
                "home-banner-card group relative isolate flex min-h-[410px] items-end overflow-hidden rounded-[30px]",
                "bg-slate-950 bg-cover bg-center shadow-[0_24px_65px_rgba(15,23,42,0.15)]",
                "transition duration-500 hover:-translate-y-2",
                index === 0 && brandingBanners.length > 1
                  ? "lg:min-h-[500px]"
                  : "lg:min-h-[450px]",
              ].join(" ")}
              style={{
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(2, 6, 23, 0.86),
                    rgba(2, 6, 23, 0.1)
                  ),
                  url("${banner.image}")
                `,
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <span className="pointer-events-none absolute inset-3 rounded-[22px] border border-white/20" />

              <div className="relative z-10 max-w-xl p-7 sm:p-9">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/75">
                  Exclusive edit
                </span>

                <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.02] text-white sm:text-5xl">
                  {banner.title}
                </h2>

                {banner.subtitle && (
                  <p className="mt-4 max-w-lg text-sm leading-7 text-slate-200">
                    {banner.subtitle}
                  </p>
                )}

                <span className="home-banner-button mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black transition duration-300">
                  {banner.buttonText || "Explore"}

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </RevealSection>
      )}

      {/* New Arrivals */}
      {modelImages.length > 0 && (
        <RevealSection className="mx-auto w-full max-w-[1180px] px-5 py-12 sm:px-8 sm:py-14 lg:px-6 lg:py-16">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--store-secondary)]">
              Campaign gallery
            </span>

            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--store-primary)] sm:text-5xl">
              New Arrivals
            </h2>

            <p className="max-w-2xl text-sm leading-7 text-slate-500">
              Fresh model looks selected for this season.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12 lg:auto-rows-[235px]">
            {modelImages.map((item, index) => {
              const layoutClass =
                index === 0
                  ? "col-span-2 lg:col-span-7 lg:row-span-2"
                  : index === 1
                    ? "lg:col-span-5"
                    : index === 2
                      ? "lg:col-span-5"
                      : "lg:col-span-4";

              return (
                <article
                  key={item.id || index}
                  className={[
                    "group relative isolate min-h-[285px] overflow-hidden rounded-[26px] bg-slate-950",
                    "shadow-[0_20px_55px_rgba(15,23,42,0.14)]",
                    "transition duration-500 hover:-translate-y-1",
                    layoutClass,
                  ].join(" ")}
                >
                  <img
                    src={item.image}
                    alt={
                      item.alt || item.title || `New arrival model ${index + 1}`
                    }
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.07]"
                  />

                  <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                  <span className="pointer-events-none absolute inset-3 rounded-[18px] border border-white/15" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/75 sm:text-[10px]">
                      {item.kicker || "New season"}
                    </span>

                    <h3
                      className={[
                        "mt-2 font-serif font-semibold text-white",
                        index === 0
                          ? "text-3xl sm:text-4xl"
                          : "text-xl sm:text-2xl",
                      ].join(" ")}
                    >
                      {item.title || "Fresh Arrival"}
                    </h3>

                    {item.subtitle && (
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </RevealSection>
      )}
    </main>
  );
}

function RevealSection({ children, className = "", delay = 0, style }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={["home-reveal", visible ? "is-visible" : "", className].join(
        " ",
      )}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </section>
  );
}

function BenefitItem({ icon, title, description }) {
  return (
    <div className="home-benefit-card group relative flex min-h-[104px] items-center gap-4 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 sm:p-5">
      <span className="home-benefit-icon relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition duration-300 sm:h-12 sm:w-12">
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

      <span className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-slate-100" />
    </div>
  );
}

function SectionHeading({ eyebrow, title, linkText }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--store-secondary)]">
          {eyebrow}
        </span>

        <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-[-0.035em] text-[var(--store-primary)] sm:text-5xl">
          {title}
        </h2>
      </div>

      <Link
        to="/shop"
        className="home-theme-link group inline-flex w-max items-center gap-2 border-b pb-1 text-sm font-black transition"
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

function getSafeColor(value, fallback) {
  const color = String(value || "").trim();

  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    return `#${color
      .slice(1)
      .split("")
      .map((character) => character + character)
      .join("")}`;
  }

  return fallback;
}

function hexToRgba(hex, alpha = 1) {
  const normalized = getSafeColor(hex, DEFAULT_SECONDARY_COLOR).replace(
    "#",
    "",
  );

  const number = Number.parseInt(normalized, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}