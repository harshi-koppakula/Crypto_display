import { Form, Row, Col } from 'react-bootstrap';

interface SearchAndSortProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchAndSort = ({ searchTerm, onSearchChange }: SearchAndSortProps) => {
  return (
    <Row className="my-4">
      <Col md={6}>
        <Form.Group>
          <Form.Label>Search by name or symbol</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};