import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const schedule = {
  "title": "CS Courses for 2018-2019",
  "courses": {
    "F101": {
      "id": "F101",
      "meets": "MWF 11:00-11:50",
      "title": "Computer Scince: Concepts, Philosophy, and Connections"
    },
    "F110": {
      "id": "F110",
      "meets": "MWF 10:00-10:50",
      "title": "Intro Programming for non-majors"
    },
    "S313": {
      "id": "S313",
      "meets": "TuTh 15:30-16:50",
      "title": "Tangible Interaction Design and Learning"
    },
    "S314": {
      "id": "S314",
      "meets": "TuTh 9:30-10:50",
      "title": "Tech & Human Interaction"
    }
  }
};

const getCourseTerm = course => course.term;

const getCourseNumber = course => course.number;

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

const Banner = ({title}) => (
  <div className='text-center py-5 mb-5 bg-white rounded-3 shadow-sm border'>
    <h1 className='display-5 fw-bold text-dark mb-0'>{title}</h1>
  </div>
);

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

const toggle = (x, lst) => (
  lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const mapValues = (fn, obj) => (
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
);

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses)
});

const days = ['M', 'Tu', 'W', 'Th', 'F'];

const daysOverlap = (days1, days2) => (
  days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
  daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
  getCourseTerm(course1) === getCourseTerm(course2) && timeConflict(course1, course2)
);

const hasConflict = (course, selected) => (
  selected.some(selection => courseConflict(course, selection))
);

const Course = ({ course, selected, setSelected }) => {
  const isSelected = selected.includes(course);
  const isDisabled = !isSelected && hasConflict(course, selected);
  

  return (
    <div className={`card h-100 shadow-sm border-0 rounded-3 transition-hover ${ 
          isDisabled
          ? 'course-disabled'
          : 
          isSelected 
          ? 'course-selected' 
          : ''
    }`}
      onClick={isDisabled ? null : () => setSelected(toggle(course, selected)) }>
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

const fetcSchedule = async () => {
  const url = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php'
  const response = await fetch(url);
  if (!response.ok) throw response;
  return addScheduleTimes(await response.json());
}

const Main = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schedule'],
    queryFn: fetcSchedule
  });

  if (error) return <h1>{ error.message }</h1>;
  if (isLoading) return <h1>Loading the schedule...</h1>

  return (
    <div className='container py-5'>
      <Banner title={ data.title } />
      <CourseList courses={ data.courses } />
    </div>
  )
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Main />
  </QueryClientProvider>
);

export default App;