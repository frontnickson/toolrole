// Основные типы
export * from './user';
export * from './board';
export * from './notification';

// API типы
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  error?: string;
}

// Дополнительные типы для системы
export interface AppState {
  user: any; // UserState
  boards: any; // BoardState
  tasks: any; // TaskState
  notifications: any; // NotificationState
  teams: any; // TeamState
  friends: any; // FriendState
  ui: UIState;
}

// Состояние задач
export interface TaskState {
  tasks: any[]; // Task[]
  currentTask: any | null; // Task | null
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  searchQuery: string;
  selectedTasks: string[];
  taskHistory: any[]; // Activity[]
}

// Состояние уведомлений
export interface NotificationState {
  notifications: any[]; // Notification[]
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  settings: any | null; // UserNotificationSettings | null
  groups: any[]; // NotificationGroup[]
}

// Состояние команд
export interface TeamState {
  teams: any[]; // Team[]
  currentTeam: any | null; // Team | null
  isLoading: boolean;
  error: string | null;
  invitations: any[]; // TeamInvitation[]
  members: any[]; // TeamMember[]
}

// Состояние друзей
export interface FriendState {
  friends: any[]; // User[]
  friendRequests: any[]; // FriendRequest[]
  isLoading: boolean;
  error: string | null;
  searchResults: any[]; // User[]
  blockedUsers: string[];
}

// Состояние UI
export interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  modal: ModalState | null;
  toast: ToastState[];
  loading: LoadingState;
  dragAndDrop: DragAndDropState;
}

// Дополнительные типы для UI
export interface ModalState {
  type: 'createBoard' | 'editBoard' | 'createTask' | 'editTask' | 'inviteUser' | 'settings';
  isOpen: boolean;
  data?: unknown;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  isVisible: boolean;
}

export interface LoadingState {
  global: boolean;
  boards: boolean;
  tasks: boolean;
  user: boolean;
}

export interface DragAndDropState {
  isDragging: boolean;
  draggedItem: unknown;
  dropTarget: unknown;
  allowedDropZones: string[];
}

// Фильтры для задач
export interface TaskFilters {
  status: string[];
  priority: string[];
  assignee: string[];
  tags: string[];
  dueDate: {
    start?: Date;
    end?: Date;
    overdue: boolean;
  };
  createdBy: string[];
  hasAttachments: boolean;
  hasComments: boolean;
  isWatched: boolean;
}

// Приглашения
export interface TeamInvitation {
  id: string;
  teamId: string;
  invitedUserId: string;
  invitedByUserId: string;
  role: any; // TeamRole
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  respondedAt?: Date;
}

export interface BoardInvitation {
  id: string;
  boardId: string;
  invitedUserId: string;
  invitedByUserId: string;
  role: any; // BoardRole
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  respondedAt?: Date;
}

// Статистика и аналитика
export interface UserStats {
  userId: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalBoards: number;
  totalTeams: number;
  totalFriends: number;
  productivityScore: number;
  lastWeekActivity: number;
  thisWeekActivity: number;
}

export interface BoardStats {
  boardId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalMembers: number;
  totalComments: number;
  totalAttachments: number;
  averageCompletionTime: number;
  lastActivity: Date;
}
