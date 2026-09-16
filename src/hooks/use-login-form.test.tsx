import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FocusEvent, SubmitEvent } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLoginForm } from './use-login-form';
import {
  validateEmail,
  validateForm,
  validatePassword,
} from '../pages/login-page/login-form/utils';
import { withStore } from '../utils/testing/mock-components';

const { mockAuthorizeUserAction } = vi.hoisted(() => ({
  mockAuthorizeUserAction: vi.fn(() => ({
    type: 'user/authorize',
    unwrap: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock('../store/api-actions', () => ({
  authorizeUserAction: mockAuthorizeUserAction,
}));

vi.mock('../pages/login-page/login-form/utils', () => ({
  validateEmail: vi.fn(),
  validatePassword: vi.fn(),
  validateForm: vi.fn(),
}));

const createChangeEvent = (name: string, value: string): ChangeEvent<HTMLInputElement> => {
  const input = document.createElement('input');
  input.name = name;
  input.value = value;
  return {
    target: input,
    currentTarget: input,
  } as ChangeEvent<HTMLInputElement>;
};

const createFocusEvent = (name: string): FocusEvent<HTMLInputElement> => {
  const input = document.createElement('input');
  input.name = name;
  return {
    target: input,
    currentTarget: input,
  } as FocusEvent<HTMLInputElement>;
};

const createSubmitEvent = (preventDefault: () => void): SubmitEvent<HTMLFormElement> => {
  const form = document.createElement('form');
  return {
    preventDefault,
    target: form,
    currentTarget: form,
  } as SubmitEvent<HTMLFormElement>;
};

describe('Hook: useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useLoginForm(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    expect(result.current.values).toEqual({ email: '', password: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('updates values and validates email field on handleChange', () => {
    vi.mocked(validateEmail).mockReturnValue('Неверный email');

    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useLoginForm(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    const event = createChangeEvent('email', 'invalid-email');

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.values.email).toBe('invalid-email');
    expect(result.current.errors.email).toBe('Неверный email');
    expect(validateEmail).toHaveBeenCalledWith('invalid-email');
  });

  it('updates values and validates password field on handleChange', () => {
    vi.mocked(validatePassword).mockReturnValue('Пароль слишком короткий');

    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useLoginForm(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    const event = createChangeEvent('password', '123');

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.values.password).toBe('123');
    expect(result.current.errors.password).toBe('Пароль слишком короткий');
    expect(validatePassword).toHaveBeenCalledWith('123');
  });

  it('marks field as touched on handleBlur', () => {
    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useLoginForm(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    const event = createFocusEvent('email');

    act(() => {
      result.current.handleBlur(event);
    });

    expect(result.current.touched).toEqual({ email: true });
  });

  it('prevents dispatching action when form validation fails on handleSubmit', async () => {
    vi.mocked(validateForm).mockReturnValue({ email: 'Обязательное поле' });

    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useLoginForm(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    const preventDefault = vi.fn();
    const event = createSubmitEvent(preventDefault);

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.touched).toEqual({ email: true, password: true });
    expect(result.current.errors).toEqual({ email: 'Обязательное поле' });
    expect(mockAuthorizeUserAction).not.toHaveBeenCalled();
  });

  it('dispatches authorizeUserAction on handleSubmit when validation passes', async () => {
    vi.mocked(validateForm).mockReturnValue({});

    const { mockStore } = withStore(<></>);

    const { result } = renderHook(() => useLoginForm(), {
      wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
    });

    const changeEmailEvent = createChangeEvent('email', '  user@test.com  ');
    const changePasswordEvent = createChangeEvent('password', 'secret123');

    act(() => {
      result.current.handleChange(changeEmailEvent);
      result.current.handleChange(changePasswordEvent);
    });

    const preventDefault = vi.fn();
    const event = createSubmitEvent(preventDefault);

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(mockAuthorizeUserAction).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'secret123',
    });
    expect(result.current.isSubmitting).toBe(false);
  });
});
