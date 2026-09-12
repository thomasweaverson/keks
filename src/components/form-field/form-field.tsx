import clsx from 'clsx';
import type { ChangeEventHandler, FocusEventHandler } from 'react';
import styles from './form-field.module.css';

type TFormFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password';
  value: string;
  error?: string;
  touched: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
};

const FormField = ({
  name,
  label,
  placeholder,
  type,
  value,
  error,
  touched,
  disabled = false,
  className,
  autoComplete,
  onChange,
  onBlur,
}: TFormFieldProps) => {
  const errorId = `${name}-error`;

  const isInvalid = touched && Boolean(error);
  const isValid = touched && !error && Boolean(value);

  return (
    <div
      className={clsx(styles.field, className, {
        'is-invalid': isInvalid,
        'is-valid': isValid,
      })}
    >
      <label>
        <span className="custom-input__label">{label}</span>

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </label>

      {error && touched && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};

export default FormField;
