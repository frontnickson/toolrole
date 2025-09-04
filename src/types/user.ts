// Основные типы для пользователей
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

// Расширенный интерфейс пользователя с дополнительными полями
export interface ExtendedUser {
  // Основные данные
  id: number;
  email: string;
  username: string;
  accessToken?: string; // Токен аутентификации для API запросов
  
  // Личные данные
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthDate?: string;
  age?: number;
  
  // Профиль
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  timezone?: string;
  
  // Настройки
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'ru';
  
  // Статус
  isActive: boolean;
  isVerified: boolean;
  isSuperuser: boolean;
  isOnline: boolean;
  lastSeen?: string;
  
  // Даты
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  
  // Социальные связи
  friends: string[]; // ID друзей
  friendRequests: string[]; // ID входящих заявок
  teams: string[]; // ID команд
  
  // Уведомления
  notifications: string[]; // ID уведомлений
  unreadNotificationsCount: number;
  
  // Настройки уведомлений
  emailNotifications: boolean;
  pushNotifications: boolean;
  desktopNotifications: boolean;
  
  // Приватность
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
  
  // Дополнительные поля
  interests?: string[];
  skills?: string[];
  education?: string;
  occupation?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'ru';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
  taskUpdates: boolean;
  comments: boolean;
  mentions: boolean;
  dueDateReminders: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
}

export const UserRole = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  DELETED: 'deleted'
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

// Друзья и социальные связи
export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  status: FriendshipStatus;
  createdAt: Date;
  acceptedAt?: Date;
}

export const FriendshipStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  BLOCKED: 'blocked'
} as const;

export type FriendshipStatus = typeof FriendshipStatus[keyof typeof FriendshipStatus];

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

// Команды и права доступа
export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: TeamRole;
  joinedAt: Date;
  permissions: Permission[];
}

export const TeamRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
} as const;

export type TeamRole = typeof TeamRole[keyof typeof TeamRole];

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: 'board' | 'task' | 'comment' | 'team';
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

// Типы для аутентификации
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  
  // Личные данные
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birth_date?: string;
  
  // Профиль
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  phone_number?: string;
  country?: string;
  city?: string;
  timezone?: string;
  
  // Настройки
  theme?: 'light' | 'dark' | 'auto';
  language?: 'en' | 'ru';
  
  // Настройки уведомлений
  email_notifications?: boolean;
  push_notifications?: boolean;
  desktop_notifications?: boolean;
  
  // Приватность
  profile_visibility?: 'public' | 'friends' | 'private';
  show_online_status?: boolean;
  allow_friend_requests?: boolean;
  
  // Дополнительные поля
  interests?: string[];
  skills?: string[];
  education?: string;
  occupation?: string;
  company?: string;
  website?: string;
  
  // Социальные сети
  social_links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserResponse {
  user: User;
  token: string;
}

// Интерфейс для данных пользователя, приходящих с сервера (snake_case)
export interface UserServerResponse {
  id: number;
  email: string;
  username: string;
  
  // Личные данные
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  gender?: string;
  birth_date?: string;
  
  // Профиль
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  phone_number?: string;
  country?: string;
  city?: string;
  timezone?: string;
  
  // Настройки
  theme?: string;
  language?: string;
  
  // Статус
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
  is_online?: boolean;
  last_seen?: string;
  
  // Даты
  created_at: string;
  updated_at?: string;
  last_login?: string;
  
  // Социальные связи
  friends?: string[];
  friend_requests?: string[];
  teams?: string[];
  
  // Уведомления
  notifications?: string[];
  unread_notifications_count?: number;
  
  // Настройки уведомлений
  email_notifications?: boolean;
  push_notifications?: boolean;
  desktop_notifications?: boolean;
  
  // Приватность
  profile_visibility?: string;
  show_online_status?: boolean;
  allow_friend_requests?: boolean;
  
  // Дополнительные поля
  interests?: string[];
  skills?: string[];
  education?: string;
  occupation?: string;
  company?: string;
  website?: string;
  
  // Социальные сети
  social_links?: Record<string, string>;
}
