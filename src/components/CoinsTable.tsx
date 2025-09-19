import { useState } from "react";
import { Table, Button, ButtonGroup } from "react-bootstrap";
import { Coin } from "../types/Coin";
import { CoinDetailsModal } from "./CoinDetailsModal";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";

interface CoinsTableProps {
  coins: Coin[];
  pageSize?: number;
}

type SortKey = "price" | "change24h" | "change7d" | "marketCap" | null;
type SortOrder = "asc" | "desc";

export const CoinsTable = ({ coins, pageSize = 25 }: CoinsTableProps) => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowClick = (coin: Coin) => {
    setSelectedCoin(coin);
    setShowModal(true);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  const formatNumber = (num?: number) => {
    if (!num && num !== 0) return "-";
    if (num > 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num > 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
    if (num > 1_000) return (num / 1_000).toFixed(2) + "K";
    return num.toString();
  };

  const generateSparkline = (coin: Coin) => {
    if (coin.sparkline_in_7d?.price) {
      return coin.sparkline_in_7d.price.map((p:number, i:number) => ({
        time: i,
        value: p,
      }));
    }
    return [];
  };

  // Sort coins based on selected column
  const sortedCoins = [...coins].sort((a, b) => {
    if (!sortKey) return 0;
    let aVal = 0;
    let bVal = 0;
    switch (sortKey) {
      case "price":
        aVal = a.current_price ?? 0;
        bVal = b.current_price ?? 0;
        break;
      case "change24h":
        aVal = a.price_change_percentage_24h ?? 0;
        bVal = b.price_change_percentage_24h ?? 0;
        break;
      case "change7d":
        aVal = a.price_change_percentage_7d_in_currency ?? 0;
        bVal = b.price_change_percentage_7d_in_currency ?? 0;
        break;
      case "marketCap":
        aVal = a.market_cap ?? 0;
        bVal = b.market_cap ?? 0;
        break;
    }
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  // Pagination
  const totalPages = Math.ceil(sortedCoins.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentCoins = sortedCoins.slice(startIndex, startIndex + pageSize);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePage = (page: number) => setCurrentPage(page);

  return (
    <>
      <div className="coins-table bg-white rounded-4 shadow-sm p-2">
        <Table hover responsive className="mb-0 align-middle">
          <thead className="table-success">
            <tr>
              <th>SI.No</th>
              <th style={{ width: "160px" }}>Coin</th>
              <th
                className="text-end"
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("price")}
              >
                Price{renderSortArrow("price")}
              </th>
              <th
                className="text-end"
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("change24h")}
              >
                24h{renderSortArrow("change24h")}
              </th>
              <th
                className="text-end"
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("change7d")}
              >
                7d{renderSortArrow("change7d")}
              </th>
              <th className="text-end">24h Volume</th>
              <th
                className="text-end"
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("marketCap")}
              >
                Market Cap{renderSortArrow("marketCap")}
              </th>
              <th className="text-center">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {currentCoins.map((coin, idx) => {
              const sevenDayChange = coin.price_change_percentage_7d_in_currency ?? 0;

              return (
                <tr
                  key={coin.id}
                  onClick={() => handleRowClick(coin)}
                  style={{ cursor: "pointer", transition: "all 0.2s ease-in-out" }}
                  className="table-row-hover"
                >
                  <td>{startIndex + idx + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={coin.image} alt={coin.name} style={{ width: 22, height: 22 }} />
                      <div>
                        <div className="fw-semibold">{coin.name}</div>
                        <div className="text-muted text-uppercase small">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-end fw-medium">${coin.current_price?.toLocaleString()}</td>
                  <td
                    className={`text-end fw-semibold ${
                      coin.price_change_percentage_24h >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td
                    className={`text-end fw-semibold ${sevenDayChange >= 0 ? "text-success" : "text-danger"}`}
                  >
                    {sevenDayChange.toFixed(2)}% {sevenDayChange >= 0 ? "📈" : "📉"}
                  </td>
                  <td className="text-end">${formatNumber(coin.total_volume)}</td>
                  <td className="text-end">${formatNumber(coin.market_cap)}</td>
                  <td style={{ width: 130 }}>
                    <ResponsiveContainer width="100%" height={45}>
                      <AreaChart data={generateSparkline(coin)}>
                        <defs>
                          <linearGradient id={`color-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ccc" }}
                          formatter={(value: number) => `$${value.toFixed(2)}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#16a34a"
                          strokeWidth={2}
                          fill={`url(#color-${coin.id})`}
                          dot={false}
                          isAnimationActive={true}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
        <Button variant="outline-success" onClick={handlePrev} disabled={currentPage === 1}>
          Prev
        </Button>
        <ButtonGroup>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={i + 1 === currentPage ? "success" : "outline-success"}
              onClick={() => handlePage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </ButtonGroup>
        <Button variant="outline-success" onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {/* Coin Details Modal with last 7 days graph */}
      <CoinDetailsModal coin={selectedCoin} show={showModal} onHide={() => setShowModal(false)} />

      <style>{`
        .table-row-hover:hover {
          background-color: #f0fdf4 !important;
          box-shadow: 0 2px 10px rgba(125, 218, 160, 0.25);
        }
      `}</style>
    </>
  );
};
