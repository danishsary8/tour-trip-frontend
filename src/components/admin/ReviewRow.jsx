import React from 'react'

const ReviewRow = ({ label, value }) => {
   return (
        <div className="flex justify-between gap-4 py-2 border-b border-border last:border-0">
          <span className="text-[13px] text-muted font-body">{label}</span>
          <span className="text-[13px] text-foreground font-medium font-body text-right">{value || "—"}</span>
        </div>
      )
}

export default ReviewRow
