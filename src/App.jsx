import {  RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import AppLayout from "./layout/app-layout";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/protected-route";
import Onboarding from "./pages/Onboarding";
import SavedHotelsPage from "./pages/SavedHotelsPage";
import VoiceSearchPage from "./pages/VoiceSearchPage";
import ChatPage from "./pages/ChatPage";


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: (<ProtectedRoute><Onboarding /></ProtectedRoute>),
      },
      {
        path: "/saved-hotels",
        element: (<ProtectedRoute><SavedHotelsPage /></ProtectedRoute>),
      },
      {
        path: "/voice",
        element: (<ProtectedRoute><VoiceSearchPage /></ProtectedRoute>),
      },
      {
        path: "/chat",
        element: (<ProtectedRoute><ChatPage /></ProtectedRoute>),
      },

      
    ],
  },
]);


const App = () => {
  return(
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme"> 
        <RouterProvider router={router} />
  </ThemeProvider>
   
  )
}



export default App;