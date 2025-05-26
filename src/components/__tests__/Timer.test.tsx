import { render, screen } from '@testing-library/react';
import Timer from '../Timer'; // Adjust path as necessary

describe('Timer', () => {
  it('renders without crashing', () => {
    render(<Timer time={60} />);
    // Check if the component renders, e.g., by looking for the time display
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('displays the ClockIcon', () => {
    render(<Timer time={60} />);
    // Lucide icons are often rendered as SVGs. A common way to check for them
    // is by looking for a class or a title if the icon library adds one.
    // For lucide-react, icons are SVGs and often have a class like 'lucide-{icon-name}'.
    const clockIcon = screen.getByText('60').parentElement?.querySelector('svg.lucide-clock');
    expect(clockIcon).toBeInTheDocument();
    // Also check a known class of the parent div to ensure structure.
    const parentDiv = screen.getByText('60').parentElement;
    expect(parentDiv).toHaveClass('border-success');
  });

  it('displays the correct time passed as a prop', () => {
    render(<Timer time={123} />);
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('displays time as 0 when 0 is passed', () => {
    render(<Timer time={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
