import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useChildStore } from '@/stores/childStore';
import { useEffect, useState } from 'react';
import { Baby, Shield, Plus, ChevronRight } from 'lucide-react';
import type { Child } from '@/types';
import Modal from '@/components/Modal';

export default function RoleSelect() {
  const navigate = useNavigate();
  const { setUserRole, setSelectedChild, setTheme } = useAppStore();
  const { children, loadChildren, addChild } = useChildStore();
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildGender, setNewChildGender] = useState<'boy' | 'girl'>('girl');
  const [newChildAge, setNewChildAge] = useState(8);

  useEffect(() => {
    loadChildren();
  }, []);

  const handleSelectChild = (child: Child) => {
    setUserRole('child');
    setSelectedChild(child.id);
    setTheme(child.theme);
    navigate('/home');
  };

  const handleParentLogin = () => {
    navigate('/parent-login');
  };

  const handleAddChild = () => {
    if (!newChildName.trim()) return;
    addChild({
      name: newChildName.trim(),
      avatar: newChildGender === 'boy' ? '👦' : '👧',
      gender: newChildGender,
      age: newChildAge,
      theme: newChildGender,
    });
    setShowAddChild(false);
    setNewChildName('');
    setNewChildGender('girl');
    setNewChildAge(8);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🌟</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">习惯养成打卡</h1>
        <p className="text-sm text-gray-500">每天进步一点点，养成好习惯</p>
      </div>

      {children.length > 0 && (
        <div className="w-full max-w-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">选择孩子</h2>
          <div className="space-y-3">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => handleSelectChild(child)}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 text-left"
              >
                <div className="text-3xl">{child.avatar}</div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-800">{child.name}</h3>
                  <p className="text-xs text-gray-400">{child.age}岁 · {child.gender === 'boy' ? '男生' : '女生'}</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-primary)10', color: 'var(--color-primary)' }}>
                  <span>⭐</span>
                  <span>{child.currentStamps}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => setShowAddChild(true)}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-200"
        >
          <Plus className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-500">添加新孩子</span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleParentLogin}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Shield className="w-5 h-5" />
            <span className="text-sm font-bold">我是家长</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={showAddChild}
        onClose={() => setShowAddChild(false)}
        title="添加孩子"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddChild(false)}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAddChild}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              添加
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">姓名</label>
            <input
              type="text"
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              placeholder="请输入孩子姓名"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              style={{ '--tw-ring-color': 'var(--color-primary)20' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">性别</label>
            <div className="flex gap-3">
              {[
                { value: 'boy' as const, label: '男生', emoji: '👦' },
                { value: 'girl' as const, label: '女生', emoji: '👧' },
              ].map((g) => (
                <button
                  key={g.value}
                  onClick={() => setNewChildGender(g.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                    newChildGender === g.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 bg-white'
                  }`}
                  style={newChildGender === g.value ? { borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary)05' } : {}}
                >
                  <span className="text-xl">{g.emoji}</span>
                  <span className="text-sm font-medium">{g.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">年龄</label>
            <input
              type="number"
              value={newChildAge}
              onChange={(e) => setNewChildAge(Number(e.target.value))}
              min={3}
              max={18}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              style={{ '--tw-ring-color': 'var(--color-primary)20' } as React.CSSProperties}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
