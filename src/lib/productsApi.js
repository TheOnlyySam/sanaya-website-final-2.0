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

export function formatProductPrice(price, currency) {
  if (price === null || price === undefined) return "Contact for price";
  try {
    return new Intl.NumberFormat("en", {
      style: currency ? "currency" : "decimal",
      currency: currency || undefined,
      maximumFractionDigits: currency === "IQD" ? 0 : 2,
    }).format(price);
  } catch {
    return `${Number(price).toLocaleString()} ${currency || ""}`.trim();
  }
}
