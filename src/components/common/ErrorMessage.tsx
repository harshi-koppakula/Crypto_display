import { Alert } from 'react-bootstrap';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <Alert variant="danger" className="my-4">
      <Alert.Heading>Error</Alert.Heading>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-danger" onClick={onRetry}>
          Retry
        </button>
      )}
    </Alert>
  );
};