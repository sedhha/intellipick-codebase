import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';

import HomePage from './features/HomePage/HomePage';
import PageNotFound from './features/PageNotFound/PageNotFound';
import ProfilePage from './features/ProfilePage/ProfilePage';

import { useSelector } from 'react-redux';
import { userInfo } from './slices/slices/userInfoSlice';
// import { socket_uri } from './app/backend';
const EmailComponent = React.lazy(() =>
  import('./features/Emails/EmailComponent')
);
function App() {
  const isAuthenticated = useSelector(userInfo).isAuthenticated;
  let RenderComponent;

  if (isAuthenticated) {
    RenderComponent = (
      <>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route
            path='/get-emails-from-pdf'
            element={<div>Results Here</div>}></Route>
          <Route path='/*' element={<PageNotFound />}></Route>
          <Route path='/profiles/*' element={<ProfilePage />}></Route>
        </Routes>
      </>
    );
  } else
    RenderComponent = (
      <>
        <Routes>
          <Route path='/*' element={<HomePage />}></Route>
          <Route
            path='/get-emails-from-pdf'
            element={
              <React.Suspense fallback={<div>Loading</div>}>
                <EmailComponent />
              </React.Suspense>
            }></Route>

          {/* {          <Route path='/*' element={<PageNotFound />}></Route>*/}
          {/* {<Route path='/profiles/*' element={<ProfilePage />}></Route>} */}
        </Routes>
      </>
    );
  return RenderComponent;
}

export default App;
