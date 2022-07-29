import axios from 'axios'
import React, {useState, useEffect} from 'react'


import './style/navbar.css'

const base_url = "http://localhost:5005"

export default function Navbar() {
  const [list, setList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(()=>{
    axios.get(base_url+'/category/epicerieSalee')
      .then(ans=>console.log(ans.data))
  },[])

  return (
    <div className="Navbar">
      <p>!</p>
    </div>
  )
}
