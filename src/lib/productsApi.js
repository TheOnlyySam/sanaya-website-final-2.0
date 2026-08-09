const apiUrl = "/api";

async function request(path) {
  const response = await fetch(`${apiUrl}${path}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Unable to load products right now.");
  }

  return payload;
}

export async function getProducts() {
  const payload = await request("/products");
  return payload.products || [];
}

export async function getProduct(identifier) {
  const payload = await request(`/products?identifier=${encodeURIComponent(identifier)}`);
  return payload.product;
}

export function productSummary(html, maxLength = 150) {
  if (!html) return "";
  const documentNode = new DOMParser().parseFromString(String(html), "text/html");
  const text = (documentNode.body.textContent || "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export function productDescriptionParts(html) {
  if (!html) return { intro: "", points: [] };
  const documentNode = new DOMParser().parseFromString(String(html), "text/html");
  const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const points = [...documentNode.querySelectorAll("li")]
    .map((item) => normalize(item.textContent))
    .filter(Boolean);
  const introCandidates = [...documentNode.querySelectorAll("p, div")]
    .filter((item) => !item.querySelector("p, div, ul, ol"))
    .map((item) => normalize(item.textContent))
    .filter((item) => item && !points.includes(item));
  const uniqueIntro = [...new Set(introCandidates)].join("\n\n");
  return { intro: uniqueIntro || productSummary(html, 3000), points: [...new Set(points)] };
}

export function formatProductPrice(price, currency, locale = "en") {
  if (price === null || price === undefined || Number(price) <= 0) {
    return locale === "ar" ? "السعر عند الطلب" : "Price on request";
  }
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-IQ" : "en-IQ", {
      style: currency ? "currency" : "decimal",
      currency: currency || undefined,
      maximumFractionDigits: currency === "IQD" ? 0 : 2,
    }).format(price);
  } catch {
    return `${Number(price).toLocaleString()} ${currency || ""}`.trim();
  }
}
