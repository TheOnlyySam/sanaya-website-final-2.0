import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowTrendUp,
  FaBoxOpen,
  FaBoxesStacked,
  FaCheck,
  FaFilter,
  FaGrip,
  FaList,
  FaMagnifyingGlass,
  FaRotateLeft,
  FaSliders,
  FaXmark,
} from "react-icons/fa6";
import ProductCard from "./ProductCard";
import { getProducts, productSummary } from "../lib/productsApi";

const PAGE_SIZE = 18;

const copyByLanguage = {
  en: {
    kicker: "Sanaya technology catalog",
    title: "The right technology, all in one place.",
    intro: "Browse a live catalog of security, infrastructure, fire safety, networking, power, and enterprise technology—synchronized directly with Odoo.",
    live: "Live Odoo catalog",
    products: "Products",
    categories: "Categories",
    source: "One trusted source",
    sourceText: "Current catalog data",
    explore: "Explore popular categories",
    search: "Search by product, model, feature, or category…",
    filters: "Filters",
    refine: "Refine results",
    category: "Category",
    categorySearch: "Find a category",
    showMore: "Show all categories",
    showLess: "Show fewer",
    price: "Price range",
    clear: "Clear all",
    results: "results",
    showing: "Showing",
    sort: "Sort by",
    featured: "Featured",
    priceLow: "Price: low to high",
    priceHigh: "Price: high to low",
    name: "Name: A–Z",
    noTitle: "No products match those filters",
    noText: "Try removing a category, widening the price range, or using a shorter search.",
    reset: "Reset filters",
    connection: "Catalog connection needed",
    previous: "Previous",
    next: "Next",
    all: "All prices",
    quote: "Price on request",
    under50: "Under 50,000 IQD",
    from50: "50,000–100,000 IQD",
    from100: "100,000–250,000 IQD",
    from250: "250,000–500,000 IQD",
    from500: "500,000–1M IQD",
    over1m: "1M+ IQD",
  },
  ar: {
    kicker: "كتالوج السنايا التقني",
    title: "التقنية المناسبة، كلها في مكان واحد.",
    intro: "استعرض كتالوجاً مباشراً لأنظمة الأمن والبنية التحتية والسلامة والشبكات والطاقة، متزامناً مباشرة مع Odoo.",
    live: "كتالوج Odoo مباشر",
    products: "منتج",
    categories: "فئة",
    source: "مصدر موثوق واحد",
    sourceText: "بيانات محدثة",
    explore: "استكشف الفئات الشائعة",
    search: "ابحث باسم المنتج أو الموديل أو الميزة أو الفئة…",
    filters: "التصفية",
    refine: "تخصيص النتائج",
    category: "الفئة",
    categorySearch: "ابحث عن فئة",
    showMore: "عرض جميع الفئات",
    showLess: "عرض أقل",
    price: "نطاق السعر",
    clear: "مسح الكل",
    results: "نتيجة",
    showing: "عرض",
    sort: "الترتيب",
    featured: "المميزة",
    priceLow: "السعر: من الأقل",
    priceHigh: "السعر: من الأعلى",
    name: "الاسم أبجدياً",
    noTitle: "لا توجد منتجات مطابقة",
    noText: "جرّب إزالة فئة أو توسيع نطاق السعر أو استخدام بحث أقصر.",
    reset: "إعادة ضبط التصفية",
    connection: "تعذر الاتصال بالكتالوج",
    previous: "السابق",
    next: "التالي",
    all: "كل الأسعار",
    quote: "السعر عند الطلب",
    under50: "أقل من 50,000 د.ع",
    from50: "50,000–100,000 د.ع",
    from100: "100,000–250,000 د.ع",
    from250: "250,000–500,000 د.ع",
    from500: "500,000–1 مليون د.ع",
    over1m: "أكثر من مليون د.ع",
  },
};

function matchesPrice(product, range) {
  const price = Number(product.price || 0);
  if (range === "quote") return price <= 0;
  if (range === "under-50") return price > 0 && price < 50000;
  if (range === "50-100") return price >= 50000 && price < 100000;
  if (range === "100-250") return price >= 100000 && price < 250000;
  if (range === "250-500") return price >= 250000 && price < 500000;
  if (range === "500-1000") return price >= 500000 && price < 1000000;
  if (range === "over-1000") return price >= 1000000;
  return true;
}

const ProductCatalog = () => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "ar" ? "ar" : "en";
  const copy = copyByLanguage[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const query = searchParams.get("q") || "";
  const selectedCategories = searchParams.getAll("category");
  const priceRange = searchParams.get("price") || "all";
  const sort = searchParams.get("sort") || "featured";
  const view = searchParams.get("view") === "list" ? "list" : "grid";
  const page = Math.max(1, Number(searchParams.get("page") || 1));

  const updateParams = (updates, replace = true) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      next.delete(key);
      const values = Array.isArray(value) ? value : [value];
      values.filter((item) => item !== "" && item !== null && item !== undefined).forEach((item) => next.append(key, item));
    });
    if (!Object.prototype.hasOwnProperty.call(updates, "page")) next.delete("page");
    setSearchParams(next, { replace });
  };

  useEffect(() => {
    let active = true;
    getProducts()
      .then((items) => { if (active) setProducts(items); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!mobileFiltersOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobileFiltersOpen]);

  const categoryCounts = useMemo(() => {
    const counts = new Map();
    products.forEach((product) => (product.categories || []).forEach((category) => counts.set(category, (counts.get(category) || 0) + 1)));
    return counts;
  }, [products]);
  const categories = useMemo(
    () => [...categoryCounts.keys()].sort((a, b) => (categoryCounts.get(b) - categoryCounts.get(a)) || a.localeCompare(b)),
    [categoryCounts]
  );
  const visibleCategories = useMemo(() => {
    const filtered = categories.filter((category) => category.toLowerCase().includes(categorySearch.trim().toLowerCase()));
    return showAllCategories || categorySearch ? filtered : filtered.slice(0, 10);
  }, [categories, categorySearch, showAllCategories]);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const searchable = `${product.name} ${(product.categories || []).join(" ")} ${productSummary(product.description, 1200)}`.toLowerCase();
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.some((category) => product.categories?.includes(category));
      return (!needle || searchable.includes(needle)) && categoryMatch && matchesPrice(product, priceRange);
    });
    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return (a.price > 0 ? a.price : Number.MAX_SAFE_INTEGER) - (b.price > 0 ? b.price : Number.MAX_SAFE_INTEGER);
      if (sort === "price-desc") return (b.price || 0) - (a.price || 0);
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [priceRange, products, query, selectedCategories, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paginatedProducts = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeFilterCount = selectedCategories.length + (priceRange !== "all" ? 1 : 0);
  const priceOptions = [
    ["all", copy.all], ["quote", copy.quote], ["under-50", copy.under50], ["50-100", copy.from50],
    ["100-250", copy.from100], ["250-500", copy.from250], ["500-1000", copy.from500], ["over-1000", copy.over1m],
  ];

  const toggleCategory = (category) => {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];
    updateParams({ category: next });
  };
  const clearFilters = () => {
    const next = new URLSearchParams();
    if (view === "list") next.set("view", "list");
    setSearchParams(next, { replace: true });
    setCategorySearch("");
  };

  const filterPanel = (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{copy.filters}</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-950">{copy.refine}</h2>
        </div>
        {activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="text-xs font-bold text-teal-700 hover:text-teal-900">{copy.clear}</button>}
      </div>

      <div className="border-t border-slate-200 pt-6">
        <p className="text-sm font-bold text-slate-950">{copy.category}</p>
        <label className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-teal-400">
          <FaMagnifyingGlass className="text-xs text-slate-400" />
          <input value={categorySearch} onChange={(event) => setCategorySearch(event.target.value)} placeholder={copy.categorySearch} className="w-full bg-transparent text-xs outline-none" />
        </label>
        <div className="mt-3 space-y-1 max-lg:max-h-[18rem] max-lg:overflow-y-auto">
          {visibleCategories.map((category) => {
            const checked = selectedCategories.includes(category);
            return (
              <label key={category} className="group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-slate-50">
                <input type="checkbox" checked={checked} onChange={() => toggleCategory(category)} className="sr-only" />
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${checked ? "border-teal-500 bg-teal-500 text-white" : "border-slate-300 bg-white"}`}>
                  {checked && <FaCheck className="text-[9px]" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-slate-700 group-hover:text-slate-950">{category}</span>
                <span className="text-xs text-slate-400">{categoryCounts.get(category)}</span>
              </label>
            );
          })}
        </div>
        {!categorySearch && categories.length > 10 && (
          <button type="button" onClick={() => setShowAllCategories((value) => !value)} className="mt-3 text-xs font-bold text-teal-700">
            {showAllCategories ? copy.showLess : copy.showMore}
          </button>
        )}
      </div>

      <div className="border-t border-slate-200 pt-6">
        <p className="text-sm font-bold text-slate-950">{copy.price}</p>
        <div className="mt-3 space-y-1">
          {priceOptions.map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm hover:bg-slate-50">
              <input type="radio" name="price" checked={priceRange === value} onChange={() => updateParams({ price: value === "all" ? "" : value })} className="h-4 w-4 accent-teal-600" />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f5f8fb] pb-24 pt-24">
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-20 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-teal-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-1/4 h-[30rem] w-[30rem] rounded-full bg-blue-500/15 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-300" /> {copy.live}
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-slate-400">{copy.kicker}</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[5.4rem]">{copy.title}</h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{copy.intro}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <FaBoxesStacked className="text-2xl text-teal-300" />
              <p className="mt-5 font-display text-4xl font-bold">{products.length || "—"}</p>
              <p className="mt-1 text-sm text-slate-400">{copy.products}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <FaSliders className="text-2xl text-blue-300" />
              <p className="mt-5 font-display text-4xl font-bold">{categories.length || "—"}</p>
              <p className="mt-1 text-sm text-slate-400">{copy.categories}</p>
            </div>
            <div className="col-span-2 flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-300 text-slate-950"><FaArrowTrendUp /></span>
              <div><p className="font-bold">{copy.source}</p><p className="mt-1 text-sm text-slate-400">{copy.sourceText}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-white bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-5">
          <label className="flex items-center gap-4 rounded-[1.35rem] bg-slate-100 px-4 py-4 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-teal-400 sm:px-5">
            <FaMagnifyingGlass className="text-lg text-teal-600" />
            <input value={query} onChange={(event) => updateParams({ q: event.target.value })} placeholder={copy.search} className="w-full bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400" />
            {query && <button type="button" onClick={() => updateParams({ q: "" })} className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-950"><FaXmark /></button>}
          </label>
        </div>
      </section>

      {!isLoading && !error && categories.length > 0 && (
        <section className="px-4 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{copy.explore}</p>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.slice(0, 8).map((category) => {
                const active = selectedCategories.includes(category);
                return <button key={category} type="button" onClick={() => toggleCategory(category)} className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition ${active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-teal-400"}`}>{category} <span className="ms-1 opacity-50">{categoryCounts.get(category)}</span></button>;
              })}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {isLoading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1,2,3,4,5,6,7,8].map((item) => <div key={item} className="h-[27rem] animate-pulse rounded-[1.75rem] bg-slate-200" />)}</div>}
          {!isLoading && error && <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-10 text-center"><p className="font-display text-3xl font-bold text-slate-950">{copy.connection}</p><p className="mt-3 text-slate-600">{error}</p></div>}

          {!isLoading && !error && (
            <div className="grid gap-7 lg:grid-cols-[17rem_minmax(0,1fr)]">
              <aside className="hidden self-start rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] lg:sticky lg:top-28 lg:block">{filterPanel}</aside>
              <div className="min-w-0">
                <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setMobileFiltersOpen(true)} className="relative inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-800 lg:hidden"><FaFilter /> {copy.filters}{activeFilterCount > 0 && <span className="rounded-full bg-teal-500 px-1.5 py-0.5 text-[10px] text-white">{activeFilterCount}</span>}</button>
                    <p className="text-sm text-slate-500"><strong className="text-slate-950">{filteredProducts.length}</strong> {copy.results}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-500 sm:flex-none">
                      {copy.sort}
                      <select value={sort} onChange={(event) => updateParams({ sort: event.target.value === "featured" ? "" : event.target.value })} className="min-w-0 bg-transparent font-bold text-slate-900 outline-none">
                        <option value="featured">{copy.featured}</option><option value="price-asc">{copy.priceLow}</option><option value="price-desc">{copy.priceHigh}</option><option value="name">{copy.name}</option>
                      </select>
                    </label>
                    <div className="hidden rounded-xl border border-slate-200 p-1 sm:flex">
                      <button type="button" onClick={() => updateParams({ view: "" })} aria-label="Grid view" className={`rounded-lg p-2.5 ${view === "grid" ? "bg-slate-950 text-white" : "text-slate-400"}`}><FaGrip /></button>
                      <button type="button" onClick={() => updateParams({ view: "list" })} aria-label="List view" className={`rounded-lg p-2.5 ${view === "list" ? "bg-slate-950 text-white" : "text-slate-400"}`}><FaList /></button>
                    </div>
                  </div>
                </div>

                {(selectedCategories.length > 0 || priceRange !== "all" || query) && <div className="mt-4 flex flex-wrap gap-2">{selectedCategories.map((category) => <button key={category} type="button" onClick={() => toggleCategory(category)} className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">{category}<FaXmark /></button>)}{priceRange !== "all" && <button type="button" onClick={() => updateParams({ price: "" })} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800">{priceOptions.find(([value]) => value === priceRange)?.[1]}<FaXmark /></button>}<button type="button" onClick={clearFilters} className="px-2 text-xs font-bold text-slate-500 hover:text-slate-950">{copy.clear}</button></div>}

                {paginatedProducts.length === 0 ? (
                  <div className="mt-5 rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center"><FaBoxOpen className="mx-auto text-5xl text-teal-500" /><h2 className="mt-5 font-display text-3xl font-bold text-slate-950">{copy.noTitle}</h2><p className="mx-auto mt-3 max-w-lg text-slate-600">{copy.noText}</p><button type="button" onClick={clearFilters} className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"><FaRotateLeft /> {copy.reset}</button></div>
                ) : (
                  <div className={`mt-5 grid gap-5 ${view === "list" ? "grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-3"}`}>{paginatedProducts.map((product) => <ProductCard key={product.id} product={product} view={view} language={language} />)}</div>
                )}

                {pageCount > 1 && <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 sm:flex-row"><p className="text-sm text-slate-500">{copy.showing} {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredProducts.length)} / {filteredProducts.length}</p><div className="flex items-center gap-2"><button type="button" disabled={safePage === 1} onClick={() => updateParams({ page: safePage - 1 }, false)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold disabled:opacity-30"><FaArrowLeft className={language === "ar" ? "rotate-180" : ""} /> {copy.previous}</button><span className="min-w-16 text-center text-sm font-bold text-slate-700">{safePage} / {pageCount}</span><button type="button" disabled={safePage === pageCount} onClick={() => updateParams({ page: safePage + 1 }, false)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold disabled:opacity-30">{copy.next} <FaArrowRight className={language === "ar" ? "rotate-180" : ""} /></button></div></div>}
              </div>
            </div>
          )}
        </div>
      </section>

      {mobileFiltersOpen && <div className="fixed inset-0 z-[80] lg:hidden"><button type="button" className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" /><aside className={`absolute inset-y-0 w-[min(90vw,24rem)] overflow-y-auto bg-white p-6 shadow-2xl ${language === "ar" ? "left-0" : "right-0"}`}><button type="button" onClick={() => setMobileFiltersOpen(false)} className="absolute end-5 top-5 rounded-full bg-slate-100 p-3 text-slate-700"><FaXmark /></button><div className="mt-12">{filterPanel}</div><button type="button" onClick={() => setMobileFiltersOpen(false)} className="mt-8 w-full rounded-full bg-slate-950 px-5 py-3.5 text-sm font-bold text-white">{filteredProducts.length} {copy.results}</button></aside></div>}
    </main>
  );
};

export default ProductCatalog;
