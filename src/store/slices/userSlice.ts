import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
  profession?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

// Состояние пользователя
export interface UserState {
  // Основные данные пользователя
  currentUser: ExtendedUser | null;

  // Статус аутентификации
  isAuthenticated: boolean;

  // Статус загрузки
  isLoading: boolean;

  // Ошибки
  error: string | null;

  // Временные данные для форм (не сохраняются в store)
  tempUserData: Partial<ExtendedUser>;
}

// Начальное состояние
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tempUserData: {
    // Базовые данные пользователя по умолчанию
    // Эти данные будут использоваться как шаблон для новых пользователей

    // Основные данные
    email: '',
    username: '',

    // Личные данные
    firstName: '',
    lastName: '',
    middleName: '',
    gender: 'prefer_not_to_say',
    birthDate: '',
    age: undefined,

    // Профиль
    bio: '',
    avatarUrl: '',
    phoneNumber: '',
    country: '',
    city: '',
    timezone: '',

    // Настройки по умолчанию
    theme: 'light',
    language: 'ru',

    // Статус по умолчанию
    isActive: true,
    isVerified: false,
    isSuperuser: false,
    isOnline: false,

    // Даты
    createdAt: new Date().toISOString(),
    updatedAt: undefined,
    lastLogin: undefined,

    // Социальные связи (пустые массивы)
    friends: [],
    friendRequests: [],
    teams: [],

    // Уведомления
    notifications: [],
    unreadNotificationsCount: 0,

    // Настройки уведомлений по умолчанию
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: true,

    // Приватность по умолчанию
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowFriendRequests: true,

    // Дополнительные поля
    interests: [],
    skills: [],
    education: '',
    occupation: '',
    profession: '',
    company: '',
    website: '',

    // Социальные сети (пустые)
    socialLinks: {
      twitter: '',
      linkedin: '',
      github: '',
      instagram: '',
    },
  },
};

// Создаем slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Установка пользователя (при входе/регистрации)
    setCurrentUser: (state, action: PayloadAction<ExtendedUser>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Очистка данных пользователя (при выходе)
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.tempUserData = {};
    },

    // Обновление профиля пользователя
    updateUserProfile: (state, action: PayloadAction<Partial<ExtendedUser>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
      }
    },

    // Установка временных данных (для форм)
    setTempUserData: (state, action: PayloadAction<Partial<ExtendedUser>>) => {
      state.tempUserData = { ...state.tempUserData, ...action.payload };
    },

    // Очистка временных данных
    clearTempUserData: (state) => {
      state.tempUserData = {};
    },

    // Установка статуса загрузки
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Установка ошибки
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Очистка ошибки
    clearError: (state) => {
      state.error = null;
    },

    // Обновление статуса онлайн
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      if (state.currentUser) {
        state.currentUser.isOnline = action.payload;
        state.currentUser.lastSeen = new Date().toISOString();
      }
    },

    // Добавление друга
    addFriend: (state, action: PayloadAction<string>) => {
      if (state.currentUser && !state.currentUser.friends.includes(action.payload)) {
        state.currentUser.friends.push(action.payload);
      }
    },

    // Удаление друга
    removeFriend: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.friends = state.currentUser.friends.filter(id => id !== action.payload);
      }
    },

    // Добавление заявки в друзья
    addFriendRequest: (state, action: PayloadAction<string>) => {
      if (state.currentUser && !state.currentUser.friendRequests.includes(action.payload)) {
        state.currentUser.friendRequests.push(action.payload);
      }
    },

    // Удаление заявки в друзья
    removeFriendRequest: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.friendRequests = state.currentUser.friendRequests.filter(id => id !== action.payload);
      }
    },

    // Добавление команды
    addTeam: (state, action: PayloadAction<string>) => {
      if (state.currentUser && !state.currentUser.teams.includes(action.payload)) {
        state.currentUser.teams.push(action.payload);
      }
    },

    // Удаление команды
    removeTeam: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.teams = state.currentUser.teams.filter(id => id !== action.payload);
      }
    },

    // Обновление счетчика непрочитанных уведомлений
    updateUnreadNotificationsCount: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.unreadNotificationsCount = Math.max(0, action.payload);
      }
    },

    // Переключение темы
    toggleTheme: (state) => {
      if (state.currentUser) {
        const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(state.currentUser.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        state.currentUser.theme = themes[nextIndex];
      }
    },

    // Переключение языка
    toggleLanguage: (state) => {
      if (state.currentUser) {
        state.currentUser.language = state.currentUser.language === 'en' ? 'ru' : 'en';
      }
    },

    // Создание нового пользователя с базовыми данными
    createNewUser: (state, action: PayloadAction<{ email: string; username: string; password?: string }>) => {
      const { email, username } = action.payload;

      // Создаем нового пользователя с базовыми данными
      const newUser: ExtendedUser = {
        id: Date.now(), // Временный ID
        email,
        username,

        // Личные данные
        firstName: username,
        lastName: '',
        middleName: '',
        gender: 'prefer_not_to_say',
        birthDate: '',
        age: undefined,

        // Профиль
        bio: '',
        avatarUrl: '',
        phoneNumber: '',
        country: '',
        city: '',
        timezone: '',

        // Настройки по умолчанию
        theme: 'light',
        language: 'ru',

        // Статус
        isActive: true,
        isVerified: false,
        isSuperuser: false,
        isOnline: true,

        // Даты
        createdAt: new Date().toISOString(),
        updatedAt: undefined,
        lastLogin: new Date().toISOString(),

        // Социальные связи
        friends: [],
        friendRequests: [],
        teams: [],

        // Уведомления
        notifications: [],
        unreadNotificationsCount: 0,

        // Настройки уведомлений
        emailNotifications: true,
        pushNotifications: true,
        desktopNotifications: true,

        // Приватность
        profileVisibility: 'public',
        showOnlineStatus: true,
        allowFriendRequests: true,

        // Дополнительные поля
        interests: [],
        skills: [],
        education: '',
        occupation: '',
        profession: '',
        company: '',
        website: '',

        // Социальные сети
        socialLinks: {
          twitter: '',
          linkedin: '',
          github: '',
          instagram: '',
        },
      };

      state.currentUser = newUser;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
  },
});

// Экспортируем actions
export const {
  setCurrentUser,
  clearCurrentUser,
  updateUserProfile,
  setTempUserData,
  clearTempUserData,
  setLoading,
  setError,
  clearError,
  setOnlineStatus,
  addFriend,
  removeFriend,
  addFriendRequest,
  removeFriendRequest,
  addTeam,
  removeTeam,
  updateUnreadNotificationsCount,
  toggleTheme,
  toggleLanguage,
  createNewUser,
} = userSlice.actions;

// Экспортируем reducer
export default userSlice.reducer;