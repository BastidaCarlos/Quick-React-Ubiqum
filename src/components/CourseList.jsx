import React, { useState } from 'react';
import { getCourseTerm, terms } from '../utilities/time.js';
import Course from './Course.jsx';

const TermButton = ({term, setTerm, checked}) => (
  <>
    <input
     type='radio' 
     id={term} 
     className='btn-check' 
     autoComplete='off' 
     checked={checked}
     onChange={ () => setTerm(term) } />
    <label className="btn-term  btn btn-outline-primary px-4 py-2 rounded-pill fw-medium transitium-all shadow-sm" htmlFor={term}>
      { term }
    </label>
  </>
)

const TermSelector = ({term, setTerm}) => (
  <div className='d-flex flex-wrap gap-2 justify-content-center mb-5'>
    {
      Object.values(terms)
        .map(value => <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />)
    }
  </div>
)


const CourseList = ({ courses }) => {
  const [term, setTerm] = useState('Fall');
  const [selected, setSelected] = useState([]);
  const termCourses = Object.values(courses).filter( course => term === getCourseTerm(course)); 

  return (
    <>
      <TermSelector term={term} setTerm={setTerm}/>
      <div className='row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 justify-content-center'>
        { termCourses.map(course => (
          <div className='col' key={course.id}>
            <Course course={ course } selected={selected} setSelected={ setSelected } />
          </div>
        )) }
      </div>
    </>
  )
}

export default CourseList;