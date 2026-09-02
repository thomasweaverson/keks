import clsx from "clsx";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { REVIEW_TEXT_MAX_LENGTH } from "../const";
import styles from "./review-text-input.module.css"

type TReviewTextInputProps = {
  label: string;
  placeholder: string;
  value: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
};

const ReviewTextInput = ({
  label,
  placeholder,
  value,
  error,
  registration,
}: TReviewTextInputProps) => (
  <div
    className={clsx("custom-input", styles.field, {
      "is-valid": !error && Boolean(value),
      "is-invalid": Boolean(error),
    })}
  >
    <label>
      <span className="custom-input__label">{label}</span>

      <input
        type="text"
        placeholder={placeholder}
        maxLength={REVIEW_TEXT_MAX_LENGTH}
        {...registration}
      />
    </label>

    <span className="custom-input__counter">
      {REVIEW_TEXT_MAX_LENGTH - value.length}
    </span>

    {error && (
      <span className={clsx("custom-input__error", styles.error)}>
        {error.message}
      </span>
    )}
  </div>
);

export default ReviewTextInput;
