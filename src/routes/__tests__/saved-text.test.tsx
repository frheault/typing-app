import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryHistory, createRouter, Route as TanstackRoute, RootRoute } from '@tanstack/react-router';
import { Route as SavedTextRoute } from '../saved-text'; 
import { Route as RootRouteComponent } from '../__root';
import { vi } from 'vitest';

// --- Mock sentenceStore ---
const mockSentenceStoreActions = {
  getAllTopics: vi.fn().mockReturnValue(['physics', 'biology']),
  getSentencesByTopic: vi.fn().mockReturnValue([]),
};
const initialMockedSentenceStoreState = {
  sentences: [],
};
vi.mock('../../store/sentenceStore', () => ({
  __esModule: true,
  useSentenceStore: vi.fn().mockImplementation((selector) => {
    const state = { 
        ...initialMockedSentenceStoreState, 
        ...mockSentenceStoreActions 
    };
    return selector(state);
  }),
}));
// --- End Mock sentenceStore ---

// Import useSentenceStore AFTER mocking it
import useSentenceStore from '../../store/sentenceStore';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });


const createTestRouter = () => {
  const routeTree = RootRouteComponent.addChildren([SavedTextRoute]);
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/saved-text'] }),
  });
}

describe('SavedTextPage', () => {
  beforeEach(() => {
    // @ts-ignore
    mockLocalStorage.clear();
    mockSentenceStoreActions.getAllTopics.mockClear();
    mockSentenceStoreActions.getSentencesByTopic.mockClear();
    
    (useSentenceStore as vi.Mock).mockImplementation((selector) => {
        const state = { 
            ...initialMockedSentenceStoreState, 
            ...mockSentenceStoreActions 
        };
        return selector(state);
    });
  });

  it('renders the page title and "Créer" button', () => {
    const router = createTestRouter();
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: /Textes Personnalisés/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer/i })).toBeInTheDocument();
  });

  it('displays a message when no saved texts are available', () => {
    const router = createTestRouter();
    render(<RouterProvider router={router} />);
    expect(screen.queryByRole('button', { name: /S'entraîner/i })).not.toBeInTheDocument();
  });

  it('displays saved texts from localStorage', async () => {
    const savedTexts = [
      { id: '1', label: 'My First Text', text: 'This is the content of my first text.', time: new Date().toLocaleString() },
      { id: '2', label: 'Another Great Text', text: 'Content for the second text goes here.', time: new Date().toLocaleString() },
    ];
    mockLocalStorage.setItem('customTextData', JSON.stringify(savedTexts));
    
    const router = createTestRouter();
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText(/My First Text/i)).toBeInTheDocument();
      // Text content itself is sliced, so check for partial match
      expect(screen.getByText(/This is the content of my first text/i)).toBeInTheDocument();
      expect(screen.getByText(/Another Great Text/i)).toBeInTheDocument();
      expect(screen.getByText(/Content for the second text goes here/i)).toBeInTheDocument();
    });

    const practiceButtons = screen.getAllByRole('button', { name: /S'entraîner/i });
    expect(practiceButtons.length).toBe(2);
  });

  it('allows deleting a saved text', async () => {
    const user = userEvent.setup();
    const savedTexts = [
      { id: '1', label: 'Deletable Text', text: 'This text will be deleted.', time: new Date().toLocaleString() },
    ];
    mockLocalStorage.setItem('customTextData', JSON.stringify(savedTexts));
    
    const router = createTestRouter();
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText(/Deletable Text/i)).toBeInTheDocument();
    });

    const deleteButtonLabel = screen.getByText(/Deletable Text/i).closest('div.flex.flex-col')?.querySelector('label[for="my_modal_6"]');
    expect(deleteButtonLabel).toBeInTheDocument();
    await user.click(deleteButtonLabel!);

    expect(screen.getByText(/Confirmer la suppression !/i)).toBeInTheDocument();
    const confirmDeleteButton = screen.getByRole('button', { name: /Oui, supprimer/i });
    await user.click(confirmDeleteButton);

    await waitFor(() => {
      expect(screen.queryByText(/Deletable Text/i)).not.toBeInTheDocument();
    });
    
    const storedData = JSON.parse(mockLocalStorage.getItem("customTextData") || "[]");
    expect(storedData.length).toBe(0);
  });
});
