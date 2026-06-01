import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useChildStore } from '@/stores/childStore';
import TabBar from '@/components/TabBar';
import Toast from '@/components/Toast';
import RoleSelect from '@/pages/RoleSelect';
import ParentLogin from '@/pages/ParentLogin';
import Home from '@/pages/Home';
import Stamps from '@/pages/Stamps';
import Redeem from '@/pages/Redeem';
import Profile from '@/pages/Profile';
import TaskManage from '@/pages/TaskManage';
import ProductManage from '@/pages/ProductManage';
import ChildManage from '@/pages/ChildManage';
import ConfirmRedeem from '@/pages/ConfirmRedeem';
import RedeemRecords from '@/pages/RedeemRecords';

function AppInitializer() {
  const { init } = useAppStore();
  const { loadChildren } = useChildStore();

  useEffect(() => {
    init();
    loadChildren();
  }, []);

  return null;
}

function Layout() {
  const location = useLocation();
  const { userRole } = useAppStore();

  const showTabBar = ['/home', '/stamps', '/redeem', '/profile'].includes(location.pathname);
  const isPublicPage = ['/', '/parent-login'].includes(location.pathname);

  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/parent-login" element={<ParentLogin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/stamps" element={<Stamps />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/task-manage" element={userRole === 'parent' ? <TaskManage /> : <Navigate to="/home" replace />} />
        <Route path="/product-manage" element={userRole === 'parent' ? <ProductManage /> : <Navigate to="/home" replace />} />
        <Route path="/child-manage" element={userRole === 'parent' ? <ChildManage /> : <Navigate to="/home" replace />} />
        <Route path="/confirm-redeem" element={userRole === 'parent' ? <ConfirmRedeem /> : <Navigate to="/home" replace />} />
        <Route path="/redeem-records" element={userRole === 'parent' ? <RedeemRecords /> : <Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      {showTabBar && <TabBar />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer />
      <Layout />
    </BrowserRouter>
  );
}
