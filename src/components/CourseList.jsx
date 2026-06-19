import React, { useState } from 'react';
import { getCourseTerm, terms } from '../utilities/time.js';
import Course from './Course.jsx';
import { signInWithGoogle, signOut, useUserState } from '../utilities/firebase.js';

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

const SignInButton = () => (
  <button className='btn btn-light border px-4 py-2 rounded-pill fw-medium text-dark shadow-sm'
      onClick={() => signInWithGoogle()}>
    Sign In
  </button>
)

const SignOutButton = () => (
  <button className='btn btn-sm btn-outline-danger px-4 py-2 rounded-pill fw-medium shadow-sm'
      onClick={() => signOut()}>
    Sign Out
  </button>
)

const TermSelector = ({term, setTerm}) => {
  const [user] = useUserState();
  return (
    <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center gap-3 mb-5 w-100 px-2">
      <div className='d-flex flex-wrap gap-2 justify-content-center'>
        {
          Object.values(terms)
            .map(value => <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />)
        }
      </div>
      <div className='d-flex align-items-center my-auto'>
        { user ? <SignOutButton /> : <SignInButton /> }
      </div>
    </div>
  )
}


const CourseList = ({ courses }) => {
  const [term, setTerm] = useState('Fall');
  const [selected, setSelected] = useState([]);

  const validIds = Object.keys(courses);
  if (selected.some(c => !validIds.includes(c.id))) {
    setSelected([]);
  }

  const termCourses = Object.entries(courses)
    .filter(([id, course]) => term === getCourseTerm(course))
    .map(([id, course]) => ({...course, id}));

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