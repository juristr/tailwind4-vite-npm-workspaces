import { render, screen } from '@testing-library/react';
import { App } from './app';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock the ProductGrid component from the feat-product-list package
vi.mock('@aishop/feat-product-list', () => ({
  ProductGrid: () =>
    React.createElement(
      'div',
      { 'data-testid': 'product-grid' },
      'Product Grid Mock'
    ),
}));

// Mock the local components
vi.mock('./components/Navbar', () => ({
  default: () =>
    React.createElement('div', { 'data-testid': 'navbar' }, 'Navbar Mock'),
}));

vi.mock('./components/Footer', () => ({
  default: () =>
    React.createElement('div', { 'data-testid': 'footer' }, 'Footer Mock'),
}));

describe('App', () => {
  it('renders correctly', () => {
    const { container } = render(<App />);

    // Check if all components are rendered
    expect(screen.getByTestId('navbar')).toBeDefined();
    expect(screen.getByTestId('product-grid')).toBeDefined();
    expect(screen.getByTestId('footer')).toBeDefined();

    // Check if the title is rendered
    expect(screen.getByText('Legit Products')).toBeDefined();

    // Check if filter buttons are rendered
    expect(screen.getByText('Latest')).toBeDefined();
    expect(screen.getByText('Popular')).toBeDefined();
    expect(screen.getByText('Sale')).toBeDefined();

    // Make sure the component rendered something
    expect(container.innerHTML).toBeTruthy();
  });
});
