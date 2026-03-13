/** Categories cache — sessionStorage for instant menu bar display on refresh/navigation */

const CACHE_KEY = "kitchenart-categories";
const CACHE_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

function processCategories(rawData) {
  if (!Array.isArray(rawData)) return [];
  const cats = rawData.map((cat) => ({
    ...cat,
    subcategories: Array.isArray(cat.subcategories)
      ? [...cat.subcategories].sort((a, b) =>
          a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())
        )
      : [],
  }));
  cats.sort((a, b) =>
    a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())
  );
  return cats;
}

export function getCachedCategories() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_MAX_AGE_MS) return null;
    return processCategories(data);
  } catch {
    return null;
  }
}

export function setCachedCategories(data) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: Array.isArray(data) ? data : [], timestamp: Date.now() })
    );
  } catch {
    // ignore
  }
}

export { processCategories };
