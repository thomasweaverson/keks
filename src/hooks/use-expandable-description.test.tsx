import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import useExpandableDescription from './use-expandable-description';
import { DESCRIPTION_LENGTH } from '../const/business';

describe('Hook: useExpandableDescription', () => {
  it('handles short description correctly', () => {
    const shortText = 'a'.repeat(DESCRIPTION_LENGTH);

    const { result } = renderHook(() => useExpandableDescription(shortText));

    expect(result.current.isLongDescription).toBe(false);
    expect(result.current.isExpanded).toBe(false);
    expect(result.current.visibleDescription).toBe(shortText);
  });

  it('truncates long description initially and expands it on expand call', () => {
    const longText = 'a'.repeat(DESCRIPTION_LENGTH + 10);
    const expectedTruncatedText = 'a'.repeat(DESCRIPTION_LENGTH);

    const { result } = renderHook(() => useExpandableDescription(longText));

    expect(result.current.isLongDescription).toBe(true);
    expect(result.current.isExpanded).toBe(false);
    expect(result.current.visibleDescription).toBe(expectedTruncatedText);

    act(() => {
      result.current.expand();
    });

    expect(result.current.isExpanded).toBe(true);
    expect(result.current.visibleDescription).toBe(longText);
  });
});
