import { render, screen } from '@testing-library/react';
import Home from '@/app/page';




describe('Home', () => {

  it('should link to the admin page when the button says "Open my Admin"', () => {
    // Act
    render(<Home />);

    // Assert
    const adminLink = screen.getByRole('link', { name: /open my admin/i });
    expect(adminLink).toHaveAttribute('href', '/admin');
  });

  it('should link to the sign-in page when the button says "Sign In"', () => {
    // Act
    render(<Home />);

    // Assert
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toHaveAttribute('href', '/sign-in');
  });
});


// // Mock next-auth/react hooks
// jest.mock('next-auth/react');

// describe('Home', () => {

//   it("should display admin link when user is logged in", async () => {
//     // Arrange
//     const useSessionMock = mocked(useSession);
//     useSessionMock.mockReturnValue({
//       data: {
//         user: {
//           name: 'Test User',
//           email: 'test@example.com',
//           image: null,
//           username: "testuser",
//         },
//         expires: '2023-12-20T17:16:56.924Z',
//       },
//       status: 'authenticated',
//     });

//     // Act
//     render(<Home />);

//     // Assert
//     const adminLink = screen.getByRole('link', { name: /open my admin/i });
//     expect(adminLink).toBeInTheDocument();
//   });

//   it("should display sign in button when user is not logged in", async () => {
//     // Arrange
//     const useSessionMock = mocked(useSession);
//     useSessionMock.mockReturnValue({
//         data: null,
//         status: 'unauthenticated',
//         update: jest.fn(), // Add an empty mock function for `update`
//       });

//     // Act
//     render(<Home />);

//     // Assert
//     const signInButton = screen.getByRole('link', { name: /sign in/i });
//     expect(signInButton).toBeInTheDocument();
//   });
// });
