import { useState, useEffect } from "react";
import { Row, Col, Table, Modal, Card, Form, InputGroup } from "react-bootstrap";
import { FaFire, FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";
import { CoinsTable } from "./CoinsTable";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";



interface HighlightsSectionProps {
  trendingCoins: any[];
  coins: any[];
}

export const HighlightsSection = ({
  trendingCoins,
  coins,
}: HighlightsSectionProps) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<
    "all" | "highlights" | "categories"
  >("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Fetch categories
  useEffect(() => {
    if (activeView === "categories") {
      fetch("https://api.coingecko.com/api/v3/coins/categories")
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error("Failed to fetch categories:", err));
    }
  }, [activeView]);

  // Map trending with market data
  const trendingWithMarketData =
    trendingCoins?.map((tc) => {
      const match = coins.find((c) => c.id === tc.item.id);
      return {
        ...tc.item,
        ...match,
      };
    }) || [];

  const handleViewMore = (title: string, data: any[]) => {
    setModalTitle(title);
    setModalData(data);
    setShowModal(true);
  };

  // Search filter
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Dummy chart data
  const dummyMarketCapData = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: 4000 + Math.random() * 500,
  }));
  const dummyVolumeData = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: 160 + Math.random() * 40,
  }));

  // Sparkline component
  const Sparkline = ({ data, color, id }: any) => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.6} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
        <Tooltip
          formatter={(val: any) => `$${val.toFixed(2)}B`}
          contentStyle={{
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${id})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  return (
    <>
      {/* === Top Section (Market Stats + Previews) === */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <div className="d-flex flex-column h-100">
            <div className="flex-fill p-3 bg-white rounded-4 shadow-sm mb-3">
              <h4 className="text-primary mb-1">$4,100,825,920,482</h4>
              <h6 className="text-muted">Market Cap</h6>
              <div className="small text-primary fw-semibold">+1.2% (24h)</div>
            </div>

            <div className="flex-fill p-3 bg-white rounded-4 shadow-sm">
              <h4 className="text-warning mb-1">$169,738,442,965</h4>
              <h6 className="text-muted">24h Trading Volume</h6>
              <div className="small text-warning fw-semibold">+0.8% (24h)</div>
            </div>
          </div>
        </Col>

        <Col md={8}>
          <Row className="g-3 h-80">
            {/* Trending Preview */}
            <Col md={4}>
              <div className="p-3 bg-white rounded-4 shadow-sm h-80 d-flex flex-column">
                <h6 className="fw-semibold mb-2 d-flex align-items-center">
                  <FaFire className="text-danger me-2" /> Trending
                </h6>
                <Table size="sm" borderless responsive className="mb-2">
                  <tbody>
                    {trendingWithMarketData.slice(0, 3).map((coin, idx) => (
                      <tr key={coin.id || idx}>
                        <td className="fw-medium text-uppercase">{coin.symbol}</td>
                        <td
                          className={
                            coin.price_change_percentage_24h >= 0
                              ? "text-success fw-semibold"
                              : "text-danger fw-semibold"
                          }
                        >
                          {coin.price_change_percentage_24h?.toFixed(2) ?? "0"}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="mt-auto text-end">
                  <a
                    href="#"
                    className="small fw-semibold text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewMore("Trending Coins", trendingWithMarketData.slice(0, 25));
                    }}
                  >
                    View More &gt;
                  </a>
                </div>
              </div>
            </Col>

            {/* Top Gainers Preview */}
            <Col md={4}>
              <div className="p-3 bg-white rounded-4 shadow-sm h-80 d-flex flex-column">
                <h6 className="fw-semibold mb-2 d-flex align-items-center">
                  <FaArrowUp className="text-success me-2" /> Top Gainers
                </h6>
                <Table size="sm" borderless responsive className="mb-2">
                  <tbody>
                    {[...coins]
                      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                      .slice(0, 3)
                      .map((coin) => (
                        <tr key={coin.id}>
                          <td className="fw-medium text-uppercase">{coin.symbol}</td>
                          <td className="text-success fw-semibold">
                            +{coin.price_change_percentage_24h.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <div className="mt-auto text-end">
                  <a
                    href="#"
                    className="small fw-semibold text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewMore(
                        "Top Gainers (24h)",
                        [...coins]
                          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                          .slice(0, 25)
                      );
                    }}
                  >
                    View More &gt;
                  </a>
                </div>
              </div>
            </Col>

            {/* Top Losers Preview */}
            <Col md={4}>
              <div className="p-3 bg-white rounded-4 shadow-sm h-80 d-flex flex-column">
                <h6 className="fw-semibold mb-2 d-flex align-items-center">
                  <FaArrowDown className="text-danger me-2" /> Top Losers
                </h6>
                <Table size="sm" borderless responsive className="mb-2">
                  <tbody>
                    {[...coins]
                      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                      .slice(0, 3)
                      .map((coin) => (
                        <tr key={coin.id}>
                          <td className="fw-medium text-uppercase">{coin.symbol}</td>
                          <td className="text-danger fw-semibold">
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <div className="mt-auto text-end">
                  <a
                    href="#"
                    className="small fw-semibold text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewMore(
                        "Top Losers (24h)",
                        [...coins]
                          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                          .slice(0, 25)
                      );
                    }}
                  >
                    View More &gt;
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* === Toolbar (All / Highlights / Categories + Search) === */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
  <Row className="g-2">
    {/* All Card */}
    <Col xs={4}>
      <div
        className={`p-3 rounded-4 shadow-sm text-center cursor-pointer ${
          activeView === "all" ? "bg-primary text-white" : "bg-white text-dark"
        }`}
        style={{ border: "1px solid #e5e5e5" }}
        onClick={() => setActiveView("all")}
      >
        <h6 className="mb-0 fw-semibold">All</h6>
      </div>
    </Col>

    {/* Highlights Card */}
    <Col xs={4}>
      <div
        className={`p-3 rounded-4 shadow-sm text-center cursor-pointer ${
          activeView === "highlights"
            ? "bg-primary text-white"
            : "bg-white text-dark"
        }`}
        style={{ border: "1px solid #e5e5e5" }}
        onClick={() => setActiveView("highlights")}
      >
        <h6 className="mb-0 fw-semibold">Highlights</h6>
      </div>
    </Col>

    {/* Categories Card */}
    <Col xs={4}>
      <div
        className={`p-3 rounded-4 shadow-sm text-center cursor-pointer ${
          activeView === "categories"
            ? "bg-primary text-white"
            : "bg-white text-dark"
        }`}
        style={{ border: "1px solid #e5e5e5" }}
        onClick={() => setActiveView("categories")}
      >
        <h6 className="mb-0 fw-semibold">Categories</h6>
      </div>
    </Col>
  </Row>
</Col>


        <Col md={6} className="text-end">
  <InputGroup className="w-75 ms-auto">
    <Form.Control
      type="text"
      placeholder="Search coins..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="rounded-pill shadow-sm"
    />
    <InputGroup.Text className="bg-white border-0">
      <FaSearch className="text-muted" />
    </InputGroup.Text>
  </InputGroup>
</Col>
      </Row>

      {/* === All View (Existing Table) === */}
    

{activeView === "all" && (
  <div className="mt-3">
    </div>
)}

  
      {/* === Highlights View (3 Big Cards with 20 rows) === */}
      {activeView === "highlights" && (
        <Row className="g-3 mb-4">
          {/* Trending */}
          <Col md={4}>
            <Card className="shadow-sm rounded-4 h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-semibold d-flex align-items-center mb-0">
                    <FaFire className="text-danger me-2" /> Trending
                  </h6>
                  <a
                    href="#"
                    className="small fw-semibold text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewMore("Trending Coins", trendingWithMarketData.slice(0, 50));
                    }}
                  >
                    View More &gt;
                  </a>
                </div>
                <Table size="sm" borderless responsive className="mb-0">
                  <tbody>
                    {trendingWithMarketData.slice(0, 20).map((coin, idx) => (
                      <tr key={coin.id || idx}>
                        <td className="fw-medium text-uppercase">{coin.symbol}</td>
                        <td
                          className={
                            coin.price_change_percentage_24h >= 0
                              ? "text-success fw-semibold"
                              : "text-danger fw-semibold"
                          }
                        >
                          {coin.price_change_percentage_24h?.toFixed(2) ?? "0"}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Top Gainers */}
          <Col md={4}>
            <Card className="shadow-sm rounded-4 h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-semibold d-flex align-items-center mb-0">
                    <FaArrowUp className="text-success me-2" /> Top Gainers
                  </h6>
                  <a
                    href="#"
                    className="small fw-semibold text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewMore(
                        "Top Gainers (24h)",
                        [...coins]
                          .sort(
                            (a, b) =>
                              b.price_change_percentage_24h - a.price_change_percentage_24h
                          )
                          .slice(0, 50)
                      );
                    }}
                  >
                    View More &gt;
                  </a>
                </div>
                <Table size="sm" borderless responsive className="mb-0">
                  <tbody>
                    {[...coins]
                      .sort(
                        (a, b) =>
                          b.price_change_percentage_24h - a.price_change_percentage_24h
                      )
                      .slice(0, 20)
                      .map((coin) => (
                        <tr key={coin.id}>
                          <td className="fw-medium text-uppercase">{coin.symbol}</td>
                          <td className="text-success fw-semibold">
                            +{coin.price_change_percentage_24h.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Top Losers */}
          <Col md={4}>
            <Card className="shadow-sm rounded-4 h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-semibold d-flex align-items-center mb-0">
                    <FaArrowDown className="text-danger me-2" /> Top Losers
                  </h6>
                  <a
                    href="#"
                    className="small fw-semibold text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewMore(
                        "Top Losers (24h)",
                        [...coins]
                          .sort(
                            (a, b) =>
                              a.price_change_percentage_24h - b.price_change_percentage_24h
                          )
                          .slice(0, 50)
                      );
                    }}
                  >
                    View More &gt;
                  </a>
                </div>
                <Table size="sm" borderless responsive className="mb-0">
                  <tbody>
                    {[...coins]
                      .sort(
                        (a, b) =>
                          a.price_change_percentage_24h - b.price_change_percentage_24h
                      )
                      .slice(0, 20)
                      .map((coin) => (
                        <tr key={coin.id}>
                          <td className="fw-medium text-uppercase">{coin.symbol}</td>
                          <td className="text-danger fw-semibold">
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* === Categories View === */}
      {activeView === "categories" && (
        <div className="p-3 bg-white rounded-4 shadow-sm mb-4">
          <h5 className="fw-semibold mb-3">Categories</h5>
          <Row>
            {categories.map((cat, idx) => (
              <Col md={4} key={idx} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <h6 className="fw-semibold">{cat.name}</h6>
                    <p className="mb-1">Market Cap: ${cat.market_cap?.toLocaleString()}</p>
                    <p className="mb-0">
                      24h Change:{" "}
                      <span
                        className={
                          cat.market_cap_change_24h >= 0
                            ? "text-success fw-semibold"
                            : "text-danger fw-semibold"
                        }
                      >
                        {cat.market_cap_change_24h?.toFixed(2)}%
                      </span>
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

     
 
{/* === Modal for View More === */}
<Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
  <Modal.Header closeButton>
    <Modal.Title>{modalTitle}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Table hover responsive>
      <thead className="table-success">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Price</th>
          <th>24h %</th>
          <th>Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {modalData.map((coin, idx) => (
          <tr key={coin.id || idx}>
            <td>{coin.market_cap_rank ?? idx + 1}</td>
            <td>{coin.name}</td>
            <td className="text-uppercase">{coin.symbol}</td>
            <td>${coin.current_price?.toLocaleString()}</td>
            <td
              className={
                coin.price_change_percentage_24h >= 0
                  ? "text-success fw-semibold"
                  : "text-danger fw-semibold"
              }
            >
              {coin.price_change_percentage_24h?.toFixed(2) ?? "0"}%
            </td>
            <td>${coin.market_cap?.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Modal.Body>
</Modal>
        </>
  );

};