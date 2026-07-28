const SYMBOL_TO_CODE = {
  $: "USD",
  "€": "EUR",
  "£": "GBP",
  "¥": "JPY",
  "₹": "INR",
  "₩": "KRW",
  "₽": "RUB",
  "₿": "BTC",
  "₪": "ILS",
  "₫": "VND",
  "₱": "PHP",
  "₴": "UAH",
  "₦": "NGN",
  "₲": "PYG",
  "₵": "GHS",
  "₸": "KZT",
  "₺": "TRY",
  "₼": "AZN",
  "₾": "GEL",
  "₨": "PKR",
  R: "ZAR",
  "C$": "CAD",
  "A$": "AUD",
  "S$": "SGD",
  "HK$": "HKD",
  "NT$": "TWD",
  "NZ$": "NZD",
};

const ISO_COUNTRY_MAP = {
  IND: "INR",
  USA: "USD",
  EUR: "EUR",
  GBR: "GBP",
  JPN: "JPY",
};

const VALID_CURRENCY_RE = /^[A-Z]{3}$/;

export function normalizeCurrency(currency) {
  if (!currency) return "INR";
  const trimmed = currency.trim();
  if (VALID_CURRENCY_RE.test(trimmed)) return trimmed.toUpperCase();
  if (SYMBOL_TO_CODE[trimmed]) return SYMBOL_TO_CODE[trimmed];
  if (ISO_COUNTRY_MAP[trimmed.toUpperCase()]) return ISO_COUNTRY_MAP[trimmed.toUpperCase()];
  return "INR";
}

export function formatPrice(price, currency) {
  const code = normalizeCurrency(currency);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
    }).format(price);
  } catch {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  }
}
