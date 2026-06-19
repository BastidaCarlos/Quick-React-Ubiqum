import React from 'react';
import './App.css';
import CourseList from './components/CourseList';
import { addScheduleTimes } from './utilities/time';
import { useData } from "./utilities/firebase.js";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import EditForm from "./EditForm.jsx";

const Banner = ({title}) => (
  <div className='text-center py-5 mb-5 bg-white rounded-3 shadow-sm border'>
    <h1 className='display-5 fw-bold text-dark mb-0'>{title}</h1>
  </div>
);

const Main = () => {
  const [schedule, loading, error] = useData('/schedule', addScheduleTimes);

  if (error) return <h1>{ error.message }</h1>;
  if (loading) return <h1>Loading the schedule...</h1>

  return (
    <div className='container py-5'>
      <Banner title={ schedule.title } />
        <Routes>
          <Route path='/' element={<CourseList courses={ schedule. courses } />} />
          <Route path='/edit' element={ <EditForm />} />
        </Routes>
    </div>
  )
}


const App = () => (
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);

export default App;