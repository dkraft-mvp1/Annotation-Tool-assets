import React from 'react'

export default function ButtonPrimary ({ className, onClick, text, disabled }) {
  return (
        <button
            onClick={onClick}
            className={` ${className} w-56 h-14 block rounded-md text-white ${disabled ? 'bg-app-grey cursor-not-allowed' : 'bg-app-primary cursor-pointer'}`}
            disabled={disabled}
        >
            {text}
        </button>
  )
}
