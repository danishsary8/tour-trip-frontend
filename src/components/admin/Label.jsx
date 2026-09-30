import React from 'react';

const Label = ({ children, required }) => {
  return (
    <label className="block text-[13px] font-medium text-foreground mb-1.5 font-body">
      {children} {required && <span className="text-primary-ink">*</span>}
    </label>
  );
};

export default Label;
