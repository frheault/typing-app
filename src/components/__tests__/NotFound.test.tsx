import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryHistory, createRouter, Route as TanstackRoute, RootRoute, NotFoundRoute } from '@tanstack/react-router';
import NotFoundComponent from '../NotFound'; // The component to test
import { Route as RootRouteComponentLayout } from '../../routes/__root'; // The root layout
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


// A simple placeholder for any actual route, so we can test a non-existent one
const PlaceholderRoute = new TanstackRoute({
    getParentRoute: () => RootRouteComponentLayout,
    path: '/some-valid-path-that-is-not-the-one-we-are-testing',
    component: () => <div>Valid Path Content</div>,
});

const createTestRouterForNotFound = () => {
  const notFoundRoute = new NotFoundRoute({
    getParentRoute: () => RootRouteComponentLayout,
    component: NotFoundComponent, 
  });

  const routeTree = RootRouteComponentLayout.addChildren([PlaceholderRoute, notFoundRoute]);
  
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/this-path-does-not-exist'] }),
  });
}


describe('NotFoundPage', () => {
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

  it('renders the NotFound component when navigating to a non-existent route', async () => {
    const router = createTestRouterForNotFound();
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/La page que vous recherchez n'existe pas !/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Accueil/i })).toBeInTheDocument();
  });

  it('renders NotFound component even if no other routes are defined besides root and notFound', async () => {
     const rootOnlyWithNotFound = new RootRoute({
        component: RootRouteComponentLayout.options.component, 
     });
     const notFoundRouteSimplified = new NotFoundRoute({
        getParentRoute: () => rootOnlyWithNotFound,
        component: NotFoundComponent,
     });
     const simplifiedRouteTree = rootOnlyWithNotFound.addChildren([notFoundRouteSimplified]);

     const router = createRouter({
        routeTree: simplifiedRouteTree,
        history: createMemoryHistory({ initialEntries: ['/another-random-path'] }),
     });

    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/La page que vous recherchez n'existe pas !/i)).toBeInTheDocument();
  });
});
