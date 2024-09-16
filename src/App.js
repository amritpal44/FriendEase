import { Route, Routes } from 'react-router-dom';
import './App.css';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className='h-screen'>

      <Routes>

        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/' element={<HomePage/>}/>

      </Routes>
    </div>
  );
}

export default App;
