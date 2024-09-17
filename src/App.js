import { Route, Routes } from 'react-router-dom';
import './App.css';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import HomePage from './pages/HomePage';
import ManageRequest from './pages/ManageRequest';
import ManageFriends from './pages/ManageFriends';

function App() {
  return (
    <div className='h-screen'>

      <Routes>

        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/manageRequest' element={<ManageRequest/>}/>
        <Route path='/manageFriends' element={<ManageFriends/>}/>

      </Routes>
    </div>
  );
}

export default App;
