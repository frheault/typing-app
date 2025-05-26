import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryHistory, createRouter, Route as TanstackRoute, RootRoute } from '@tanstack/react-router';
import { Route as IndexRouteDefinition } from '../index'; // The route definition from src/routes/index.tsx
import { Route as RootRouteLayout } from '../__root'; // The root layout component definition
import { vi } from 'vitest';

// --- Mock sentenceStore ---
const mockSentenceStoreActions = {
  getAllTopics: vi.fn().mockReturnValue(['physics', 'biology', 'chemistry']),
  getSentencesByTopic: vi.fn().mockImplementation(topic => {
    if (topic === 'physics') return [{ text: 'physics sentence 1', topic }, { text: 'physics sentence 2', topic }];
    if (topic === 'biology') return [{ text: 'biology sentence 1', topic }];
    if (topic === 'chemistry') return [{ text: 'chemistry sentence 1', topic }, { text: 'chemistry sentence 2', topic }, { text: 'chemistry sentence 3', topic }];
    return [];
  }),
};
const initialMockedSentenceStoreState = {
  sentences: [ 
    { text: 'physics sentence 1', topic: 'physics'}, { text: 'physics sentence 2', topic: 'physics'},
    { text: 'biology sentence 1', topic: 'biology'},
    { text: 'chemistry sentence 1', topic: 'chemistry'}, { text: 'chemistry sentence 2', topic: 'chemistry'}, { text: 'chemistry sentence 3', topic: 'chemistry'},
  ],
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


// Create a new router instance for each test
const createTestRouter = () => {
  // Create a fresh root route instance for the test router
  // This uses the component from the actual __root.tsx
  const testRootRoute = new RootRoute({
    component: RootRouteLayout.options.component, 
  });

  // Parent the actual IndexRouteDefinition under this testRootRoute
  // IndexRouteDefinition already has its path ('/') and component defined.
  const testIndexRoute = IndexRouteDefinition.update({
    getParentRoute: () => testRootRoute,
  });

  const routeTree = testRootRoute.addChildren([testIndexRoute]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
}

describe('IndexPage (Homepage - App.tsx)', () => {
  beforeEach(() => {
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

  it('renders the homepage correctly with key elements', async () => {
    const router = createTestRouter();
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('button', { name: /Commencer l'entraînement/i })).toBeInTheDocument();
    expect(screen.getByText('Choisissez votre sujet préféré')).toBeInTheDocument();
    
    // Wait for options to render as they might depend on store/effects
    await screen.findByText('physics (2)'); 
    expect(screen.getByText('biology (1)')).toBeInTheDocument();
    expect(screen.getByText('chemistry (3)')).toBeInTheDocument();
    
    expect(screen.getByText('Choisissez le temps écoulé')).toBeInTheDocument();
    // Query options more robustly
    expect(screen.getByRole('option', { name: '60' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '120' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Infinity' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Texte Sauvegardé/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Créer un Texte Personnalisé/i })).toBeInTheDocument();
  });
});
