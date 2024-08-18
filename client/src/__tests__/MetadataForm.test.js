import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MetadataForm from '../components/MetadataForm';
import axios from 'axios';

jest.mock('axios');

describe('MetadataForm', () => {
  it('renders the form and inputs', () => {
    render(<MetadataForm />);
    expect(screen.getAllByPlaceholderText('Enter URL').length).toBe(3);
  });

  it('handles URL input change', () => {
    render(<MetadataForm />);
    const input = screen.getAllByPlaceholderText('Enter URL')[0];
    fireEvent.change(input, { target: { value: 'example.com' } });
    expect(input.value).toBe('https://example.com');
  });

  it('shows error for invalid URLs', async () => {
    render(<MetadataForm />);
    const input = screen.getAllByPlaceholderText('Enter URL')[0];
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => screen.getByText(/Invalid URL/));
    expect(screen.getByText(/Invalid URL/)).toBeInTheDocument();
  });

  it('submits valid URLs and displays metadata', async () => {
    const mockData = [
      { title: 'Title 1', description: 'Description 1', image: 'image1.jpg', url: 'https://example1.com' },
      { title: 'Title 2', description: 'Description 2', image: 'image2.jpg', url: 'https://example2.com' },
    ];
    axios.post.mockResolvedValueOnce({ data: mockData });

    render(<MetadataForm />);
    fireEvent.change(screen.getAllByPlaceholderText('Enter URL')[0], { target: { value: 'https://example1.com' } });
    fireEvent.change(screen.getAllByPlaceholderText('Enter URL')[1], { target: { value: 'https://example2.com' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => screen.getAllByText(/Title/));
    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Title 2')).toBeInTheDocument();
  });

  it('handles API error and shows error message', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<MetadataForm />);
    fireEvent.change(screen.getAllByPlaceholderText('Enter URL')[0], { target: { value: 'https://example.com' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => screen.getByText(/Failed to fetch metadata/));
    expect(screen.getByText(/Failed to fetch metadata/)).toBeInTheDocument();
  });
});