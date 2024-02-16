import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Account/Login/Login';
import Home from './HomePage/Home';
import './App.css';
import Registration from './Account/Registration/Registration';
import MyTasks from './Overviews/MyTasks';
import TaskPage from './Tasks/TaskPage';
import AllOpenedTask from './Overviews/AllOpenedTask';
import MyClosedTask from './Overviews/MyClosedTask';
import AllUnallocated from './Overviews/AllUnallocated';
import { NotificationProvider } from './Functions/NotificationContext';
import AllInPendendTask from './Overviews/AllInPendendTask';
import Favorities from './Overviews/Favorities';
import AutoCompleteSearch from './Account/UserManagement/AutoCompleteSearch';
import RouteGuard from './Account/AuthContext/RouteGuard';
import MyAssignedTasks from './Overviews/MyAssignedTasks';
import OptionManager from './Account/OptionManagement/OptionManager';
import AllClossedTask from './Overviews/AllClossedTask';
import GlobalClickDetector from './Account/AuthContext/GlobalClickDetector';
import ApplicationConfig from './Account/ApplicationConfig/ApplicationConfig';
import { AuthProvider } from './Account/AuthContext/authContext';
import RequireAuth from './Account/AuthContext/RequireAuth';

const App = () => {
  const handleGlobalClick = () => {
    localStorage.setItem('lastActivityTime', new Date().getTime().toString());
  };

  return (
    <GlobalClickDetector onGlobalClick={handleGlobalClick}>
      <NotificationProvider>
        <AuthProvider>

          <Routes>
            <Route path='/' element={<RequireAuth><Home /></RequireAuth>} />
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/userManager' element={<RequireAuth><RouteGuard onlyAdmin={true}><AutoCompleteSearch /></RouteGuard></RequireAuth>} />
            <Route path='/optionManager' element={<RequireAuth><RouteGuard onlyAdmin={true}><OptionManager /></RouteGuard></RequireAuth>} />
            <Route path='/applicationConfig' element={<RequireAuth><RouteGuard onlyAdmin={true}><ApplicationConfig /></RouteGuard></RequireAuth>} />
            <Route path='/overviews/mytasks' element={<RequireAuth><MyTasks /></RequireAuth>} />
            <Route path='/overviews/allOpenedTask' element={<RouteGuard><RequireAuth><AllOpenedTask /></RequireAuth></RouteGuard>} />
            <Route path='/overviews/myAssignedTasks' element={<RouteGuard><RequireAuth><MyAssignedTasks /></RequireAuth></RouteGuard>} />
            <Route path='/overviews/myClosedTasks' element={<RequireAuth><MyClosedTask /></RequireAuth>} />
            <Route path='/overviews/allClosedTask' element={<RouteGuard><RequireAuth><AllClossedTask /></RequireAuth></RouteGuard>} />
            <Route path='/overviews/allUnallocated' element={<RouteGuard><RequireAuth><AllUnallocated /></RequireAuth></RouteGuard>} />
            <Route path='/overviews/favorities' element={<RequireAuth><Favorities /></RequireAuth>} />
            <Route path='/overviews/allInPendendTask' element={<RouteGuard><RequireAuth><AllInPendendTask /></RequireAuth></RouteGuard>} />
            <Route path="/tasks/:taskId" element={<RequireAuth><TaskPage /></RequireAuth>} />
            <Route path='*' element={<RequireAuth><Navigate to="/" /></RequireAuth>} />
          </Routes>
        </AuthProvider>

      </NotificationProvider>
    </GlobalClickDetector>
  );
};



export default App;
