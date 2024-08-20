export async function getCryptoQuotes(symbols: string[], currency: string = 'usd'): Promise<Record<string, number>> {
  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price';
    const params = new URLSearchParams({
      ids: symbols.join(','),
      vs_currencies: currency,
    });

    const response = await fetch(`${url}?${params}`);
    const raw_quotes = await response.json();

    return symbols.reduce((acc, symbol) => {
      const price = parseFloat(raw_quotes[symbol]?.[currency] || '0').toFixed(2);
      acc[symbol] = parseFloat(price);
      return acc;
    }, {} as Record<string, number>);
  } catch {
    return {};
  }
}
