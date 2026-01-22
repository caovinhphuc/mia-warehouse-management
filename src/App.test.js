import { render, screen } from '@testing-library/react';
import TestRoutes from './TestRoutes';

test('renders learn react link', () => {
  render(<TestRoutes />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
