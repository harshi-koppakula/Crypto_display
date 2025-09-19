export interface Coin {
  sparkline_in_7d: any;
  price_change_percentage_7d_in_currency: number;
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  total_volume: number;
}

export interface CoinDetails extends Coin {
  description: { en: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    price_change_percentage_24h: number;
    total_volume: { usd: number };
  };
}

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    price_btc: number;
  };
}