import React, { useRef, useState } from 'react'

const OtpVerifyForm = ({ length = 6, onSubmit = () => {}, loading = false }) => {
  const [otp, setOtp] = useState(Array(length).fill(''))
  const inputRefs = useRef([])

  const handleChange = (value, index) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]

    newOtp[index] = digit
    setOtp(newOtp)

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()

    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length)

    const newOtp = [
      ...pasted.split(''),
      ...Array(length - pasted.length).fill(''),
    ]

    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, length) - 1]?.focus()
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const code = otp.join('')
    if (code.length === length) {
      onSubmit(code)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            aria-label={`OTP digit ${index + 1}`}
            onChange={(event) => handleChange(event.target.value, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={handlePaste}
            className="h-12 w-10 rounded-lg border border-slate-300 text-center text-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading || otp.join('').length !== length}
        className="w-full rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  )
}

export default OtpVerifyForm