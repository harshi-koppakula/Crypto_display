import { Modal, Spinner, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Coin } from "../types/Coin";
import { CoinGeckoRepository } from "../repositories/CoinGeckoRepository";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface CoinDetailsModalProps {
  coin: Coin | null;
  show: boolean;
  onHide: () => void;
}

export const CoinDetailsModal = ({ coin, show, onHide }: CoinDetailsModalProps) => {
  const [coinDetails, setCoinDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // when modal closes, clear details to avoid rendering stale null accesses
    if (!show) {
      setCoinDetails(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (coin && show) {
      const fetchCoinDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const details = await CoinGeckoRepository.getCoinDetails(coin.id);
          setCoinDetails(details);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch details");
        } finally {
          setLoading(false);
        }
      };

      fetchCoinDetails();
    }
  }, [coin, show]);

  const formatNumber = (num?: number | null) => {
    if (typeof num !== "number" || !isFinite(num)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Build sparkline data (handle both possible shapes)
  const sparklineArray: number[] =
    coinDetails?.market_data?.sparkline_7d?.price ||
    coinDetails?.sparkline_in_7d?.price ||
    [];

  const sparklineData =
    sparklineArray && sparklineArray.length
      ? sparklineArray.map((val: number, idx: number) => ({ idx: idx + 1, value: val }))
      : [];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {coin && (
            <>
              <img src={coin.image} alt={coin.name} width="28" height="28" className="me-2" />
              {coin.name} ({coin.symbol.toUpperCase()})
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Only render when we have coinDetails and not loading */}
        {coinDetails && !loading && (
          <>
            <div className="row">
              {/* Left: stats */}
              <div className="col-md-5">
                <p>
                  <strong>Rank:</strong> {coinDetails.market_cap_rank ?? "N/A"}
                </p>

                <p>
                  <strong>Current Price:</strong>{" "}
                  {coinDetails.market_data?.current_price?.usd
                    ? `$${formatNumber(coinDetails.market_data.current_price.usd)}`
                    : "N/A"}
                </p>

                <p>
                  <strong>24h Change:</strong>{" "}
                  <span
                    className={
                      (coinDetails.market_data?.price_change_percentage_24h ?? 0) >= 0
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {typeof coinDetails.market_data?.price_change_percentage_24h === "number"
                      ? `${coinDetails.market_data.price_change_percentage_24h.toFixed(2)}%`
                      : "N/A"}
                  </span>
                </p>

                <p>
                  <strong>Market Cap:</strong>{" "}
                  {coinDetails.market_data?.market_cap?.usd
                    ? `$${formatNumber(coinDetails.market_data.market_cap.usd)}`
                    : "N/A"}
                </p>

                <p>
                  <strong>24h Volume:</strong>{" "}
                  {coinDetails.market_data?.total_volume?.usd
                    ? `$${formatNumber(coinDetails.market_data.total_volume.usd)}`
                    : "N/A"}
                </p>

                <p>
                  <strong>Total Supply:</strong>{" "}
                  {coinDetails.market_data?.total_supply
                    ? formatNumber(coinDetails.market_data.total_supply)
                    : "N/A"}
                </p>
              </div>

              {/* Right: chart (give more space) */}
              <div className="col-md-7 d-flex align-items-center" style={{ minHeight: 200 }}>
                {sparklineData.length > 0 ? (
                  <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#20c997" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#20c997" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                        <Tooltip
                          formatter={(value: number) =>
                            typeof value === "number" ? `$${formatNumber(value)}` : value
                          }
                          labelFormatter={(label) => `Point ${label}`}
                          contentStyle={{
                            background: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: 6,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#20c997"
                          strokeWidth={2}
                          fill="url(#sparklineGradient)"
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-muted">No sparkline data available.</div>
                )}
              </div>
            </div>

            {/* Description below (full width) */}
            {coinDetails.description?.en && (
              <div className="mt-4">
                <h5>Description</h5>
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      coinDetails.description.en.split(". ").slice(0, 2).join(". ") + ".",
                  }}
                />
              </div>
            )}



          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
