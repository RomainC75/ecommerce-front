import React from 'react'

import './style/spinner.css'

export const Spinner = () => {
  console.log("===>", new Array(10).fill(0))
  return (
    <div className="spinner">
      {(new Array(12).fill(0).map(x=><div></div>))}
    </div>
  )
}
