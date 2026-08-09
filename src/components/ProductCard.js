import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCircleCheck } from "react-icons/fa6";
import { formatProductPrice, productSummary } from "../lib/productsApi";

const ProductCard = ({ product, view = "grid", language = "en" }) => {
  const isList = view === "list";
  const copy = language === "ar"
    ? { synced: "متزامن مع Odoo", details: "عرض التفاصيل", fallback: "استعرض المواصفات وخيارات الشراء." }
    : { synced: "Synced with Odoo", details: "View details", fallback: "Explore specifications and purchasing options." };

  return (
    <Link
      to={`/products/${product.slug}`}
      className={`group relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_24px_65px_rgba(15,23,42,0.12)] ${
        isList ? "grid sm:grid-cols-[15rem_1fr]" : "flex h-full flex-col"
      }`}
    >
      <div className={`relative overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#f3f8fb_72%)] ${isList ? "min-h-56" : "aspect-[4/3]"}`}>
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 shadow-sm backdrop-blur">
          <FaCircleCheck className="text-teal-500" /> {copy.synced}
        </div>
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            if (!event.currentTarget.src.endsWith("/logo2.png")) event.currentTarget.src = "/logo2.png";
          }}
          className="h-full w-full object-contain p-7 transition duration-500 group-hover:scale-[1.06]"
        />
      </div>

      <div className="flex flex-1 flex-col border-t border-slate-100 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {(product.categories || []).slice(0, 2).map((category) => (
            <span key={category} className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-teal-700">
              {category}
            </span>
          ))}
        </div>
        <h2 className="mt-3 font-display text-xl font-bold leading-snug text-slate-950 transition group-hover:text-teal-700 sm:text-2xl">
          {product.name}
        </h2>
        <p className={`mt-3 text-sm leading-6 text-slate-600 ${isList ? "max-w-2xl" : "min-h-[3rem]"}`}>
          {productSummary(product.description, isList ? 240 : 125) || copy.fallback}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            <p className="text-lg font-bold text-slate-950">{formatProductPrice(product.price, product.currency, language)}</p>
            <p className="mt-1 text-[11px] font-medium text-slate-400">{copy.details}</p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition duration-300 group-hover:rotate-[-8deg] group-hover:bg-teal-600">
            <FaArrowRight className={language === "ar" ? "rotate-180" : ""} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
