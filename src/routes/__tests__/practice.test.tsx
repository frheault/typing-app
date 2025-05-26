import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryHistory, createRouter, Route as TanstackRoute, RootRoute } from '@tanstack/react-router';
import { Route as PracticeRoute } from '../practice'; 
import { Route as RootRouteComponent } from '../__root';
import { vi } from 'vitest';

// --- Mock sentenceStore ---
const mockSentenceStoreActions = {
  getSentencesByTopic: vi.fn(),
};
const initialMockedSentenceStoreState = {
  sentences: [ { text: 'physics sentence 1', topic: 'physics'} ], 
};
vi.mock('../../store/sentenceStore', () => ({
  __esModule: true,
  useSentenceStore: vi.fn().mockImplementation((selector) => {
    const state = { ...initialMockedSentenceStoreState, ...mockSentenceStoreActions };
    return selector(state);
  }),
}));
// --- End Mock sentenceStore ---

// --- Mock deobfuscateText ---
const mockDeobfuscateText = vi.fn((text) => text); 
vi.mock('../../lib/obfuscation', () => ({
  __esModule: true, // Important for ES Modules
  deobfuscateText: mockDeobfuscateText,
}));
// --- End Mock deobfuscateText ---

// Import useSentenceStore AFTER mocking it
import useSentenceStore from '../../store/sentenceStore';
// Import deobfuscateText AFTER mocking it (though not directly used in test logic, component uses it)
// import { deobfuscateText } from '../../lib/obfuscation'; // Not needed in test if only testing mock calls

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


const createTestRouter = (searchParams: Record<string, any> = {}) => {
  const routeTree = RootRouteComponent.addChildren([PracticeRoute]);
  const initialEntries = ['/practice'];
  if (Object.keys(searchParams).length > 0) {
    const query = new URLSearchParams(searchParams).toString();
    initialEntries[0] += `?${query}`;
  }

  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries }),
  });
}

describe('PracticePage', () => {
  beforeEach(() => {
    mockSentenceStoreActions.getSentencesByTopic.mockClear();
    // @ts-ignore
    mockLocalStorage.clear(); 
    mockDeobfuscateText.mockClear(); 
    
    (useSentenceStore as vi.Mock).mockImplementation((selector) => {
        const state = { ...initialMockedSentenceStoreState, ...mockSentenceStoreActions };
        return selector(state);
    });
    // Ensure deobfuscateText mock is reset to its default behavior if changed in a test
    mockDeobfuscateText.mockImplementation(text => text);
  });

  it('renders TypingTest when topic and sentences are available', async () => {
    mockSentenceStoreActions.getSentencesByTopic.mockReturnValue([
      { text: 'This is a physics sentence.', topic: 'physics' },
    ]);
    const router = createTestRouter({ topic: 'physics', eclipsedTime: 60 });
    render(<RouterProvider router={router} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('text-display-area')).toBeInTheDocument();
    });
    expect(mockSentenceStoreActions.getSentencesByTopic).toHaveBeenCalledWith('physics');
  });

  it('renders TypingTest with saved text when savedTextId is provided and found', async () => {
    const savedTexts = [
      { id: 1, label: 'My Custom Text', text: 'This is my saved custom text.', language: 'plaintext', isObfuscated: false },
    ];
    mockLocalStorage.setItem('customTextData', JSON.stringify(savedTexts));
    
    const router = createTestRouter({ savedTextId: 1, eclipsedTime: 120 });
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId('text-display-area')).toBeInTheDocument();
    });
    await screen.findByText('T'); 
    expect(screen.getByText('h')).toBeInTheDocument(); 
    expect(screen.getByText('i')).toBeInTheDocument();
    expect(screen.getByText('s')).toBeInTheDocument();
  });
  
  it('renders TypingTest with deobfuscated saved text', async () => {
    const obfuscatedText = "ObFuScAtEdTeXt"; 
    const expectedDeobfuscatedText = "Deobfuscated Text";
    mockDeobfuscateText.mockReturnValue(expectedDeobfuscatedText);

    const savedTexts = [
      { id: 2, label: 'My Obfuscated Text', text: obfuscatedText, language: 'plaintext', isObfuscated: true },
    ];
    mockLocalStorage.setItem('customTextData', JSON.stringify(savedTexts));
    
    const router = createTestRouter({ savedTextId: 2 });
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId('text-display-area')).toBeInTheDocument();
    });
    await screen.findByText(expectedDeobfuscatedText.charAt(0)); 
    expect(screen.getByText(expectedDeobfuscatedText.charAt(1))).toBeInTheDocument();
    expect(mockDeobfuscateText).toHaveBeenCalledWith(obfuscatedText);
  });


  it('shows loading state for saved text then displays it', async () => {
    const savedTexts = [
      { id: 3, label: 'Another Text', text: 'Loading test text.', language: 'plaintext', isObfuscated: false },
    ];
    mockLocalStorage.setItem('customTextData', JSON.stringify(savedTexts));
    
    const router = createTestRouter({ savedTextId: 3 });
    render(<RouterProvider router={router} />);
    
    expect(screen.getByText(/Chargement du texte personnalisé.../i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('text-display-area')).toBeInTheDocument();
    });
    await screen.findByText('L'); 
  });

  it('shows message if savedTextId is not found', async () => {
    mockLocalStorage.setItem('customTextData', JSON.stringify([])); 
    const router = createTestRouter({ savedTextId: 999 });
    render(<RouterProvider router={router} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Aucun texte sélectionné pour l'entraînement./i)).toBeInTheDocument();
    });
  });
  
  it('shows message if no topic is provided and no savedTextId', async () => {
    const router = createTestRouter({}); 
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByText(/Aucun texte sélectionné pour l'entraînement./i)).toBeInTheDocument();
    });
  });

  it('shows message if topic is provided but no sentences are found', async () => {
    mockSentenceStoreActions.getSentencesByTopic.mockReturnValue([]); 
    const router = createTestRouter({ topic: 'nonexistenttopic' });
    render(<RouterProvider router={router} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Aucune phrase trouvée pour le sujet : nonexistenttopic./i)).toBeInTheDocument();
    });
    expect(mockSentenceStoreActions.getSentencesByTopic).toHaveBeenCalledWith('nonexistenttopic');
  });
});
