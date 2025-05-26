import { render, screen, waitFor, act, within } from '@testing-library/react';
import Result from '../Result'; // Adjust path as necessary

// Mocking browser APIs not available in JSDOM or to control their behavior
const mockDigest = vi.fn();
const mockTextEncoder = vi.fn();

beforeAll(() => {
  global.TextEncoder = mockTextEncoder as any;
  global.crypto = {
    ...global.crypto,
    subtle: {
      ...global.crypto?.subtle,
      digest: mockDigest,
    },
  } as any;
});

beforeEach(() => {
  // Reset mocks before each test
  mockDigest.mockReset();
  mockTextEncoder.mockReset();

  // Mock implementation for TextEncoder
  mockTextEncoder.mockImplementation(() => ({
    encode: vi.fn().mockImplementation((input: string) => new Uint8Array(input.split('').map(char => char.charCodeAt(0)))),
  }));

  // Mock implementation for crypto.subtle.digest to return a predictable hash
  mockDigest.mockResolvedValue(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).buffer);
});


describe('Result', () => {
  const defaultProps = {
    accuracy: 95,
    cpm: 70,
    originalText: 'hello world',
    userInput: 'hello world',
  };

  it('renders without crashing', async () => {
    render(<Result {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/Excellent !/i)).toBeInTheDocument(); // Status for high accuracy/cpm
    });
  });

  it('displays accuracy and CPM correctly', async () => {
    render(<Result {...defaultProps} accuracy={88} cpm={55} />);
    await waitFor(() => {
      expect(screen.getByText(/Précision :/i)).toHaveTextContent('Précision : 88%');
      expect(screen.getByText(/CPM :/i)).toHaveTextContent('CPM : 55');
    });
  });

  it('displays "Excellent !" status and 🎉 emoji for high scores', async () => {
    render(<Result {...defaultProps} accuracy={90} cpm={60} />);
    await waitFor(() => {
      expect(screen.getByText('🎉')).toBeInTheDocument();
      expect(screen.getByText(/Excellent !/i)).toBeInTheDocument();
    });
  });

  it('displays "Beau travail !" status and 👍 emoji for good scores', async () => {
    render(<Result {...defaultProps} accuracy={85} cpm={50} />);
    await waitFor(() => {
      expect(screen.getByText('👍')).toBeInTheDocument();
      expect(screen.getByText(/Beau travail !/i)).toBeInTheDocument();
    });
  });
  
  it('displays "Bel effort !" status and 😊 emoji for fair scores', async () => {
    render(<Result {...defaultProps} accuracy={70} cpm={40} />);
    await waitFor(() => {
      expect(screen.getByText('😊')).toBeInTheDocument();
      expect(screen.getByText(/Bel effort !/i)).toBeInTheDocument();
    });
  });

  it('displays "Continuez à vous entraîner !" status and 💪 emoji for lower scores', async () => {
    render(<Result {...defaultProps} accuracy={60} cpm={30} />);
    await waitFor(() => {
      expect(screen.getByText('💪')).toBeInTheDocument();
      expect(screen.getByText(/Continuez à vous entraîner !/i)).toBeInTheDocument();
    });
  });

  it('renders the "Recommencer l\'entraînement" button', async () => {
    render(<Result {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Recommencer l'entraînement/i })).toBeInTheDocument();
    });
  });
  
  it('displays character statistics table headers', async () => {
    render(<Result {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Caractère')).toBeInTheDocument();
      expect(screen.getByText('Nombre total')).toBeInTheDocument();
      expect(screen.getByText("Nombre d'erreurs")).toBeInTheDocument();
    });
  });

  it('displays character statistics correctly', async () => {
    render(<Result {...defaultProps} originalText="abc" userInput="abd" />);
    // Wait for useEffect to run and stats to be calculated and set
    await waitFor(() => {
      // Check for 'a'
      const charARow = screen.getByText('a').closest('tr');
      expect(within(charARow!).getByText('1', { selector: 'td:nth-child(2)' })).toBeInTheDocument(); // total
      expect(within(charARow!).getByText('0', { selector: 'td:nth-child(3)' })).toBeInTheDocument(); // errors
      
      // Check for 'b'
      const charBRow = screen.getByText('b').closest('tr');
      expect(within(charBRow!).getByText('1', { selector: 'td:nth-child(2)' })).toBeInTheDocument(); // total
      expect(within(charBRow!).getByText('0', { selector: 'td:nth-child(3)' })).toBeInTheDocument(); // errors

      // Check for 'c' (error)
      const charCRow = screen.getByText('c').closest('tr');
      expect(within(charCRow!).getByText('1', { selector: 'td:nth-child(2)' })).toBeInTheDocument(); // total
      expect(within(charCRow!).getByText('1', { selector: 'td:nth-child(3)' })).toBeInTheDocument(); // errors
    });
  });

  it('displays SHA-256 hash of the original text', async () => {
    render(<Result {...defaultProps} originalText="test text" />);
    // The hash is predictable due to mocked crypto.subtle.digest
    const expectedHash = "000102030405060708090a0b0c0d0e0f"; 
    await waitFor(() => {
      expect(screen.getByText(expectedHash, { exact: false })).toBeInTheDocument();
    }, { timeout: 2000 }); // Increased timeout for async operations
  });

  it('handles empty original text and user input for stats', async () => {
    render(<Result {...defaultProps} originalText="" userInput="" />);
    await waitFor(() => {
      expect(screen.getByText('Aucune donnée de caractère à afficher.')).toBeInTheDocument();
    });
  });
});
