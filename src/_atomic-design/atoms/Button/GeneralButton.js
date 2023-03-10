import React from 'react'
export default function GeneralButton (props) {
  return (
        <button {...props} >
         {props.content}
        </button>
  )
}
