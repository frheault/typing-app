import { render, screen } from '@testing-library/react';
import Footer from '../Footer'; // Adjust path as necessary

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    // Check for a unique element or text in your Footer
    // For example, if your Footer has a copyright notice:
    expect(screen.getByText(/Droit d'auteur © 2025/i)).toBeInTheDocument();
  });
});
