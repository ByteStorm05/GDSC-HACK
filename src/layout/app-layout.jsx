import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="relative p-2">
      {/* Light gradient background */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-[#fdfbfb] to-[#ebedee] bg-fixed"></div>

      {/* Main content */}
      <main className="min-h-screen container mx-auto px-0">
        <Header />
        <div className="h-[68px]"></div>
        <Outlet />
      </main>

      <div className="p-10 text-center bg-gray-100 mt-10">
        Made with 💗
      </div>
    </div>
  );
};

export default AppLayout;
