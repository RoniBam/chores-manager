export interface User {
  id: number;
  name: string;
  email?: string;
  created_at: string;
}

export interface Chore {
  id: number;
  title: string;
  description?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  due_date: string;
  status: 'pending' | 'completed' | 'in_progress';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface CreateChoreData {
  title: string;
  description?: string;
  assigned_to?: number;
  due_date: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateChoreData extends CreateChoreData {
  status?: 'pending' | 'completed' | 'in_progress';
}