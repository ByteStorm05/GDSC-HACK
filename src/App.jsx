import {  RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import AppLayout from "./layout/app-layout";
import LandingPage from "./pages/LandingPage";
import HotelsPage from "./pages/HotelsPage";
import ProtectedRoute from "./components/protected-route";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/hotels-page",
        element: (<ProtectedRoute><HotelsPage /></ProtectedRoute>),
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