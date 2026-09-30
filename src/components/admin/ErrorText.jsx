import React from 'react'
import { AlertCircle } from "lucide-react";

const ErrorText = ({children}) => {
   if (!children) return null;
      return (
        <p className="mt-1.5 flex items-center gap-1 text-[12.5px] text-danger-ink font-body">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {children}
        </p>
      )
}

export default ErrorText
