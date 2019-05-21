import React from "react"

function Buttton(props) {
  return (
      <button 
      className={`${props.className}`}
        onClick={props.onClick}>{props.text}</button>
  )
}
export default Buttton
