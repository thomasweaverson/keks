import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ReviewTextInput from './review-text-input';
import { REVIEW_TEXT_MAX_LENGTH } from '../const';

describe('Component: ReviewTextInput', () => {
  it('should render label, placeholder and current value', () => {
    const value = 'Great cheesecake';
    const label = 'Плюсы';
    const placeholder = 'Что вам понравилось?';

    render(
      <ReviewTextInput
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={vi.fn()}
      />,
    );

    const input = screen.getByRole('textbox', { name: label });

    expect(input).toHaveAttribute('placeholder', placeholder);
    expect(input).toHaveValue(value);
  });

  it('should set maximum text length', () => {
    render(
      <ReviewTextInput
        label="Плюсы"
        placeholder="Введите текст"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'maxLength',
      String(REVIEW_TEXT_MAX_LENGTH),
    );
  });

  it('should display remaining characters count', () => {
    const value = 'Great cheesecake';

    render(
      <ReviewTextInput
        label="Плюсы"
        placeholder="Введите текст"
        value={value}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText(String(REVIEW_TEXT_MAX_LENGTH - value.length)),
    ).toBeInTheDocument();
  });

  it('should call onChange with new value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ReviewTextInput
        label="Плюсы"
        placeholder="Введите текст"
        value=""
        onChange={onChange}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'Отличный десерт');

    expect(onChange).toHaveBeenLastCalledWith('т');
    expect(onChange).toHaveBeenCalledTimes('Отличный десерт'.length);
  });

  it('should apply valid class when value is not empty and there is no error', () => {
    const { container } = render(
      <ReviewTextInput
        label="Плюсы"
        placeholder="Введите текст"
        value="Отличный десерт"
        onChange={vi.fn()}
      />,
    );

    expect(container.firstElementChild).toHaveClass('is-valid');
    expect(container.firstElementChild).not.toHaveClass('is-invalid');
  });

  it('should apply invalid class and display error', () => {
    const error = 'Введите текст';

    const { container } = render(
      <ReviewTextInput
        label="Плюсы"
        placeholder="Введите текст"
        value=""
        error={error}
        onChange={vi.fn()}
      />,
    );

    expect(container.firstElementChild).toHaveClass('is-invalid');
    expect(container.firstElementChild).not.toHaveClass('is-valid');
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('should not apply valid or invalid class when value is empty and there is no error', () => {
    const { container } = render(
      <ReviewTextInput
        label="Плюсы"
        placeholder="Введите текст"
        value=""
        onChange={vi.fn()}
      />,
    );

    expect(container.firstElementChild).not.toHaveClass('is-valid');
    expect(container.firstElementChild).not.toHaveClass('is-invalid');
  });
});
