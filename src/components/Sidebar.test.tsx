import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('should render with content always visible', () => {
    render(
      <Sidebar>
        <div data-testid="sidebar-content">Test Content</div>
      </Sidebar>
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-content')).toBeVisible();
  });

  it('should render header with title', () => {
    render(
      <Sidebar>
        <div>Test Content</div>
      </Sidebar>
    );

    expect(screen.getByText('Cartes')).toBeVisible();
  });

  it('should render children content', () => {
    render(
      <Sidebar>
        <div data-testid="child-content">Child Content</div>
      </Sidebar>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeVisible();
  });

  it('should have proper styling classes for fixed column layout', () => {
    render(
      <Sidebar>
        <div>Content</div>
      </Sidebar>
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-80', 'bg-white', 'border-l', 'border-gray-200', 'shadow-lg');
  });

  it('should have scrollable content area', () => {
    render(
      <Sidebar>
        <div data-testid="content">Content</div>
      </Sidebar>
    );

    const contentArea = screen.getByTestId('content').parentElement;
    expect(contentArea).toHaveClass('overflow-y-auto');
  });
});