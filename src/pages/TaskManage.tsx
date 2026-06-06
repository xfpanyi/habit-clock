import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useTaskStore } from '@/stores/taskStore';
import { useChildStore } from '@/stores/childStore';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Sparkles, ChevronDown, ChevronUp, CalendarDays, GripVertical } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import type { TaskTemplate, TimeSlot } from '@/types';
import { TIME_SLOT_OPTIONS, WEEK_DAYS } from '@/utils/constants';

type TabType = 'child' | 'template';

export default function TaskManage() {
  const { selectedChildId } = useAppStore();
  const { children } = useChildStore();
  const {
    tasks, loadTasks, addTask, updateTask, deleteTask, toggleTask, importTemplateTasks,
    templates, loadTemplates, addTemplate, updateTemplate, deleteTemplate, addTemplateTask, updateTemplateTask, deleteTemplateTask, reorderTemplates,
  } = useTaskStore();

  const [activeTab, setActiveTab] = useState<TabType>('child');
  const [selectedChild, setSelectedChild] = useState(selectedChildId || '');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskIcon, setTaskIcon] = useState('⭐');
  const [taskReward, setTaskReward] = useState(5);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState('学习');
  const [taskTimeSlot, setTaskTimeSlot] = useState<TimeSlot>('morning');

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templateDays, setTemplateDays] = useState<number[]>([]);

  const [showTemplateTaskModal, setShowTemplateTaskModal] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [editingTemplateTaskIndex, setEditingTemplateTaskIndex] = useState<number | null>(null);
  const [ttName, setTtName] = useState('');
  const [ttIcon, setTtIcon] = useState('⭐');
  const [ttReward, setTtReward] = useState(5);
  const [ttDesc, setTtDesc] = useState('');
  const [ttCategory, setTtCategory] = useState('学习');
  const [ttTimeSlot, setTtTimeSlot] = useState<TimeSlot>('morning');

  const [showImportTemplateModal, setShowImportTemplateModal] = useState(false);
  const [importTemplateId, setImportTemplateId] = useState<string>('');

  // 同步 selectedChildId 变化
  useEffect(() => {
    if (selectedChildId) {
      setSelectedChild(selectedChildId);
    }
  }, [selectedChildId]);

  // 加载模板
  useEffect(() => {
    loadTemplates();
  }, []);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    reorderTemplates(draggingIndex, index);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  useEffect(() => {
    if (selectedChild && activeTab === 'child') {
      loadTasks(selectedChild);
    }
  }, [selectedChild, activeTab]);

  const handleSaveTask = () => {
    if (!taskName.trim() || !selectedChild) return;
    if (editingTask) {
      updateTask(editingTask, { name: taskName.trim(), icon: taskIcon, stampReward: taskReward, description: taskDesc, category: taskCategory, timeSlot: taskTimeSlot });
    } else {
      addTask({ childId: selectedChild, name: taskName.trim(), icon: taskIcon, stampReward: taskReward, description: taskDesc, enabled: true, category: taskCategory, timeSlot: taskTimeSlot });
    }
    closeTaskModal();
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setTaskName('');
    setTaskIcon('⭐');
    setTaskReward(5);
    setTaskDesc('');
    setTaskCategory('学习');
    setTaskTimeSlot('morning');
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    setEditingTask(taskId);
    setTaskName(task.name);
    setTaskIcon(task.icon);
    setTaskReward(task.stampReward);
    setTaskDesc(task.description);
    setTaskCategory(task.category);
    setTaskTimeSlot(task.timeSlot);
    setShowTaskModal(true);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    if (editingTemplate) {
      updateTemplate(editingTemplate, { name: templateName.trim(), description: templateDesc, applyDays: templateDays });
    } else {
      addTemplate({ name: templateName.trim(), description: templateDesc, applyDays: templateDays, tasks: [] });
    }
    closeTemplateModal();
  };

  const closeTemplateModal = () => {
    setShowTemplateModal(false);
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateDesc('');
    setTemplateDays([]);
  };

  const handleEditTemplate = (template: TaskTemplate) => {
    setEditingTemplate(template.id);
    setTemplateName(template.name);
    setTemplateDesc(template.description);
    setTemplateDays(template.applyDays);
    setShowTemplateModal(true);
  };

  const handleSaveTemplateTask = () => {
    if (!ttName.trim() || !activeTemplateId) return;
    if (editingTemplateTaskIndex !== null) {
      updateTemplateTask(activeTemplateId, editingTemplateTaskIndex, { name: ttName.trim(), icon: ttIcon, stampReward: ttReward, description: ttDesc, category: ttCategory, timeSlot: ttTimeSlot });
    } else {
      addTemplateTask(activeTemplateId, { name: ttName.trim(), icon: ttIcon, stampReward: ttReward, description: ttDesc, category: ttCategory, timeSlot: ttTimeSlot });
    }
    closeTemplateTaskModal();
  };

  const closeTemplateTaskModal = () => {
    setShowTemplateTaskModal(false);
    setActiveTemplateId(null);
    setEditingTemplateTaskIndex(null);
    setTtName('');
    setTtIcon('⭐');
    setTtReward(5);
    setTtDesc('');
    setTtCategory('学习');
    setTtTimeSlot('morning');
  };

  const handleEditTemplateTask = (templateId: string, index: number, task: { name: string; icon: string; stampReward: number; description: string; category: string; timeSlot: TimeSlot }) => {
    setActiveTemplateId(templateId);
    setEditingTemplateTaskIndex(index);
    setTtName(task.name);
    setTtIcon(task.icon);
    setTtReward(task.stampReward);
    setTtDesc(task.description);
    setTtCategory(task.category);
    setTtTimeSlot(task.timeSlot);
    setShowTemplateTaskModal(true);
  };

  const toggleDay = (day: number) => {
    setTemplateDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.timeSlot]) acc[task.timeSlot] = [];
    acc[task.timeSlot].push(task);
    return acc;
  }, {} as Record<TimeSlot, typeof tasks>);

  return (
    <div className="min-h-screen pb-4">
      <Navbar title="任务管理" />
      <div className="px-5 pt-4 pb-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('child')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'child' ? 'text-white shadow-md' : 'bg-white text-gray-500 shadow-card'}`}
            style={activeTab === 'child' ? { backgroundColor: 'var(--color-primary)' } : {}}
          >
            孩子任务
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'template' ? 'text-white shadow-md' : 'bg-white text-gray-500 shadow-card'}`}
            style={activeTab === 'template' ? { backgroundColor: 'var(--color-primary)' } : {}}
          >
            任务模板
          </button>
        </div>

        {activeTab === 'child' && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="">选择孩子</option>
                {children.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                onClick={() => selectedChild && setShowImportTemplateModal(true)}
                className="px-4 py-3 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                disabled={!selectedChild}
                title="导入任务模板"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-3 rounded-xl text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
                disabled={!selectedChild}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {tasks.length === 0 ? (
              <EmptyState message="还没有任务" />
            ) : (
              <div className="space-y-4">
                {(['morning', 'afternoon', 'evening'] as TimeSlot[]).map((slot) => {
                  const slotTasks = groupedTasks[slot] || [];
                  if (slotTasks.length === 0) return null;
                  const slotLabel = TIME_SLOT_OPTIONS.find((s) => s.value === slot);
                  return (
                    <div key={slot}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{slotLabel?.icon}</span>
                        <h3 className="text-sm font-bold text-gray-600">{slotLabel?.label}</h3>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>
                      <div className="space-y-2">
                        {slotTasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-card">
                            <div className="text-2xl">{task.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className={`text-sm font-semibold truncate ${task.enabled ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                                  {task.name}
                                </h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{task.category}</span>
                              </div>
                              <p className="text-xs text-gray-400 truncate">{task.description}</p>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-primary)10', color: 'var(--color-primary)' }}>
                              <span>⭐</span>
                              <span>{task.stampReward}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => toggleTask(task.id)} className="p-2 rounded-lg hover:bg-gray-100">
                                {task.enabled ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-gray-300" />}
                              </button>
                              <button onClick={() => handleEditTask(task.id)} className="p-2 rounded-lg hover:bg-gray-100">
                                <Pencil className="w-4 h-4 text-gray-400" />
                              </button>
                              <button onClick={() => deleteTask(task.id)} className="p-2 rounded-lg hover:bg-gray-100">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'template' && (
          <>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-xl text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-bold">添加模板</span>
            </button>

            <div className="space-y-3">
              {templates.map((template, index) => (
                <div
                  key={template.id}
                  className={`bg-white rounded-2xl shadow-card overflow-hidden transition-all ${draggingIndex === index ? 'opacity-60 ring-2 ring-primary' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                  >
                    <div
                      className="p-1 rounded-lg hover:bg-gray-100 cursor-grab active:cursor-grabbing"
                      onClick={(e) => e.stopPropagation()}
                      title="拖动排序"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <CalendarDays className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-800">{template.name}</h3>
                      <p className="text-xs text-gray-400">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {template.applyDays.map((d) => (
                        <span key={d} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {WEEK_DAYS.find((wd) => wd.value === d)?.label}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditTemplate(template); }}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                    {expandedTemplate === template.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {expandedTemplate === template.id && (
                    <div className="px-4 pb-4">
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">模板任务 ({template.tasks.length})</span>
                          <button
                            onClick={() => { setActiveTemplateId(template.id); setShowTemplateTaskModal(true); }}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-white"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            <Plus className="w-3 h-3" />
                            添加
                          </button>
                        </div>
                        {template.tasks.length === 0 ? (
                          <p className="text-xs text-gray-400 py-2">暂无任务</p>
                        ) : (
                          <div className="space-y-2">
                            {template.tasks.map((task, index) => {
                              const slotLabel = TIME_SLOT_OPTIONS.find((s) => s.value === task.timeSlot);
                              return (
                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                                  <div className="text-xl">{task.icon}</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs font-medium text-gray-700">{task.name}</span>
                                      <span className="text-[10px] px-1 py-0.5 rounded bg-white text-gray-400">{slotLabel?.label}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 truncate">{task.description}</p>
                                  </div>
                                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'var(--color-primary)10', color: 'var(--color-primary)' }}>
                                    <span>⭐</span>
                                    <span>{task.stampReward}</span>
                                  </div>
                                  <button
                                    onClick={() => handleEditTemplateTask(template.id, index, task)}
                                    className="p-1 rounded hover:bg-white"
                                  >
                                    <Pencil className="w-3 h-3 text-gray-400" />
                                  </button>
                                  <button
                                    onClick={() => deleteTemplateTask(template.id, index)}
                                    className="p-1 rounded hover:bg-white"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-400" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {children.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">导入到孩子</p>
                            <div className="flex flex-wrap gap-2">
                              {children.map((child) => (
                                <button
                                  key={child.id}
                                  onClick={() => importTemplateTasks(child.id, template.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                  {child.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={showTaskModal}
        onClose={closeTaskModal}
        title={editingTask ? '编辑任务' : '添加任务'}
        footer={
          <div className="flex gap-3">
            <button onClick={closeTaskModal} className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">取消</button>
            <button onClick={handleSaveTask} className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}>保存</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">任务名称</label>
            <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="如：完成作业" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">图标</label>
              <input type="text" value={taskIcon} onChange={(e) => setTaskIcon(e.target.value)} placeholder="emoji" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary text-center text-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">奖励印章</label>
              <input type="number" value={taskReward} onChange={(e) => setTaskReward(Number(e.target.value))} min={1} max={100} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">时段</label>
            <div className="flex gap-2">
              {TIME_SLOT_OPTIONS.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => setTaskTimeSlot(slot.value)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    taskTimeSlot === slot.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                  }`}
                  style={taskTimeSlot === slot.value ? { borderColor: 'var(--color-primary)' } : {}}
                >
                  <span>{slot.icon}</span>
                  <span>{slot.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">分类</label>
            <input type="text" value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)} placeholder="如：学习、生活、运动" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">描述</label>
            <input type="text" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder="任务描述" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTemplateModal}
        onClose={closeTemplateModal}
        title={editingTemplate ? '编辑模板' : '添加模板'}
        footer={
          <div className="flex gap-3">
            <button onClick={closeTemplateModal} className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">取消</button>
            <button onClick={handleSaveTemplate} className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}>保存</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">模板名称</label>
            <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="如：工作日模板" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">描述</label>
            <input type="text" value={templateDesc} onChange={(e) => setTemplateDesc(e.target.value)} placeholder="模板描述" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">应用日期</label>
            <div className="flex flex-wrap gap-2">
              {WEEK_DAYS.map((day) => (
                <button
                  key={day.value}
                  onClick={() => toggleDay(day.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    templateDays.includes(day.value)
                      ? 'text-white'
                      : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                  style={templateDays.includes(day.value) ? { backgroundColor: 'var(--color-primary)' } : {}}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTemplateTaskModal}
        onClose={closeTemplateTaskModal}
        title={editingTemplateTaskIndex !== null ? '编辑模板任务' : '添加模板任务'}
        footer={
          <div className="flex gap-3">
            <button onClick={closeTemplateTaskModal} className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">取消</button>
            <button onClick={handleSaveTemplateTask} className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}>保存</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">任务名称</label>
            <input type="text" value={ttName} onChange={(e) => setTtName(e.target.value)} placeholder="如：完成作业" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">图标</label>
              <input type="text" value={ttIcon} onChange={(e) => setTtIcon(e.target.value)} placeholder="emoji" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary text-center text-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">奖励印章</label>
              <input type="number" value={ttReward} onChange={(e) => setTtReward(Number(e.target.value))} min={1} max={100} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">时段</label>
            <div className="flex gap-2">
              {TIME_SLOT_OPTIONS.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => setTtTimeSlot(slot.value)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    ttTimeSlot === slot.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                  }`}
                  style={ttTimeSlot === slot.value ? { borderColor: 'var(--color-primary)' } : {}}
                >
                  <span>{slot.icon}</span>
                  <span>{slot.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">分类</label>
            <input type="text" value={ttCategory} onChange={(e) => setTtCategory(e.target.value)} placeholder="如：学习、生活、运动" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">描述</label>
            <input type="text" value={ttDesc} onChange={(e) => setTtDesc(e.target.value)} placeholder="任务描述" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showImportTemplateModal}
        onClose={() => { setShowImportTemplateModal(false); setImportTemplateId(''); }}
        title="选择要导入的模板"
        footer={
          <div className="flex gap-3">
            <button onClick={() => { setShowImportTemplateModal(false); setImportTemplateId(''); }} className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">取消</button>
            <button
              onClick={() => {
                if (importTemplateId && selectedChild) {
                  importTemplateTasks(selectedChild, importTemplateId);
                  setShowImportTemplateModal(false);
                  setImportTemplateId('');
                }
              }}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
              disabled={!importTemplateId}
            >
              导入
            </button>
          </div>
        }
      >
        <div className="space-y-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setImportTemplateId(template.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                importTemplateId === template.id ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
              }`}
              style={importTemplateId === template.id ? { borderColor: 'var(--color-primary)' } : {}}
            >
              <CalendarDays className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800">{template.name}</h4>
                <p className="text-xs text-gray-400">{template.description}</p>
              </div>
              <div className="flex items-center gap-1">
                {template.applyDays.map((d) => (
                  <span key={d} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                    {WEEK_DAYS.find((wd) => wd.value === d)?.label}
                  </span>
                ))}
              </div>
            </button>
          ))}
          {templates.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">暂无任务模板</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
