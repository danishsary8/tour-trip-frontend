import React from 'react'
import { ChevronDown } from "lucide-react";
import Label from "./Label";
import ErrorText from "./ErrorText";
import { cx } from '../../utils/helpers';

const SelectField = ({ label, required, error, children, ...props }) => {
  return (
        <div>
          <Label required={required}>{label}</Label>
          <div className="relative">
            <select
              {...props}
              className={cx(
                "w-full h-11 px-3.5 pr-9 rounded-lg border bg-surface text-[14px] font-body text-foreground appearance-none",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                error ? "border-danger/30" : "border-border hover:border-border"
              )}
            >
              {children}
            </select>
            <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <ErrorText>{error}</ErrorText>
        </div>
      )
}

export default SelectField
