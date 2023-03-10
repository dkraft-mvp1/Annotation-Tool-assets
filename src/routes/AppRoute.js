import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
function AppRoute () {
  return (
        <BrowserRouter>
            <Routes>
                {/* <Route exact path="" element={<RenderComponent component={Home}/>}/> */}

                <Route exact path="" element={<Home />} />
                {/* <Route path="*" component = {PageNotFound}/> */}
            </Routes>
        </BrowserRouter>
  )
}

export default AppRoute
