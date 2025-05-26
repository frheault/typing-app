import { render, screen, waitFor, within } from '@testing-library/react';
import { RouterProvider, createMemoryHistory, createRouter, Outlet, Route } from '@tanstack/react-router';
import { Route as ActualRootRoute } from '../../routes/__root'; // This is the actual root route definition

// Create a new router instance for each test
const createTestRouter = () => {
  // Use the actual root route and add a test index route to it.
  // The ActualRootRoute already contains the component with Navbar, Outlet, Footer.
  const indexRoute = new Route({
    getParentRoute: () => ActualRootRoute, // ActualRootRoute is the parent
    path: '/',
    component: function IndexPage() { // This component will be rendered into ActualRootRoute's <Outlet />
      return <div>Test Index Content</div>;
    }
  });

  const routeTree = ActualRootRoute.addChildren([indexRoute]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
}

describe('Navbar', () => {
  it('renders without crashing', async () => {
    const router = createTestRouter();

    // The router should initialize and match routes upon rendering RouterProvider
    render(<RouterProvider router={router} />);

    // Wait for the Navbar text to appear.
    // Also, let's check for the "Test Index Content" to ensure the child route renders.
    await waitFor(() => {
      // Get all elements with the role "navigation"
      const navElements = screen.getAllByRole('navigation');
      // Assume the first one is the main Navbar
      const mainNavbar = navElements[0]; 
      expect(within(mainNavbar).getByText(/Application d'entraînement à la dactylographie/i)).toBeInTheDocument();
      
      // Check for the content rendered by the indexRoute's component
      expect(screen.getByText(/Test Index Content/i)).toBeInTheDocument();
    });
  });
});
