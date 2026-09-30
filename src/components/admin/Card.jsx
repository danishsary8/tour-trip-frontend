import React from 'react'
import { cx } from '../../utils/helpers'

const Card = ({ title, subtitle, icon: Icon, children, className }) => {
   return (
    <div
      className={cx(
        "bg-surface rounded-xl border border-border shadow-soft p-6",
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2.5 mb-5">
          {Icon && (
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary-ink flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </span>
          )}

          <div>
            <h3 className="text-[15px] font-semibold text-foreground font-display">
              {title}
            </h3>

            {subtitle && (
              <p className="text-[12.5px] text-muted font-body">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {children}
    </div>
  )
}

export default Card
