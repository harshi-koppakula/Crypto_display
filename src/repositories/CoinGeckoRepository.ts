import axios from 'axios';
import { Coin, CoinDetails, TrendingCoin } from '../types/Coin';

// Use the environment variables with proper error handling
const API_BASE_URL = import.meta.env.VITE_COINGECKO_API_URL;
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

// Validate that environment variables are set
if (!API_BASE_URL) {
  console.error('VITE_COINGECKO_API_URL is not defined in environment variables');
}

const api = axios.create({
  baseURL: API_BASE_URL || 'https://api.coingecko.com/api/v3', // Fallback URL
  headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {},
});

// Add interceptors for better error handling
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.statusText);
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export class CoinGeckoRepository {
  static async getCoinsMarket(
    page: number = 1,
    perPage: number = 50,
    vsCurrency: string = 'usd'
  ): Promise<Coin[]> {
    try {
      const response = await api.get('/coins/markets', {
        params: {
          vs_currency: vsCurrency,
          order: 'market_cap_desc',
          per_page: perPage,
          page,
          price_change_percentage: '24h',
          sparkline: true, // ✅ also fetch sparkline here if you want list charts
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching coins:', error);
      throw new Error('Failed to fetch coins data');
    }
  }

  static async getCoinDetails(coinId: string): Promise<CoinDetails> {
    try {
      const response = await api.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true, // ✅ FIXED: enabled sparkline
        },
      });
      return response.data;
    } catch (error) {
      
      console.error('Error fetching coin details:', error);
      throw new Error('Failed to fetch coin details');
    }
  }

  static async getTrendingCoins(): Promise<TrendingCoin[]> {
    try {
      const response = await api.get('/search/trending');
      return response.data.coins;
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw new Error('Failed to fetch trending coins');
    }
  }
}
