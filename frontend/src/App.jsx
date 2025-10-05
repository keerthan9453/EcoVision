
import Main from "./Component/Main.jsx"
import SideBar from './Component/Sidebar.jsx'
import { useEffect, useState } from "react"
function App() {
  const[data,setData]=useState(null)
  const[loading,setLoading]=useState(false)
  const[showModal,setShowModal]=useState(false)
  function handleDisplayModal(){
     setShowModal(!showModal )
  }
  
  useEffect(()=> {
    const NASA_KEY= import.meta.env.VITE_NASA_APP_KEY
    async function fetchAPIData(){
      const url=''
console.log("url:",url)
      const today=(new Date()).toDateString()
      //Creates a string of today’s date
      const localKey=`NASA-${today}`
      //✅ Creates a unique key for localStorage using today’s date.

      if (localStorage.getItem(localKey)){
        //✅ Retrieves the stored data from localStorage.

        const apidata=JSON.parse(localStorage.getItem(localKey))
        console.log("data:",apidata)
        setData(apidata)
        console.log('fetched from cache today')
        
        return
      }
      
      localStorage.clear()
      try{
        const res=await fetch (url);
        const apidata=await res.json()
        /*fetch await is asking java to wait for the data from the api and res await is asking to wait for that data to be convert it to something usable  */
        localStorage.setItem(localKey,JSON.stringify(apidata))

        setData(apidata)
        console.log('fetched from API today')
        console.log('DATA\n',apidata)
      }
      catch(err){
        console.log(err.message)
  
      }
    }
    fetchAPIData()
   
  }
  ,[])
  return (
    <>
    
   
    {data ? (<Main data={data}/>):(
      <div className="loadingState">
        <i className="fa-solid fa-gear"></i>
      </div>
    )} 

    {showModal && (
      <SideBar data={data} handleDisplayModal={handleDisplayModal}/>)} 
     
    </>
  )
}

export default App