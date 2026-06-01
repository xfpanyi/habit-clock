import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useChildStore } from '@/stores/childStore';
import { LogOut, Palette, UsersRound, Lock, ChevronRight, Baby } from 'lucide-react';
import Modal from '@/components/Modal';
import { useState } from 'react';
import { hashPassword } from '@/utils/crypto';
import { setParentPassword } from '@/utils/storage';

export default function Profile() {
  const navigate = useNavigate();
  const { userRole, theme, setTheme, logout } = useAppStore();
  const { currentChild, children } = useChildStore();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleThemeChange = (newTheme: 'boy' | 'girl') => {
    setTheme(newTheme);
    if (currentChild) {
      const updatedChildren = children.map((c) =>
        c.id === currentChild.id ? { ...c, theme: newTheme } : c
      );
      localStorage.setItem('childList', JSON.stringify(updatedChildren));
    }
  };

  const handleChangePassword = () => {
    setPasswordError('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('请填写所有字段');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }
    const savedPassword = localStorage.getItem('parentPassword');
    const targetHash = savedPassword || hashPassword('123456');
    if (hashPassword(oldPassword) !== targetHash) {
      setPasswordError('原密码错误');
      return;
    }
    setParentPassword(hashPassword(newPassword));
    setShowChangePassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    useAppStore.getState().showToast('密码修改成功', 'success');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchRole = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">个人中心</h1>

        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-card mb-5">
          <div className="text-5xl">{userRole === 'parent' ? '👨‍👩‍👧‍👦' : currentChild?.avatar || '👶'}</div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {userRole === 'parent' ? '家长' : currentChild?.name || '小朋友'}
            </h2>
            <p className="text-sm text-gray-400">
              {userRole === 'parent' ? '管理后台' : `${currentChild?.age || 0}岁 · ${currentChild?.gender === 'boy' ? '男生' : '女生'}`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-5">
          <div className="p-4 border-b border-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <Palette className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              <span className="text-sm font-semibold text-gray-700">主题切换</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleThemeChange('girl')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  theme === 'girl'
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <span className="text-xl">🌸</span>
                <span className="text-sm font-medium">粉色</span>
              </button>
              <button
                onClick={() => handleThemeChange('boy')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  theme === 'boy'
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <span className="text-xl">🚀</span>
                <span className="text-sm font-medium">蓝色</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleSwitchRole}
            className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <UsersRound className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">切换角色</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          {userRole === 'parent' && (
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">修改密码</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          )}

          {userRole === 'parent' && (
            <button
              onClick={() => navigate('/redeem-records')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Baby className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">兑换记录</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white rounded-2xl shadow-card text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-bold">退出登录</span>
        </button>
      </div>

      <Modal
        isOpen={showChangePassword}
        onClose={() => { setShowChangePassword(false); setPasswordError(''); }}
        title="修改密码"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => { setShowChangePassword(false); setPasswordError(''); }}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleChangePassword}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              确认修改
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">原密码</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="请输入原密码"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">新密码</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="请输入新密码"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">确认新密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入新密码"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
