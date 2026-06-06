import { create } from 'zustand';
import type { Task, TaskTemplate, TaskTemplateItem, TimeSlot } from '@/types';
import { getChildTasks, setChildTasks, getTaskTemplates, setTaskTemplates, getAutoImportDate, setAutoImportDate } from '@/utils/storage';
import { getToday } from '@/utils/date';
import { DEFAULT_TASKS } from '@/utils/constants';
import { useAppStore } from './appStore';

interface TaskState {
  tasks: Task[];
  templates: TaskTemplate[];

  loadTasks: (childId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  importTemplateTasks: (childId: string, templateId: string) => void;
  importDefaultTasks: (childId: string) => void;
  autoImportDailyTasks: (childId: string) => void;
  loadTemplates: () => void;
  getTemplates: () => TaskTemplate[];
  addTemplate: (template: Omit<TaskTemplate, 'id' | 'createdAt'>) => void;
  updateTemplate: (id: string, data: Partial<TaskTemplate>) => void;
  deleteTemplate: (id: string) => void;
  addTemplateTask: (templateId: string, task: TaskTemplateItem) => void;
  updateTemplateTask: (templateId: string, taskIndex: number, data: Partial<TaskTemplateItem>) => void;
  deleteTemplateTask: (templateId: string, taskIndex: number) => void;
  reorderTemplates: (dragIndex: number, dropIndex: number) => void;
  getTodayTemplate: () => TaskTemplate | null;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getDefaultTemplates(): TaskTemplate[] {
  return [
    {
      id: generateId(),
      name: '工作日模板',
      description: '适用于周一到周五',
      applyDays: [1, 2, 3, 4, 5],
      tasks: [...DEFAULT_TASKS.map(t => ({ ...t }))],
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '周末模板',
      description: '适用于周六周日',
      applyDays: [6, 0],
      tasks: [
        { name: '认真刷牙', icon: '🪥', stampReward: 3, description: '早晚刷牙，每次2分钟', category: '生活', timeSlot: 'morning' as TimeSlot },
        { name: '跳绳锻炼', icon: '🏃', stampReward: 4, description: '跳绳100下或运动15分钟', category: '运动', timeSlot: 'morning' as TimeSlot },
        { name: '帮忙做家务', icon: '🧹', stampReward: 5, description: '主动帮助家人做家务', category: '生活', timeSlot: 'afternoon' as TimeSlot },
        { name: '阅读课外书', icon: '📚', stampReward: 5, description: '阅读30分钟以上', category: '学习', timeSlot: 'evening' as TimeSlot },
      ],
      createdAt: new Date().toISOString(),
    },
  ];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  templates: [],

  loadTasks: (childId) => {
    const list = getChildTasks(childId) as Task[];
    set({ tasks: list });
  },

  loadTemplates: () => {
    const templates = getTaskTemplates() as TaskTemplate[];
    if (templates.length > 0) {
      set({ templates });
    } else {
      const defaultTemplates = getDefaultTemplates();
      setTaskTemplates(defaultTemplates);
      set({ templates: defaultTemplates });
    }
  },

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().tasks, newTask];
    setChildTasks(newTask.childId, updated);
    set({ tasks: updated });
    useAppStore.getState().showToast('添加任务成功', 'success');
  },

  updateTask: (id, data) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = get().tasks.map((t) => (t.id === id ? { ...t, ...data } : t));
    setChildTasks(task.childId, updated);
    set({ tasks: updated });
    useAppStore.getState().showToast('更新成功', 'success');
  },

  deleteTask: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = get().tasks.filter((t) => t.id !== id);
    setChildTasks(task.childId, updated);
    set({ tasks: updated });
    useAppStore.getState().showToast('删除成功', 'success');
  },

  toggleTask: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = get().tasks.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t));
    setChildTasks(task.childId, updated);
    set({ tasks: updated });
  },

  importTemplateTasks: (childId, templateId) => {
    const existing = getChildTasks(childId) as Task[];
    const templates = getTaskTemplates() as TaskTemplate[];
    const template = templates.find((t) => t.id === templateId);
    if (!template) {
      useAppStore.getState().showToast('模板不存在', 'error');
      return;
    }
    const newTasks: Task[] = template.tasks.map((t) => ({
      ...t,
      id: generateId(),
      childId,
      enabled: true,
      createdAt: new Date().toISOString(),
    }));
    const combined = [...existing, ...newTasks];
    setChildTasks(childId, combined);
    set({ tasks: combined });
    useAppStore.getState().showToast('导入模板任务成功', 'success');
  },

  importDefaultTasks: (childId) => {
    const existing = getChildTasks(childId) as Task[];
    const todayTemplate = get().getTodayTemplate();
    const sourceTasks = todayTemplate ? todayTemplate.tasks : DEFAULT_TASKS;
    const newTasks: Task[] = sourceTasks.map((t) => ({
      ...t,
      id: generateId(),
      childId,
      enabled: true,
      createdAt: new Date().toISOString(),
    }));
    const combined = [...existing, ...newTasks];
    setChildTasks(childId, combined);
    set({ tasks: combined });
    useAppStore.getState().showToast('导入默认任务成功', 'success');
  },

  autoImportDailyTasks: (childId) => {
    const today = getToday();
    const lastImportDate = getAutoImportDate(childId);
    
    // 如果今天已经导入过，不再重复导入
    if (lastImportDate === today) {
      return;
    }
    
    const existing = getChildTasks(childId) as Task[];
    const todayTemplate = get().getTodayTemplate();
    
    // 如果没有匹配的模板，不自动导入
    if (!todayTemplate) {
      return;
    }
    
    // 清除之前的任务（可选，根据需求决定是否保留历史任务）
    // 这里选择保留历史任务，只添加新任务
    const newTasks: Task[] = todayTemplate.tasks.map((t) => ({
      ...t,
      id: generateId(),
      childId,
      enabled: true,
      createdAt: new Date().toISOString(),
    }));

    // 每天自动导入时替换旧任务，只保留当天模板的任务
    setChildTasks(childId, newTasks);
    setAutoImportDate(childId, today);
    set({ tasks: newTasks });
    useAppStore.getState().showToast(`已自动导入${todayTemplate.name}任务`, 'success');
  },

  getTemplates: () => {
    const templates = getTaskTemplates() as TaskTemplate[];
    return templates.length > 0 ? templates : getDefaultTemplates();
  },

  addTemplate: (template) => {
    const newTemplate: TaskTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const templates = getTaskTemplates() as TaskTemplate[];
    const updated = [...templates, newTemplate];
    setTaskTemplates(updated);
    set({ templates: updated });
    useAppStore.getState().showToast('添加模板成功', 'success');
  },

  updateTemplate: (id, data) => {
    const templates = getTaskTemplates() as TaskTemplate[];
    const updated = templates.map((t) => (t.id === id ? { ...t, ...data } : t));
    setTaskTemplates(updated);
    set({ templates: updated });
    useAppStore.getState().showToast('模板更新成功', 'success');
  },

  deleteTemplate: (id) => {
    const templates = getTaskTemplates() as TaskTemplate[];
    const updated = templates.filter((t) => t.id !== id);
    setTaskTemplates(updated);
    set({ templates: updated });
    useAppStore.getState().showToast('删除模板成功', 'success');
  },

  addTemplateTask: (templateId, task) => {
    const templates = getTaskTemplates() as TaskTemplate[];
    const updated = templates.map((t) =>
      t.id === templateId ? { ...t, tasks: [...t.tasks, task] } : t
    );
    setTaskTemplates(updated);
    set({ templates: updated });
    useAppStore.getState().showToast('添加任务成功', 'success');
  },

  updateTemplateTask: (templateId, taskIndex, data) => {
    const templates = getTaskTemplates() as TaskTemplate[];
    const updated = templates.map((t) => {
      if (t.id !== templateId) return t;
      const newTasks = [...t.tasks];
      if (taskIndex >= 0 && taskIndex < newTasks.length) {
        newTasks[taskIndex] = { ...newTasks[taskIndex], ...data };
      }
      return { ...t, tasks: newTasks };
    });
    setTaskTemplates(updated);
    set({ templates: updated });
    useAppStore.getState().showToast('任务更新成功', 'success');
  },

  deleteTemplateTask: (templateId, taskIndex) => {
    const templates = getTaskTemplates() as TaskTemplate[];
    const updated = templates.map((t) => {
      if (t.id !== templateId) return t;
      const newTasks = [...t.tasks];
      if (taskIndex >= 0 && taskIndex < newTasks.length) {
        newTasks.splice(taskIndex, 1);
      }
      return { ...t, tasks: newTasks };
    });
    setTaskTemplates(updated);
    set({ templates: updated });
    useAppStore.getState().showToast('删除任务成功', 'success');
  },

  reorderTemplates: (dragIndex, dropIndex) => {
    const templates = getTaskTemplates() as TaskTemplate[];
    if (dragIndex < 0 || dragIndex >= templates.length || dropIndex < 0 || dropIndex >= templates.length) {
      return;
    }
    const newTemplates = [...templates];
    const [draggedTemplate] = newTemplates.splice(dragIndex, 1);
    newTemplates.splice(dropIndex, 0, draggedTemplate);
    setTaskTemplates(newTemplates);
    set({ templates: newTemplates });
  },

  getTodayTemplate: () => {
    const templates = getTaskTemplates() as TaskTemplate[];
    const today = new Date().getDay();
    // 按模板顺序（索引）返回第一个匹配的模板
    return templates.find((t) => t.applyDays.includes(today)) || null;
  },
}));
