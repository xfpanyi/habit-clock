import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ParentLogin() {
  const navigate = useNavigate();
  const { loginAsParent } = useAppStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    if (loginAsParent(password)) {
      navigate('/home');
    } else {
      setError('密码错误，请重试');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="家长登录" showBack />
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--color-primary)10' }}
          >
            <Lock className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">家长验证</h2>
          <p className="text-sm text-gray-400">请输入家长密码进入管理后台</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="请输入密码"
              className="w-full px-4 py-4 pr-12 rounded-2xl border-2 border-gray-200 text-base focus:outline-none focus:border-primary transition-colors"
              style={{ '--tw-border-opacity': 1 } as React.CSSProperties}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <p className="text-xs text-gray-400 text-center">默认密码: 123456</p>

          <button
            onClick={handleLogin}
            className="w-full py-4 rounded-2xl text-base font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            登录
          </button>
        </div>
      </div>
    </div>
  );
}
