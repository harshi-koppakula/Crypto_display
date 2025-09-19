import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";

import { CoinsTable } from "./components/CoinsTable";
import { HighlightsSection } from "./components/HighlightsSection";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [coins, setCoins] = useState<any[]>([]);
  const [trendingCoins, setTrendingCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const perPage = 250;
        const pages = 2; // 250 * 2 = 500 coins
        let allCoins: any[] = [];

        for (let page = 1; page <= pages; page++) {
          const { data } = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets",
            {
              params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: perPage,
                page,
                sparkline: true,
                price_change_percentage: "24h,7d",
              },
            }
          );
          allCoins = [...allCoins, ...data];
        }

        setCoins(allCoins);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch coin data.");
        setLoading(false);
      }
    };

    const fetchTrending = async () => {
      try {
        const { data } = await axios.get(
          "https://api.coingecko.com/api/v3/search/trending"
        );
        setTrendingCoins(data.coins);
      } catch (err) {
        console.error("Error fetching trending coins", err);
      }
    };

    fetchCoins();
    fetchTrending();
  }, []);

  return (
    <Container className="py-4">
      {/* Heading */}
      <div className="text-left mb-4">
        <h1 className="display-4 fw-bold text-gradient">
          🚀 Cryptocurrency by Market Cap
        </h1>
        <p className="text-muted fst-italic">
          Track top 500 crypto coins, live prices, trends & charts
        </p>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Highlights */}
      <HighlightsSection trendingCoins={trendingCoins} coins={coins} />

      {/* Coins Table */}
      <div className="mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <CoinsTable coins={coins} pageSize={25} />
        )}
      </div>

      <style>{`
        .text-gradient {
          background: linear-gradient(90deg, #16a34a, #4ade80, #86efac);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </Container>
  );
}

export default App;