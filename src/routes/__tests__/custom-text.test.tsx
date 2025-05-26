import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryHistory, createRouter, Route as TanstackRoute, RootRoute } from '@tanstack/react-router';
import { Route as CustomTextRoute } from '../custom-text'; 
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
    // This mock will be called by any component using the hook.
    // The selector function will receive the complete mock state.
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
  const routeTree = RootRouteComponent.addChildren([CustomTextRoute]);
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/custom-text'] }),
  });
}

describe('CustomTextPage', () => {
  beforeEach(() => {
    // @ts-ignore
    mockLocalStorage.clear();
    // Reset mock function calls from sentenceStore mock
    mockSentenceStoreActions.getAllTopics.mockClear();
    mockSentenceStoreActions.getSentencesByTopic.mockClear();
    
    // Ensure the mock returns fresh state for each test if needed by layout components
    (useSentenceStore as vi.Mock).mockImplementation((selector) => {
        const state = { 
            ...initialMockedSentenceStoreState, 
            ...mockSentenceStoreActions 
        };
        return selector(state);
    });
  });

  it('renders the custom text form with key elements', () => {
    const router = createTestRouter();
    render(<RouterProvider router={router} />);

    expect(screen.getByLabelText(/Télécharger un fichier de code\/texte/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Libellé de l'entraînement/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ou collez le texte manuellement/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Langue \(pour la coloration syntaxique\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sauvegarder et Aller à l'entraînement/i })).toBeInTheDocument();
  });

  it('allows typing in form fields', async () => {
    const router = createTestRouter();
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    const labelInput = screen.getByLabelText(/Libellé de l'entraînement/i);
    await user.type(labelInput, 'My Test Label');
    expect(labelInput).toHaveValue('My Test Label');

    const textarea = screen.getByLabelText(/Ou collez le texte manuellement/i);
    await user.type(textarea, 'This is my custom text for practice.');
    expect(textarea).toHaveValue('This is my custom text for practice.');

    const languageSelect = screen.getByLabelText(/Langue \(pour la coloration syntaxique\)/i);
    await user.selectOptions(languageSelect, 'python');
    expect(languageSelect).toHaveValue('python');
  });

  it('shows success message on valid submission and navigates (mocked)', async () => {
    const router = createTestRouter();
    render(<RouterProvider router={router} />);
    const user = userEvent.setup({ delay: null }); 

    await user.type(screen.getByLabelText(/Libellé de l'entraînement/i), 'Valid Label');
    await user.type(screen.getByLabelText(/Ou collez le texte manuellement/i), 'This is a valid text with enough characters.');
    await user.selectOptions(screen.getByLabelText(/Langue \(pour la coloration syntaxique\)/i), 'plaintext');
    
    const submitButton = screen.getByRole('button', { name: /Sauvegarder et Aller à l'entraînement/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Votre texte a été sauvegardé !/i)).toBeInTheDocument();
    });

    const storedData = JSON.parse(mockLocalStorage.getItem("customTextData") || "[]");
    expect(storedData.length).toBe(1);
    expect(storedData[0].label).toBe('Valid Label');
    expect(storedData[0].text).toBe('This is a valid text with enough characters.');
    expect(storedData[0].language).toBe('plaintext');
  });

   it('shows error messages for invalid submission', async () => {
    const router = createTestRouter();
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /Sauvegarder et Aller à l'entraînement/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Le libellé doit comporter au moins 3 caractères")).toBeInTheDocument();
      expect(screen.getByText("Le texte/contenu doit être disponible")).toBeInTheDocument(); 
    });
  });
});
