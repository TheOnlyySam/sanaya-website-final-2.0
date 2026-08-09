import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaCartShopping,
  FaCheck,
  FaCircleCheck,
  FaCopy,
  FaExpand,
  FaHeadset,
  FaLayerGroup,
  FaLock,
  FaShareNodes,
  FaShieldHalved,
  FaWhatsapp,
  FaXmark,
} from "react-icons/fa6";
import ProductCard from "./ProductCard";
import { formatProductPrice, getProduct, getProducts, productDescriptionParts } from "../lib/productsApi";

const copyByLanguage = {
  en: {
    catalog: "Product catalog",
    back: "Back to products",
    unavailable: "Product unavailable",
    missing: "This product could not be found.",
    official: "Official Sanaya catalog",
    basePrice: "Catalog price",
    priceNote: "Final variant pricing and availability are confirmed in Odoo.",
    buy: "View purchase options",
    whatsapp: "Ask on WhatsApp",
    share: "Share",
    copied: "Link copied",
    overview: "Product overview",
    highlights: "Key highlights",
    defaultDescription: "Full specifications and purchase options are available in our official Odoo store.",
    synced: "Odoo synchronized",
    syncedText: "Product data is maintained from one catalog source.",
    checkout: "Secure checkout",
    checkoutText: "Variants, cart, and payment continue safely in Odoo.",
    support: "Expert assistance",
    supportText: "Our team can help confirm fit before you order.",
    needHelp: "Need help selecting the right configuration?",
    needHelpText: "Send the product to our team and we’ll help with compatibility, quantity, and project requirements.",
    talk: "Talk to a specialist",
    related: "Related products",
    relatedTitle: "More from this category",
    relatedText: "Continue exploring products selected from the same part of the Sanaya catalog.",
    all: "View all products",
    image: "Open product image",
    close: "Close image",
  },
  ar: {
    catalog: "كتالوج المنتجات",
    back: "العودة إلى المنتجات",
    unavailable: "المنتج غير متاح",
    missing: "تعذر العثور على هذا المنتج.",
    official: "كتالوج السنايا الرسمي",
    basePrice: "سعر الكتالوج",
    priceNote: "يتم تأكيد سعر الخيارات والتوفر النهائي داخل Odoo.",
    buy: "عرض خيارات الشراء",
    whatsapp: "استفسر عبر واتساب",
    share: "مشاركة",
    copied: "تم نسخ الرابط",
    overview: "نظرة عامة على المنتج",
    highlights: "أهم المواصفات",
    defaultDescription: "تتوفر المواصفات الكاملة وخيارات الشراء في متجر Odoo الرسمي.",
    synced: "متزامن مع Odoo",
    syncedText: "تتم إدارة بيانات المنتج من مصدر كتالوج واحد.",
    checkout: "دفع آمن",
    checkoutText: "يتم اختيار الخيارات والسلة والدفع بأمان داخل Odoo.",
    support: "مساعدة متخصصة",
    supportText: "يمكن لفريقنا مساعدتك في التأكد من ملاءمة المنتج.",
    needHelp: "هل تحتاج مساعدة لاختيار الإعداد المناسب؟",
    needHelpText: "أرسل المنتج إلى فريقنا وسنساعدك في التوافق والكمية ومتطلبات المشروع.",
    talk: "تحدث مع مختص",
    related: "منتجات ذات صلة",
    relatedTitle: "المزيد من هذه الفئة",
    relatedText: "واصل استكشاف منتجات من نفس قسم كتالوج السنايا.",
    all: "عرض جميع المنتجات",
    image: "فتح صورة المنتج",
    close: "إغلاق الصورة",
  },
};

const ProductDetail = () => {
  const { productSlug } = useParams();
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "ar" ? "ar" : "en";
  const copy = copyByLanguage[language];
  const [product, setProduct] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError("");
    Promise.all([getProduct(productSlug), getProducts()])
      .then(([item, products]) => {
        if (!active) return;
        setProduct(item);
        setCatalog(products);
      })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [productSlug]);

  useEffect(() => {
    if (!product) return undefined;
    const previousTitle = document.title;
    document.title = `${product.name} | Sanaya`;
    return () => { document.title = previousTitle; };
  }, [product]);

  useEffect(() => {
    if (!imageOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => { if (event.key === "Escape") setImageOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [imageOpen]);

  const description = useMemo(() => productDescriptionParts(product?.description), [product]);
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const categorySet = new Set(product.categories || []);
    return catalog
      .filter((item) => item.id !== product.id && item.categories?.some((category) => categorySet.has(category)))
      .slice(0, 4);
  }, [catalog, product]);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsAppText = language === "ar"
    ? `مرحباً، أود الاستفسار عن ${product?.name || "هذا المنتج"}: ${currentUrl}`
    : `Hello, I would like to ask about ${product?.name || "this product"}: ${currentUrl}`;
  const whatsAppUrl = `https://wa.me/9647777995015?text=${encodeURIComponent(whatsAppText)}`;

  const shareProduct = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: currentUrl });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch (shareError) {
      if (shareError.name !== "AbortError") {
        await navigator.clipboard?.writeText(currentUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8fb] pb-24 pt-24">
      <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-hidden text-sm text-slate-500">
          <Link to="/products" className="shrink-0 font-semibold transition hover:text-teal-700">{copy.catalog}</Link>
          <span className="text-slate-300">/</span>
          <span className="truncate text-slate-700">{product?.categories?.[0] || product?.name || "…"}</span>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-400 hover:text-teal-700">
            <FaArrowLeft className={language === "ar" ? "rotate-180" : ""} /> {copy.back}
          </Link>

          {isLoading && (
            <div className="mt-7 grid gap-6 lg:grid-cols-2">
              <div className="h-[35rem] animate-pulse rounded-[2.25rem] bg-slate-200" />
              <div className="h-[35rem] animate-pulse rounded-[2.25rem] bg-slate-200" />
            </div>
          )}

          {!isLoading && (error || !product) && (
            <div className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-12 text-center">
              <FaLayerGroup className="mx-auto text-5xl text-amber-500" />
              <p className="mt-5 font-display text-3xl font-bold text-slate-950">{copy.unavailable}</p>
              <p className="mt-3 text-slate-600">{error || copy.missing}</p>
            </div>
          )}

          {!isLoading && product && (
            <>
              <div className="mt-7 grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
                <div className="lg:sticky lg:top-28">
                  <button
                    type="button"
                    onClick={() => setImageOpen(true)}
                    className="group relative flex min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-[2.25rem] border border-slate-200 bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#eef4f7_76%)] p-8 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:min-h-[36rem] sm:p-14"
                    aria-label={copy.image}
                  >
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                      <FaExpand className="text-teal-600" /> {copy.image}
                    </div>
                    <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-teal-300/20 blur-3xl" />
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      onError={(event) => { if (!event.currentTarget.src.endsWith("/logo2.png")) event.currentTarget.src = "/logo2.png"; }}
                      className="max-h-[30rem] w-full object-contain transition duration-500 group-hover:scale-[1.04]"
                    />
                  </button>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      [FaCircleCheck, copy.synced],
                      [FaLock, copy.checkout],
                      [FaHeadset, copy.support],
                    ].map(([Icon, label]) => (
                      <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 text-center text-[11px] font-bold text-slate-600"><Icon className="mx-auto mb-2 text-lg text-teal-600" />{label}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.07)] sm:p-9 lg:p-11">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">
                      <FaShieldHalved /> {copy.official}
                    </div>
                    <button type="button" onClick={shareProduct} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-teal-300 hover:text-teal-700">
                      {copied ? <FaCopy /> : <FaShareNodes />} {copied ? copy.copied : copy.share}
                    </button>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {(product.categories || []).map((category) => <Link key={category} to={`/products?category=${encodeURIComponent(category)}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-teal-300 hover:text-teal-700">{category}</Link>)}
                  </div>
                  <h1 className="mt-5 font-display text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">{product.name}</h1>

                  <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{copy.basePrice}</p>
                    <p className="mt-2 font-display text-3xl font-bold text-slate-950">{formatProductPrice(product.price, product.currency, language)}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{copy.priceNote}</p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-4 text-sm font-bold text-white shadow-[0_16px_35px_rgba(14,165,233,0.25)] transition hover:scale-[1.01]">
                      <FaCartShopping /> {copy.buy} <FaArrowUpRightFromSquare className="text-xs" />
                    </a>
                    <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-500 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-600">
                      <FaWhatsapp className="text-lg" /> {copy.whatsapp}
                    </a>
                  </div>

                  <div className="mt-9 border-t border-slate-200 pt-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{copy.overview}</p>
                    <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">{description.intro || copy.defaultDescription}</p>
                  </div>

                  {description.points.length > 0 && (
                    <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-6 text-white">
                      <p className="font-display text-xl font-bold">{copy.highlights}</p>
                      <ul className="mt-5 space-y-3">
                        {description.points.map((point) => <li key={point} className="flex items-start gap-3 text-sm leading-6 text-slate-300"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400 text-[9px] text-slate-950"><FaCheck /></span>{point}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-16 grid gap-4 md:grid-cols-3">
                {[
                  [FaCircleCheck, copy.synced, copy.syncedText],
                  [FaLock, copy.checkout, copy.checkoutText],
                  [FaHeadset, copy.support, copy.supportText],
                ].map(([Icon, title, text]) => (
                  <div key={title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700"><Icon /></span><h2 className="mt-5 font-display text-xl font-bold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>
                ))}
              </div>

              <div className="relative mt-16 overflow-hidden rounded-[2.25rem] bg-slate-950 p-7 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
                <div className="relative"><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">{copy.support}</p><h2 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-4xl">{copy.needHelp}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{copy.needHelpText}</p></div>
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="relative mt-6 inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-bold text-slate-950 lg:mt-0"><FaWhatsapp className="text-lg text-emerald-500" /> {copy.talk}</a>
              </div>

              {relatedProducts.length > 0 && (
                <section className="mt-20">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{copy.related}</p><h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{copy.relatedTitle}</h2><p className="mt-3 max-w-2xl text-slate-600">{copy.relatedText}</p></div>
                    <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-teal-700">{copy.all} <FaArrowRight className={language === "ar" ? "rotate-180" : ""} /></Link>
                  </div>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} language={language} />)}</div>
                </section>
              )}
            </>
          )}
        </div>
      </section>

      {imageOpen && product && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={copy.image}>
          <button type="button" onClick={() => setImageOpen(false)} className="absolute inset-0" aria-label={copy.close} />
          <button type="button" onClick={() => setImageOpen(false)} className="absolute end-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-950" aria-label={copy.close}><FaXmark /></button>
          <div className="relative flex max-h-[90vh] w-full max-w-5xl items-center justify-center rounded-[2rem] bg-white p-8 sm:p-14"><img src={product.imageUrl} alt={product.name} className="max-h-[75vh] w-full object-contain" /></div>
        </div>
      )}
    </main>
  );
};

export default ProductDetail;
