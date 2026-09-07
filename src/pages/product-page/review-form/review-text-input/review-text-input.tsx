import clsx from "clsx";
import { REVIEW_TEXT_MAX_LENGTH } from "../const";
import styles from "./review-text-input.module.css";

type TReviewTextInputProps = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

const ReviewTextInput = ({
  label,
  placeholder,
  value,
  error,
  onChange,
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>

    <span className="custom-input__counter">
      {REVIEW_TEXT_MAX_LENGTH - value.length}
    </span>

    {error && (
      <span className={clsx("custom-input__error", styles.error)}>{error}</span>
    )}
  </div>
);

export default ReviewTextInput;
