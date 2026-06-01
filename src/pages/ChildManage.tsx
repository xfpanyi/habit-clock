import { useEffect, useState } from 'react';
import { useChildStore } from '@/stores/childStore';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';

export default function ChildManage() {
  const { children, loadChildren, addChild, updateChild, deleteChild } = useChildStore();
  const [showModal, setShowModal] = useState(false);
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl'>('girl');
  const [age, setAge] = useState(8);

  useEffect(() => {
    loadChildren();
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingChild) {
      updateChild(editingChild, { name: name.trim(), gender, age, theme: gender, avatar: gender === 'boy' ? '👦' : '👧' });
    } else {
      addChild({ name: name.trim(), avatar: gender === 'boy' ? '👦' : '👧', gender, age, theme: gender });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingChild(null);
    setName('');
    setGender('girl');
    setAge(8);
  };

  const handleEdit = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (!child) return;
    setEditingChild(childId);
    setName(child.name);
    setGender(child.gender);
    setAge(child.age);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen pb-4">
      <Navbar title="孩子管理" />
      <div className="px-5 pt-4 pb-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-xl text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-bold">添加孩子</span>
        </button>

        {children.length === 0 ? (
          <EmptyState message="还没有添加孩子" />
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <div key={child.id} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-card">
                <div className="text-3xl">{child.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800">{child.name}</h3>
                  <p className="text-xs text-gray-400">{child.age}岁 · {child.gender === 'boy' ? '男生' : '女生'} · ⭐{child.currentStamps}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(child.id)} className="p-2 rounded-lg hover:bg-gray-100">
                    <Pencil className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => deleteChild(child.id)} className="p-2 rounded-lg hover:bg-gray-100">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingChild ? '编辑孩子' : '添加孩子'}
        footer={
          <div className="flex gap-3">
            <button onClick={closeModal} className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">取消</button>
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}>保存</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">姓名</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入孩子姓名" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
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
                  onClick={() => setGender(g.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                    gender === g.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                  }`}
                  style={gender === g.value ? { borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary)05' } : {}}
                >
                  <span className="text-xl">{g.emoji}</span>
                  <span className="text-sm font-medium">{g.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">年龄</label>
            <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={3} max={18} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
