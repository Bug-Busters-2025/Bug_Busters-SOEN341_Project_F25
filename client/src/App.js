import {React,useEffect,useState} from 'react'

function App() {

  const [backendData, setBackendData] = useState([{}])
  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(data => {
        setBackendData(data)
      })
    },[])
  
  return (
    <div>
   < h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
    </div>
  )
}

export default App
