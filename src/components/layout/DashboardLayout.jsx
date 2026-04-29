import { Outlet } from 'react-router-dom';
import Header from './Header';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      <div className="flex flex-col min-h-screen w-full">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
