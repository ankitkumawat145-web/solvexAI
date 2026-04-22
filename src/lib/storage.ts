// Neural Storage Engine - Local Persistent Fallback
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  difficulty?: string;
  createdAt: string;
}

export interface Problem {
  id: string;
  problemText: string;
  data: any;
  createdAt: string;
}

const STORAGE_KEYS = {
  TASKS: "flowsynth_tasks",
  PROBLEMS: "flowsynth_problems"
};

export const NeuralStorage = {
  // Tasks
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },
  saveTask: (task: Omit<Task, 'id' | 'createdAt'>) => {
    const tasks = NeuralStorage.getTasks();
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([newTask, ...tasks]));
    return newTask;
  },
  updateTask: (id: string, updates: Partial<Task>) => {
    const tasks = NeuralStorage.getTasks();
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
  },
  deleteTask: (id: string) => {
    const tasks = NeuralStorage.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
  },

  // Problems
  getProblems: (): Problem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
    return data ? JSON.parse(data) : [];
  },
  saveProblem: (problemText: string, data: any) => {
    const problems = NeuralStorage.getProblems();
    const newProblem: Problem = {
      id: Math.random().toString(36).substring(2, 11),
      problemText,
      data,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify([newProblem, ...problems]));
    return newProblem;
  },
  getLatestProblem: (problemText: string) => {
    const problems = NeuralStorage.getProblems();
    return problems.find(p => p.problemText === problemText);
  }
};
