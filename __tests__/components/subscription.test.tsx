import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import Subscriptions from '@/components/Subscriptions';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Subscriptions', () => {
  // Save the original window.location
  const originalLocation = window.location;

  beforeEach(() => {
    // Reset mock before each test
    mockedAxios.get.mockReset();

    // Mock window.location with a replaceable href property
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' } as any;
  });

  afterEach(() => {
    // Restore the original window.location after each test
    window.location = originalLocation;
  });

  it('navigates to Stripe on button click', async () => {
    // Arrange
    const stripeUrl = 'https://stripe.com/checkout';
    mockedAxios.get.mockResolvedValueOnce({ data: { url: stripeUrl } });

    render(<Subscriptions hasSubscription={false} />);

    // Act
    fireEvent.click(screen.getByText('Upgrade to Pro'));

    // Wait for async action to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // 
    await waitFor(() => {
      expect(window.location.href).toBe(stripeUrl);
    });
    expect(window.location.href).toBe(stripeUrl);
  });
});





// import { render, screen, fireEvent } from '@testing-library/react';
// import axios from 'axios';
// import Subscriptions from '@/components/Subscriptions';

// // Mock axios
// jest.mock('axios');

// const mockedAxios = axios as jest.Mocked<typeof axios>;

// describe('Subscriptions', () => {
//   beforeEach(() => {
//     // Reset mock before each test
//     mockedAxios.get.mockReset();
//   });

//   it('navigates to Stripe on button click', async () => {
//     // Arrange
//     const stripeUrl = 'https://stripe.com/checkout';
//     mockedAxios.get.mockResolvedValueOnce({ data: { url: stripeUrl } });

//     // Mock window.location.href
//     delete window.location;
//     window.location = { href: '' } as any;

//     render(<Subscriptions hasSubscription={false} />);

//     // Act
//     fireEvent.click(screen.getByText('Upgrade to Pro'));

//     // Wait for async action to complete
//     await new Promise(resolve => setTimeout(resolve, 0));

//     // Assert
//     expect(window.location.href).toBe(stripeUrl);
//   });
// });
