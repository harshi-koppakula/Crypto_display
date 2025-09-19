import { Spinner } from 'react-bootstrap';

export const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center my-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};