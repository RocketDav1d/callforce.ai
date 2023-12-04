import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar, { SidebarItem } from '@/components/Sidebar';
import '@testing-library/jest-dom';
import Router, { useRouter } from 'next/router';


// Type for useRouter mock
type UseRouterMock = jest.MockedFunction<typeof useRouter>;

// Cast useRouter mock to the correct type
const useRouterMock = useRouter as UseRouterMock;

// jest.mock('next/router', () => ({
//   useRouter: jest.fn(),
// }));


jest.mock('next/router', () => ({
  useRouter: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
}));

// Optionally mock useSession
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: jest.fn(() => ({ data: { user: { email: 'test@example.com' } } })),
}));



describe('Sidebar', () => {
  // const spies: any = {};
  let routeChangeStartSpy;



  beforeEach(() => {
    // spies.routerChangeStart = jest.fn();
    // Router.events.on('routeChangeStart', spies.routerChangeStart);

    routeChangeStartSpy = jest.fn();
    Router.events.on.mockImplementation((event, handler) => {
      if (event === 'routeChangeStart') {
        routeChangeStartSpy = handler;
      }
    });
    
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
      prefetch: jest.fn(),
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isReady: true,
      basePath: '',
    }));
  });

  afterEach(() => {
    // Router.events.off('routeChangeStart', spies.routerChangeStart);
    Router.events.off.mockImplementation((event, handler) => {
      if (event === 'routeChangeStart') {
        routeChangeStartSpy = null;
      }
    });
  });

  it('renders sidebar with items', () => {
    render(
      <Sidebar>
        <SidebarItem icon={undefined} text={'Calls'} href="/admin" />
        <SidebarItem icon={undefined} text={'Analytics'} href="/analytics" />
        <SidebarItem icon={undefined} text={'Settings'} href="/settings" />
      </Sidebar>
    );

    expect(screen.getByText('Calls')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('toggles sidebar expanded/collapsed state', () => {
    render(
      <Sidebar>
        <SidebarItem icon={undefined} text={'Analytics'} href="/analytics " />
      </Sidebar>
    );

    // Find the toggle button. You might need to adjust the query based on your actual button's attributes or text.
    const toggleButton = screen.getByTestId('sidebar-toggle');

    // Assume the sidebar starts in an expanded state
    // You can check for an element that's only visible when expanded, like text from a SidebarItem.
    const sidebarText = screen.getByText('Analytics');
    expect(sidebarText).toBeVisible();
    // expect(screen.getByText('Analytics')).toBeVisible();

    // Click the toggle button to collapse the sidebar
    fireEvent.click(toggleButton);

    expect(sidebarText).toHaveClass('hidden'); // Adjust the class name as per your implementation.


    // Now the sidebar text should be hidden
    // This assumes that the text is actually hidden when collapsed, which depends on your CSS/JS logic
    // expect(screen.queryByText('Analytics')).not.toBeVisible();

    // Optional: Click the toggle button again to re-expand the sidebar and check visibility
    fireEvent.click(toggleButton);
    expect(screen.getByText('Analytics')).toBeVisible();
  });


  it('navigates to correct page on sidebar item click', () => {
    // Set up the component with the SidebarItem children
    render(
      <Sidebar>
        <SidebarItem icon={undefined} text={'Analytics'} href="/analytics" />
      </Sidebar>
    );

    // Simulate a click on the "Analytics" sidebar item
    fireEvent.click(screen.getByText('Analytics'));

    // Expect the Next.js router to navigate to the "/analytics" page

    // expect(window.location.href).toBe('http://localhost/analytics');
    expect(routeChangeStartSpy).toHaveBeenCalledWith('http://localhost/analytics');
    // expect(spies.routerChangeStart).toHaveBeenCalledWith('http://localhost/analytics');


  });


});
