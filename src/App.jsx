import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './route/router'
import 'react-quill/dist/quill.snow.css';
import 'react-circular-progressbar/dist/styles.css';
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-datetime/css/react-datetime.css";
import NavigationProvider from './contentApi/navigationProvider';
import SideBarToggleProvider from './contentApi/sideBarToggleProvider';
import ThemeCustomizer from './components/shared/ThemeCustomizer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {

  return (
    <>
      <NavigationProvider>
        <SideBarToggleProvider>
          <RouterProvider router={router}>
          </RouterProvider>
        </SideBarToggleProvider>
      </NavigationProvider>

      <ToastContainer position="top-right" autoClose={3000} />
      <ThemeCustomizer />
    </>
  )
}

export default App