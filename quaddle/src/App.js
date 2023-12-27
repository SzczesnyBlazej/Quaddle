import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Account/Login/Login';
import Home from './HomePage/Home';
import './App.css';
import Registration from './Account/Registration/Registration';
import { AuthProvider, useAuth } from './Account/AuthContext/authContext';
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

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path='/' element={<RequireAuth><Home /></RequireAuth>} />
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/userManager' element={<RouteGuard onlyAdmin={true}><AutoCompleteSearch /></RouteGuard>} />
          <Route path='/optionManager' element={<RouteGuard onlyAdmin={true}><OptionManager /></RouteGuard>} />
          <Route path='/overviews/mytasks' element={<RequireAuth><MyTasks /></RequireAuth>} />
          <Route path='/overviews/allOpenedTask' element={<RouteGuard><AllOpenedTask /></RouteGuard>} />
          <Route path='/overviews/myAssignedTasks' element={<RouteGuard><MyAssignedTasks /></RouteGuard>} />
          <Route path='/overviews/myClosedTasks' element={<RequireAuth><MyClosedTask /></RequireAuth>} />
          <Route path='/overviews/allUnallocated' element={<RouteGuard><AllUnallocated /></RouteGuard>} />
          <Route path='/overviews/favorities' element={<RequireAuth><Favorities /></RequireAuth>} />
          <Route path='/overviews/allInPendendTask' element={<RouteGuard><AllInPendendTask /></RouteGuard>} />
          <Route path="/tasks/:taskId" element={<RequireAuth><TaskPage /></RequireAuth>} />
          <Route path='*' element={<Navigate to="/" />} />

        </Routes>
      </NotificationProvider>
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
