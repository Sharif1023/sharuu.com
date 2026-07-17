import {
  ChevronDown,
  Search
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useState
} from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../contexts/StoreContext';

export default function Shop() {
  const {
    publicProducts = [],
    categories = []
  } = useStore();

  const [params, setParams] = useSearchParams();

  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'featured';

  const [search, setSearch] = useState(query);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  const selectedCategory = useMemo(
    () =>
      categories.find(
        item =>
          String(item.id) === String(category)
      ),
    [categories, category]
  );

  /*
   * Main category select থাকলে main category এবং
   * তার সব subcategory-এর products দেখাবে।
   *
   * Subcategory select থাকলে শুধু ওই
   * subcategory-এর products দেখাবে।
   */
  const categoryIds = useMemo(() => {
    if (!category || !selectedCategory) {
      return [];
    }

    if (selectedCategory.parentId) {
      return [String(selectedCategory.id)];
    }

    return [
      String(selectedCategory.id),

      ...categories
        .filter(
          item =>
            item.active &&
            String(item.parentId) ===
              String(selectedCategory.id)
        )
        .map(item => String(item.id))
    ];
  }, [
    category,
    selectedCategory,
    categories
  ]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    let result = publicProducts.filter(
      product => {
        const searchableText = `
          ${product.name || ''}
          ${product.productCode || ''}
          ${product.brand || ''}
          ${product.description || ''}
        `.toLowerCase();

        const matchesSearch =
          searchableText.includes(
            normalizedSearch
          );

        const matchesCategory =
          !category ||
          categoryIds.includes(
            String(product.categoryId)
          ) ||
          categoryIds.includes(
            String(product.subcategoryId)
          );

        return (
          matchesSearch && matchesCategory
        );
      }
    );

    if (sort === 'price-low') {
      result = [...result].sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === 'price-high') {
      result = [...result].sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === 'newest') {
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [
    publicProducts,
    search,
    category,
    categoryIds,
    sort
  ]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setParams(next);
  };

  const handleSearch = event => {
    const value = event.target.value;

    setSearch(value);
    updateParam('q', value.trim());
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] pb-20 text-slate-950">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14">
        {/* Search and Sort */}
        <section className="grid gap-3 rounded-[26px] border border-slate-200 bg-white p-3 shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:p-4 md:grid-cols-[minmax(0,1fr)_220px]">
          {/* Search Bar */}
          <label className="group flex min-h-14 items-center gap-3 rounded-2xl bg-slate-100 px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/30">
            <Search
              size={19}
              className="shrink-0 text-slate-400 transition group-focus-within:text-amber-600"
            />

            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search product, SKU or brand..."
              className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          {/* Sort Dropdown */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
            <select
              value={sort}
              onChange={event =>
                updateParam(
                  'sort',
                  event.target.value
                )
              }
              className="h-14 w-full appearance-none border-0 bg-transparent px-4 pr-11 text-sm font-bold text-slate-700 outline-none"
            >
              <option value="featured">
                Featured
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="price-low">
                Price low to high
              </option>

              <option value="price-high">
                Price high to low
              </option>
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </section>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <section className="grid grid-cols-2 gap-3 py-8 sm:gap-5 sm:py-10 lg:grid-cols-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="min-w-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </section>
        ) : (
          <section className="mt-8 grid min-h-[380px] place-items-center rounded-[30px] border border-dashed border-slate-300 bg-white px-6 text-center">
            <div>
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
                <Search size={25} />
              </span>

              <h2 className="mt-5 font-serif text-3xl font-semibold text-slate-950">
                No products found
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Try another search or category.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}