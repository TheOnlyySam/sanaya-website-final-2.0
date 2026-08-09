import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBoxOpen, FaMagnifyingGlass } from "react-icons/fa6";
import { formatProductPrice, getProducts, productSummary } from "../lib/productsApi";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProducts()
      .then((items) => { if (active) setProducts(items); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.flatMap((product) => product.categories || []))],
    [products]
  );
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.categories?.includes(category);
      const matchesSearch = !query || `${product.name} ${productSummary(product.description, 500)}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, products, search]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eaf5ff_0%,#f8fbff_30%,#ffffff_100%)] pb-24 pt-28">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-4xl">
            <p className="section-kicker">Technology catalog</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-none tracking-tight text-slate-950 sm:text-7xl">
              Products built for dependable systems.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Explore our current product range. Availability, pricing, and product information are synchronized with Sanaya's Odoo catalog.
            </p>
          </div>

          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-6">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-teal-400">
              <FaMagnifyingGlass className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
              />
            </label>
            {categories.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                      category === item ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-teal-400"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoading && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[28rem] animate-pulse rounded-[2rem] bg-slate-200/70" />)}
            </div>
          )}

          {!isLoading && error && (
            <div className="mt-10 rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-center">
              <p className="font-display text-2xl font-bold text-slate-950">Catalog connection needed</p>
              <p className="mt-3 text-slate-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-10 text-center">
              <FaBoxOpen className="mx-auto text-4xl text-teal-500" />
              <p className="mt-4 font-display text-2xl font-bold text-slate-950">No matching products</p>
              <p className="mt-2 text-slate-600">Try another search or category.</p>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-white p-5">
                    <img src={product.imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="border-t border-slate-100 p-6">
                    {product.categories?.[0] && <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{product.categories[0]}</p>}
                    <h2 className="mt-2 font-display text-2xl font-bold text-slate-950">{product.name}</h2>
                    <p className="mt-3 min-h-[3rem] text-sm leading-6 text-slate-600">{productSummary(product.description) || "View specifications and purchasing options."}</p>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <span className="font-semibold text-slate-950">{formatProductPrice(product.price, product.currency)}</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-teal-600"><FaArrowRight /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductCatalog;
