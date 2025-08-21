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

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

// Друзья и социальные связи
export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  status: FriendshipStatus;
  createdAt: Date;
  acceptedAt?: Date;
}

export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  BLOCKED = 'blocked'
}

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

export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

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
  full_name?: string;
  bio?: string;
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
