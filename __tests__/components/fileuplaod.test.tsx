import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FileUpload from '@/components/FileUpload2'; // Adjust the import path as needed
import * as reactQuery from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import * as s3Lib from '@/lib/s3'; // Adjust the import path as needed
import Router from 'next/router';
import { UseMutationResult } from '@tanstack/react-query';
import * as ReactQuery from '@tanstack/react-query';
import { mocked } from 'jest-mock';
// import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'



// vi.mock("next/navigation", () => {
//   const actual = vi.importActual("next/navigation");
//   return {
//     ...actual,
//     useRouter: vi.fn(() => ({
//       push: vi.fn(),
//     })),
//     useSearchParams: vi.fn(() => ({
//       get: vi.fn(),
//     })),
//     usePathname: vi.fn(),
//   };
// });



// Mock external dependencies
jest.mock('react-dropzone');
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'), // Preserve actual implementations of other methods
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
    // Add other properties or methods as needed, e.g., data, error, isSuccess, etc.
  })),
}));
jest.mock('axios');
jest.mock('react-hot-toast');
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
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
    // Add other properties and methods as needed for your tests
  }),
}));


describe('FileUpload', () => {

  const mockApiService = {
    getProperties: jest.fn(),
    postExtract: jest.fn(),
    postHubspotQuery: jest.fn()
  };

  const mockOnUploadComplete = jest.fn();
  const mockDialogData = { name: 'Test Chat', groupId: 'group1' };


  it('renders correctly', () => {
    render(<FileUpload dialogData={mockDialogData} onUploadComplete={mockOnUploadComplete} apiService={mockApiService} />);
    expect(screen.getByText('Drop Recording here')).toBeInTheDocument();
    // render(<FileUpload dialogData={mockDialogData} onUploadComplete={mockOnUploadComplete} apiService={mockApiService} />);
    // expect(screen.getByText('Drop Recording here')).toBeInTheDocument();
  });

  it('handles file drop with a valid file', () => {
    // Test behavior when a valid file is dropped
  });

  it('shows error toast when file is too big', () => {
    // Test error handling for large file size
  });

  it('calls uploadToS3 and mutation function on file drop', () => {
    // Test the upload process
  });

  it('displays loading indicator while processing the file', () => {
    // Test loading state
  });

  it('shows success toast and redirects on successful upload and mutation', () => {
    // Test success scenario
  });

  it('shows error toast on unsuccessful upload or mutation', () => {
    // Test error scenario
  });

  // Add more tests as needed
});