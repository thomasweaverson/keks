import type { Location } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import {
  formatValue,
  getLocationState,
  handleScrollToTop,
} from './common';

describe('formatValue', () => {
  it('formats price with Russian locale and currency unit', () => {
    expect(formatValue(1234567, 'price')).toBe('1\u00A0234\u00A0567 р');
  });

  it('formats weight with Russian locale and weight unit', () => {
    expect(formatValue(1500, 'weight')).toBe('1\u00A0500 грамм');
  });

  it('formats zero price', () => {
    expect(formatValue(0, 'price')).toBe('0 р');
  });

  it('formats zero weight', () => {
    expect(formatValue(0, 'weight')).toBe('0 грамм');
  });
});

describe('handleScrollToTop', () => {
  it('scrolls to the top with smooth behavior', () => {
    const scrollToSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined);

    handleScrollToTop();

    expect(scrollToSpy).toHaveBeenCalledOnce();
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});

describe('getLocationState', () => {
  it('returns pathname, search and hash from location', () => {
    const location: Location = {
      pathname: '/product/123',
      search: '?from=catalog',
      hash: '#reviews',
      state: null,
      key: 'default',
    };

    expect(getLocationState(location)).toEqual({
      pathname: '/product/123',
      search: '?from=catalog',
      hash: '#reviews',
    });
  });

  it('preserves empty search and hash', () => {
    const location: Location = {
      pathname: '/catalog',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    };

    expect(getLocationState(location)).toEqual({
      pathname: '/catalog',
      search: '',
      hash: '',
    });
  });
});
