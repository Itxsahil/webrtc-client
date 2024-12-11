import {Routes, Route} from "react-router-dom"
import Home from "./Pages/Home.jsx"
import Room from "./Pages/Room.jsx"
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </>
  )
}

export default App
