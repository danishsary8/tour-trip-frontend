import React from 'react'
import Label from './Label';
import ErrorText from './ErrorText';
import { cx } from '../../utils/helpers';

const TextField = ({ label, required, error, ...props }) => {
  return (
    <div>
      <Label required={required}>{label}</Label>

      <input
        {...props}
        className={cx(
          "w-full h-11 px-3.5 rounded-lg border bg-surface text-[14px] font-body text-foreground placeholder:text-muted",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
          error
            ? "border-danger/30"
            : "border-border hover:border-border"
        )}
      />

      <ErrorText>{error}</ErrorText>
    </div>
  );
}

export default TextField
