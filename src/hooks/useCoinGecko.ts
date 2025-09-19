import { useState, useEffect, useMemo } from 'react';
import { Coin, TrendingCoin } from '../types/Coin';
import { CoinGeckoRepository } from '../repositories/CoinGeckoRepository';
import { useDebounce } from './useDebounce';

export const useCoinGecko = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Coin;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coinsData, trendingData] = await Promise.all([
          CoinGeckoRepository.getCoinsMarket(page),
          CoinGeckoRepository.getTrendingCoins(),
        ]);
        setCoins(coinsData);
        setTrendingCoins(trendingData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const filteredAndSortedCoins = useMemo(() => {
    let filtered = coins;
    
    // Filter by search term
    if (debouncedSearchTerm) {
      filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Sort data
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [coins, debouncedSearchTerm, sortConfig]);

  const requestSort = (key: keyof Coin) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return {
    coins: filteredAndSortedCoins,
    trendingCoins,
    loading,
    error,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    requestSort,
    sortConfig,
  };
};