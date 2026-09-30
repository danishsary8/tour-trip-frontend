import React from 'react'
import { cx } from '../../utils/helpers'

const Chip = ({ active, onClick, children }) => {
  return (
          <button
            type="button"
            onClick={onClick}
            className={cx(
              "px-3.5 py-2 rounded-lg text-[13px] font-medium font-body border transition-all duration-150",
              active
                ? "bg-primary border-primary text-white shadow-sm"
                : "bg-surface border-border text-muted hover:border-primary/20 hover:text-primary-ink"
            )}
          >
            {children}
          </button>
        )
}

export default Chip
