import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Account/Login';
import Home from './HomePage/Home';
import './App.css';
import Registration from './Account/Registration';
import { AuthProvider, useAuth } from './Account/authContext';
import MyTasks from './Overviews/MyTasks';
import TaskPage from './Tasks/TaskPage';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<RequireAuth><Home /></RequireAuth>} />
        <Route path='/login' element={<Login />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/overviews/mytasks' element={<MyTasks />} />
        <Route path="/tasks/:taskId" element={<TaskPage />} />

      </Routes>
    </AuthProvider>
  );
};

const RequireAuth = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;
