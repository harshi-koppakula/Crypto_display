import { Modal, Spinner, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Coin } from '../types/Coin';
import { CoinGeckoRepository } from '../repositories/CoinGeckoRepository';

interface CoinDetailsModalProps {
  coin: Coin | null;
  show: boolean;
  onHide: () => void;
}

export const CoinDetailsModal = ({
  coin,
  show,
  onHide,
}: CoinDetailsModalProps) => {
  const [coinDetails, setCoinDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (coin && show) {
      const fetchCoinDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const details = await CoinGeckoRepository.getCoinDetails(coin.id);
          setCoinDetails(details);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch details');
        } finally {
          setLoading(false);
        }
      };

      fetchCoinDetails();
    }
  }, [coin, show]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {coin && (
            <>
              <img
                src={coin.image}
                alt={coin.name}
                width="32"
                height="32"
                className="me-2"
              />
              {coin.name} ({coin.symbol.toUpperCase()})
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        {coinDetails && !loading && (
          <div>
            <p>
              <strong>Rank:</strong> {coin ? coin.market_cap_rank : 'N/A'}
            </p>
            <p>
              <strong>Current Price:</strong> {coin ? `$${formatNumber(coin.current_price)}` : 'N/A'}
            </p>
            <p>
              <strong>24h Change:</strong>{' '}
              <span
                className={
                  coin && coin.price_change_percentage_24h >= 0
                    ? 'text-success'
                    : 'text-danger'
                }
              >
                {coin && coin.price_change_percentage_24h !== undefined
                  ? coin.price_change_percentage_24h.toFixed(2)
                  : 'N/A'
                }%
              </span>
            </p>
            <p>
              <strong>Market Cap:</strong> {coin ? `$${formatNumber(coin.market_cap)}` : 'N/A'}
            </p>
            <p>
              <strong>24h Volume:</strong> {coin ? `$${formatNumber(coin.total_volume)}` : 'N/A'}
            </p>
            
            {coinDetails.description && coinDetails.description.en && (
              <>
                <h5>Description</h5>
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      coinDetails.description.en.split('. ').slice(0, 2).join('. ') +
                      '.',
                  }}
                />
              </>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};