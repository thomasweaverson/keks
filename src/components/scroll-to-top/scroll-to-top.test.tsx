import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { ScrollToTop } from './scroll-to-top';

describe('Component: ScrollToTop', () => {
  it('should scroll to top when pathname changes', () => {
    const scrollToMock = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(scrollToMock).toHaveBeenCalledWith(0, 0);

    scrollToMock.mockRestore();
  });
});
