import React from "react";
import { getCourseTerm, getCourseNumber, hasConflict, toggle } from '../utilities/time.js';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useUserState } from "../utilities/firebase.js";

const Course = ({ course, selected, setSelected }) => {
  const isSelected = selected.some(c => c.id === course.id);
  const isDisabled = !isSelected && hasConflict(course, selected);
  const [user] = useUserState();

  const navigate = useNavigate();
  

  return (
    <div className={`card h-100 shadow-sm border-0 rounded-3 transition-hover ${ 
          isDisabled
          ? 'course-disabled'
          : 
          isSelected 
          ? 'course-selected' 
          : ''
    }`}
      onClick={isDisabled ? null : () => setSelected(toggle(course, selected)) }
      onDoubleClick={!user ? null : () => navigate('/edit', { state: course }) }>
      <div className='card-body d-flex flex-column justify-content-between p-4'>
        <div>
          <div className='card-title text-primary fw-bold mb-2 fs-5 text-uppercase tracking-wide'>{ getCourseTerm(course) } CS { getCourseNumber(course) }</div>
          <p className='card-text text-secondary fw-medium mb-3'>{ course.title }</p>
        </div>
        <div className='border-top pt-2 mt-2'>
          <span className='text-muted small d-flex align-items-center'>
            { course.meets }
          </span>
        </div>
      </div>
    </div>
  )
};

export default Course;