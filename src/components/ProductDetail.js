import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowUpRightFromSquare, FaCartShopping, FaCircleCheck } from "react-icons/fa6";
import { formatProductPrice, getProduct, productSummary } from "../lib/productsApi";

const ProductDetail = () => {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    getProduct(productSlug)
      .then((item) => { if (active) setProduct(item); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [productSlug]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eaf5ff_0%,#f8fbff_36%,#ffffff_100%)] pb-24 pt-28">
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700">
            <FaArrowLeft /> Back to products
          </Link>

          {isLoading && <div className="mt-8 h-[34rem] animate-pulse rounded-[2.5rem] bg-slate-200/70" />}

          {!isLoading && (error || !product) && (
            <div className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-10 text-center">
              <p className="font-display text-3xl font-bold text-slate-950">Product unavailable</p>
              <p className="mt-3 text-slate-600">{error || "This product could not be found."}</p>
            </div>
          )}

          {!isLoading && product && (
            <div className="mt-8 grid overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.10)] lg:grid-cols-2">
              <div className="flex min-h-[25rem] items-center justify-center bg-slate-50 p-8 sm:p-14">
                <img src={product.imageUrl} alt={product.name} className="max-h-[34rem] w-full object-contain" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
                {product.categories?.length > 0 && (
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">{product.categories.join(" · ")}</p>
                )}
                <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">{product.name}</h1>
                <p className="mt-5 text-2xl font-bold text-slate-950">{formatProductPrice(product.price, product.currency)}</p>
                <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
                  {productSummary(product.description, 3000) || "Full specifications and purchase options are available in our Odoo store."}
                </p>

                <div className="mt-7 flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm leading-6 text-slate-700">
                  <FaCircleCheck className="mt-1 shrink-0 text-teal-600" />
                  Pricing, variants, availability, and checkout are managed securely through our official Odoo store.
                </div>

                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4 font-semibold text-white shadow-[0_18px_40px_rgba(14,165,233,0.28)] transition hover:scale-[1.01]"
                >
                  <FaCartShopping /> View purchase options <FaArrowUpRightFromSquare className="text-sm" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
