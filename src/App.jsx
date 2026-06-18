import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import CourseList from './components/courseList';
import { addScheduleTimes } from './utilities/time';

const Banner = ({title}) => (
  <div className='text-center py-5 mb-5 bg-white rounded-3 shadow-sm border'>
    <h1 className='display-5 fw-bold text-dark mb-0'>{title}</h1>
  </div>
);

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