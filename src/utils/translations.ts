// Централизованная система переводов для приложения
export interface Translations {
  // Общие
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
    today: string;
    yesterday: string;
    tomorrow: string;
  };

  // Навигация
  navigation: {
    home: string;
    today: string;
    inbox: string;
    boards: string;
    profile: string;
    settings: string;
    subscription: string;
    help: string;
    favorites: string;
    my_boards: string;
    no_favorite_boards: string;
    no_created_boards: string;
    show_less: string;
    show_more: string;
    create_new_board: string;
    create_new_board_shortcut: string;
    project_management: string;
    board_not_selected: string;
    manage_profile: string;
    configure_app: string;
    choose_subscription: string;
    get_help: string;
    manage_messages: string;
    general_statistics: string;
    today_tasks: string;
    task_management_system: string;
    list: string;
    board: string;
    calendar: string;
    create_board: string;
    board_settings: string;
  };

  // Профиль
  profile: {
    title: string;
    personal_info: string;
    about: string;
    statistics: string;
    edit_profile: string;
    save_changes: string;
    cancel: string;
    upload_photo: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    occupation: string;
    company: string;
    website: string;
    bio: string;
    teams: string;
    friends: string;
    notifications: string;
    registration_year: string;
    not_specified: string;
    online: string;
    offline: string;
    last_seen: string;
  };

  // Настройки
  settings: {
    title: string;
    notifications: string;
    email_notifications: string;
    email_notifications_desc: string;
    push_notifications: string;
    push_notifications_desc: string;
    desktop_notifications: string;
    desktop_notifications_desc: string;
    task_updates: string;
    task_updates_desc: string;
    comments: string;
    comments_desc: string;
    mentions: string;
    mentions_desc: string;
    due_date_reminders: string;
    due_date_reminders_desc: string;
    send_test_email: string;
    appearance: string;
    dark_theme: string;
    dark_theme_desc: string;
    language: string;
    language_desc: string;
    security: string;
    two_factor_auth: string;
    two_factor_auth_desc: string;
    configure: string;
    save_settings: string;
    reset_settings: string;
          test_email_sent: string;
      send_test: string;
      settings_saved: string;
      settings_save_error: string;
      email_not_found: string;
      test_email_sent_alert: string;
      test_email_error: string;
      saving: string;
      language_russian: string;
      language_english: string;
      language_change_confirm: string;
      reset_settings_confirm: string;
  };

  // Inbox
  inbox: {
    title: string;
    subtitle: string;
    mark_all_read: string;
    total: string;
    unread: string;
    urgent: string;
    by_boards: string;
    status: string;
    type: string;
    priority: string;
    board: string;
    all: string;
    all_types: string;
    all_priorities: string;
    all_boards: string;
    unread_notifications: string;
    read_notifications: string;
    task_assigned: string;
    task_due_soon: string;
    task_overdue: string;
    task_completed: string;
    comment_added: string;
    mention: string;
    board_invite: string;
    team_invite: string;
    friend_request: string;
    system_update: string;
    security_alert: string;
    urgent_priority: string;
    high_priority: string;
    normal_priority: string;
    low_priority: string;
    mark_as_read: string;
    delete: string;
    show_more: string;
    no_notifications: string;
    no_unread_notifications: string;
    notifications_will_appear: string;
    loading_notifications: string;
  };

  // Календарь
  calendar: {
    title: string;
    today_tasks: string;
    month: string;
    week: string;
    day: string;
    today: string;
    todo_status: string;
    in_progress_status: string;
    review_status: string;
    testing_status: string;
    completed_status: string;
    total_tasks: string;
    with_date: string;
  };

  // Доски
  boards: {
    create_board: string;
    board_settings: string;
    add_column: string;
    rename_column: string;
    delete_column: string;
    protected_column: string;
    protected_column_desc: string;
    double_click_rename: string;
    standard_column: string;
    no_tasks: string;
    add_task: string;
    search_tasks: string;
    filter_tasks: string;
  };

  // Задачи
  tasks: {
    title: string;
    description: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
    attachments: string;
    subtasks: string;
    edit_task: string;
    delete_task: string;
    mark_complete: string;
    mark_incomplete: string;
    task_list: string;
    search_tasks: string;
    enter_task_name: string;
    filters: string;
    all_statuses: string;
    all_priorities: string;
    planning: string;
    in_progress: string;
    review: string;
    testing: string;
    completed: string;
    cancelled: string;
    blocked: string;
    on_hold: string;
    critical: string;
    low: string;
    medium: string;
    high: string;
    urgent: string;
    reset_filters: string;
    start_typing: string;
    nothing_found: string;
    try_changing: string;
    found_tasks: string;
    to_do: string;
    task_title: string;
    task_description: string;
    select_status: string;
    select_priority: string;
    tags_comma_separated: string;
    save: string;
    cancel: string;
    edit: string;
    edit_date: string;
    add_comment: string;
    add_comment_placeholder: string;
    activity: string;
    loading: string;
    task_not_found: string;
    back_to_board: string;
    quick_actions: string;
    change_status: string;
    change_priority: string;
    assignee: string;
    created: string;
    updated: string;
    due_date: string;
    tags: string;
    comment: string;
    comments_plural: string;
    welcome_to_task_management: string;
    no_boards_created: string;
    create_first_board: string;
    board_helps_organize: string;
    no_board_selected: string;
    please_select_board: string;
    select_board: string;
    today_tasks_from_all_projects: string;
    all_tasks_due_today: string;
    comments_in_tasks: string;
    standard_columns_cannot_rename: string;
    default_columns_protected: string;
    standard_columns_cannot_delete: string;
    cannot_delete_column_with_tasks: string;
    move_or_delete_tasks_first: string;
    column_protected_from_changes: string;
    default_columns_cannot_edit: string;
    standard_column_editing_unavailable: string;
    standard_column: string;
    rename_column: string;
    delete_column: string;
    new_task: string;
    due_date_auto_tomorrow: string;
    task_title_placeholder: string;
    description_placeholder: string;
    add_task: string;
    add_task_button: string;
    new_column: string;
    column_title_placeholder: string;
    column_description_placeholder: string;
    add_column: string;
    add_column_button: string;
    // Стандартные колонки
    column_planning: string;
    column_in_progress: string;
    column_review: string;
    column_testing: string;
    column_completed: string;
    column_overdue: string;
    column_planning_desc: string;
    column_in_progress_desc: string;
    column_review_desc: string;
    column_testing_desc: string;
    column_completed_desc: string;
    column_overdue_desc: string;
    overdue_tasks_info: string;
    // Тестовые задачи
    test_task_1: string;
    test_task_2: string;
    test_task_1_desc: string;
    test_task_2_desc: string;
    not_specified: string;
    // Лейблы в карточках задач
    board_label: string;
    column_label: string;
    task_label: string;
  };

  // Главная
  home: {
    welcome: string;
    good_morning: string;
    good_afternoon: string;
    good_evening: string;
    tasks_completed: string;
    members: string;
    configure: string;
    my_tasks: string;
    upcoming: string;
    overdue: string;
    completed: string;
    show_more: string;
    projects: string;
    recent: string;
    browse_projects: string;
    create_project: string;
    tasks_with_expiring_deadline: string;
    people: string;
    frequent_participants: string;
    view_groups: string;
    invite: string;
    drag_drop_widgets: string;
    no_deadline: string;
    design: string;
    participant: string;
    just_now: string;
    hours_ago: string;
    days_ago: string;
    online_status: string;
    recent_activity: string;
    // Детальная статистика
    statistics: string;
    productivity_analysis: string;
    filters: string;
    reset: string;
    period: string;
    week: string;
    month: string;
    quarter: string;
    year: string;
    all_boards: string;
    all_statuses: string;
    all_priorities: string;
    all_types: string;
    all_assignees: string;
    key_metrics: string;
    total_tasks: string;
    active: string;
    no_tasks: string;
    average_time: string;
    per_task: string;
    no_data: string;
    productivity: string;
    plan_overfulfilled: string;
    plan_not_fulfilled: string;
    task_distribution: string;
    no_data_for_analysis: string;
    status_distribution: string;
    priority_distribution: string;
    type_distribution: string;
    detailization: string;
    task_statuses: string;
    task_priorities: string;
    time_statistics: string;
    analysis_period: string;
    days: string;
    total_completed: string;
    average_per_day: string;
    efficiency: string;
    productivity_by_days: string;
    scroll_to_view: string;
    no_data_to_display: string;
    try_changing_filters: string;
    key_indicators: string;
    best_day: string;
    average_load: string;
    per_day: string;
    peak_activity: string;
    max_per_day: string;
    time_metrics: string;
    planned_time: string;
    actual_time: string;
    plan_execution: string;
    hours: string;
    hours_short: string;
    minutes: string;
    minutes_short: string;
    seconds: string;
    seconds_short: string;
    unknown_participant: string;
    task_count: string;
    upcoming_deadlines: string;
    team_performance: string;
    quick_actions: string;
    good_day: string;
    user: string;
    main_title: string;
    overview_subtitle: string;
    basic_statistics: string;
    more_detailed: string;
    away: string;
    offline: string;
  };

  // Подписка
  subscription: {
    title: string;
    current_plan: string;
    free_plan: string;
    free_plan_desc: string;
    what_included: string;
    up_to_boards: string;
    basic_templates: string;
    up_to_tasks: string;
    basic_support: string;
    premium_plan: string;
    additional_features: string;
    unlimited_boards: string;
    advanced_templates: string;
    unlimited_tasks: string;
    priority_support: string;
    analytics_reports: string;
    integrations: string;
    backup: string;
    teams_collaboration: string;
    upgrade_to_premium: string;
    payment_methods: string;
    bank_cards: string;
    bank_transfers: string;
    e_wallets: string;
    need_help: string;
    support_ready: string;
    contact_support: string;
  };

  // Помощь
  help: {
    title: string;
    categories: string;
    getting_started: string;
    boards: string;
    tasks: string;
    collaboration: string;
    settings: string;
    troubleshooting: string;
    select_category: string;
    select_category_desc: string;
    search_help: string;
    enter_question: string;
    not_found_answer: string;
    support_ready: string;
    chat_support: string;
    write_email: string;
    how_create_first_board: string;
    how_create_first_board_answer: string;
    how_add_task: string;
    how_add_task_answer: string;
    how_switch_modes: string;
    how_switch_modes_answer: string;
    how_change_board_name: string;
    how_change_board_name_answer: string;
    how_add_favorite: string;
    how_add_favorite_answer: string;
    how_share_board: string;
    how_share_board_answer: string;
    how_assign_executor: string;
    how_assign_executor_answer: string;
    how_set_due_date: string;
    how_set_due_date_answer: string;
    how_add_comment: string;
    how_add_comment_answer: string;
  };

  // Пользователь
  user: {
    loading: string;
    login: string;
    online: string;
    profile: string;
    settings: string;
    subscription: string;
    help: string;
    logout: string;
    user: string;
  };
}

export const translations: Record<string, Translations> = {
  ru: {
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      cancel: 'Отмена',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      close: 'Закрыть',
      confirm: 'Подтвердить',
      yes: 'Да',
      no: 'Нет',
      today: 'Сегодня',
      yesterday: 'Вчера',
      tomorrow: 'Завтра',
    },
    navigation: {
      home: 'Главная',
      today: 'Сегодня',
      inbox: 'Входящие',
      boards: 'Доски',
      profile: 'Профиль',
      settings: 'Настройки',
      subscription: 'Подписка',
      help: 'Помощь',
      favorites: 'Избранное',
      my_boards: 'Мои доски',
      no_favorite_boards: 'Нет избранных досок',
      no_created_boards: 'Нет созданных досок',
      show_less: 'Показать меньше',
      show_more: 'Показать еще',
      create_new_board: 'Создать новую доску',
      create_new_board_shortcut: 'Создать новую доску (Ctrl+N)',
      project_management: 'Управление проектами',
      board_not_selected: 'Доска не выбрана',
      manage_profile: 'Управляйте своим профилем и личной информацией',
      configure_app: 'Настройте приложение под свои предпочтения',
      choose_subscription: 'Выберите подходящий план подписки',
      get_help: 'Получите помощь по использованию приложения',
      manage_messages: 'Управляйте своими сообщениями и уведомлениями',
      general_statistics: 'Общая статистика и ключевые метрики',
      today_tasks: 'Задачи на сегодняшний день из всех проектов',
      task_management_system: 'Система управления задачами для эффективного планирования и выполнения проектов',
      list: 'Список',
      board: 'Доска',
      calendar: 'Календарь',
      create_board: 'Создать доску',
      board_settings: 'Настройки доски',
    },
    profile: {
      title: 'Профиль пользователя',
      personal_info: 'Личная информация',
      about: 'О себе',
      statistics: 'Статистика',
      edit_profile: 'Редактировать профиль',
      save_changes: 'Сохранить изменения',
      cancel: 'Отмена',
      upload_photo: 'Загрузить фото',
      first_name: 'Имя',
      last_name: 'Фамилия',
      middle_name: 'Отчество',
      email: 'Email',
      phone: 'Телефон',
      country: 'Страна',
      city: 'Город',
      occupation: 'Профессия',
      company: 'Компания',
      website: 'Веб-сайт',
      bio: 'О себе',
      teams: 'Команд',
      friends: 'Друзей',
      notifications: 'Уведомлений',
      registration_year: 'Год регистрации',
      not_specified: 'Не указано',
      online: 'Онлайн',
      offline: 'Офлайн',
      last_seen: 'Последний раз',
    },
    settings: {
      title: 'Настройки',
      notifications: 'Уведомления',
      email_notifications: 'Email уведомления',
      email_notifications_desc: 'Получать уведомления на email',
      push_notifications: 'Push уведомления',
      push_notifications_desc: 'Получать push уведомления в браузере',
      desktop_notifications: 'Desktop уведомления',
      desktop_notifications_desc: 'Показывать уведомления на рабочем столе',
      task_updates: 'Обновления задач',
      task_updates_desc: 'Уведомления об изменениях в задачах',
      comments: 'Комментарии',
      comments_desc: 'Уведомления о новых комментариях',
      mentions: 'Упоминания',
      mentions_desc: 'Уведомления когда вас упоминают',
      due_date_reminders: 'Напоминания о дедлайнах',
      due_date_reminders_desc: 'Напоминания о приближающихся сроках',
      send_test_email: 'Отправить тестовый email',
      appearance: 'Внешний вид',
      dark_theme: 'Темная тема',
      dark_theme_desc: 'Переключить на темный режим',
      language: 'Язык',
      language_desc: 'Выберите предпочитаемый язык',
      security: 'Безопасность',
      two_factor_auth: 'Двухфакторная аутентификация',
      two_factor_auth_desc: 'Дополнительная защита аккаунта',
      configure: 'Настроить',
      save_settings: 'Сохранить настройки',
      reset_settings: 'Сбросить настройки',
      test_email_sent: 'Тестовый email отправлен!',
      send_test: 'Отправить тест',
      settings_saved: 'Настройки успешно сохранены!',
      settings_save_error: 'Ошибка при сохранении настроек. Попробуйте еще раз.',
      email_not_found: 'Email пользователя не найден',
      test_email_sent_alert: 'Тестовый email отправлен! Проверьте вашу почту.',
      test_email_error: 'Ошибка при отправке тестового email. Попробуйте еще раз.',
      saving: 'Сохранение...',
      language_russian: 'Русский',
      language_english: 'English',
      language_change_confirm: 'Для применения языка необходимо перезагрузить страницу. Перезагрузить сейчас?',
      reset_settings_confirm: 'Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?',
    },
    inbox: {
      title: 'Входящие',
      subtitle: 'Управляйте своими сообщениями и уведомлениями',
      mark_all_read: 'Отметить все как прочитанные',
      total: 'Всего',
      unread: 'Непрочитанные',
      urgent: 'Срочные',
      by_boards: 'По доскам',
      status: 'Статус:',
      type: 'Тип:',
      priority: 'Приоритет:',
      board: 'Доска:',
      all: 'Все',
      all_types: 'Все типы',
      all_priorities: 'Все приоритеты',
      all_boards: 'Все доски',
      unread_notifications: 'Непрочитанные',
      read_notifications: 'Прочитанные',
      task_assigned: 'Назначенные задачи',
      task_due_soon: 'Скоро дедлайн',
      task_overdue: 'Просроченные',
      task_completed: 'Завершенные',
      comment_added: 'Комментарии',
      mention: 'Упоминания',
      board_invite: 'Приглашения в доски',
      team_invite: 'Приглашения в команды',
      friend_request: 'Заявки в друзья',
      system_update: 'Обновления системы',
      security_alert: 'Безопасность',
      urgent_priority: 'Срочно',
      high_priority: 'Высокий',
      normal_priority: 'Обычный',
      low_priority: 'Низкий',
      mark_as_read: 'Отметить как прочитанное',
      delete: 'Удалить',
      show_more: 'Показать больше уведомлений',
      no_notifications: 'Нет уведомлений',
      no_unread_notifications: 'У вас нет непрочитанных уведомлений',
      notifications_will_appear: 'Уведомления появятся здесь, когда будут созданы новые задачи, комментарии или другие события',
      loading_notifications: 'Загрузка уведомлений...',
    },
    calendar: {
      title: 'Календарь задач',
      today_tasks: 'Задачи на сегодня',
      month: 'Месяц',
      week: 'Неделя',
      day: 'День',
      today: 'Сегодня',
      todo_status: 'К выполнению',
      in_progress_status: 'В работе',
      review_status: 'На проверке',
      testing_status: 'Тестирование',
      completed_status: 'Завершено',
      total_tasks: 'Всего задач',
      with_date: 'С датой',
    },
    boards: {
      create_board: 'Создать доску',
      board_settings: 'Настройки доски',
      add_column: 'Добавить колонку',
      rename_column: 'Переименовать колонку',
      delete_column: 'Удалить колонку',
      protected_column: 'Эта колонка защищена от изменений!',
      protected_column_desc: 'Колонки по умолчанию нельзя редактировать или удалять.',
      double_click_rename: 'Двойной клик для переименования',
      standard_column: 'Стандартная колонка - редактирование недоступно',
      no_tasks: 'Нет задач',
      add_task: 'Добавить задачу',
      search_tasks: 'Поиск задач',
      filter_tasks: 'Фильтр задач',
    },
    tasks: {
      title: 'Заголовок',
      description: 'Описание',
      status: 'Статус',
      priority: 'Приоритет',
      created_at: 'Создано',
      updated_at: 'Обновлено',
      attachments: 'Вложения',
      subtasks: 'Подзадачи',
      edit_task: 'Редактировать задачу',
      delete_task: 'Удалить задачу',
      mark_complete: 'Отметить как выполненную',
      mark_incomplete: 'Отметить как невыполненную',
      task_list: 'Список задач',
      search_tasks: 'Поиск задач',
      enter_task_name: 'Введите название задачи, описание или тег...',
      filters: 'Фильтры',
      all_statuses: 'Все статусы',
      all_priorities: 'Все приоритеты',
      planning: 'Планирование',
      in_progress: 'В работе',
      review: 'На проверке',
      testing: 'Тестирование',
      completed: 'Завершено',
      cancelled: 'Отменено',
      blocked: 'Заблокировано',
      on_hold: 'На паузе',
      critical: 'Критичный',
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
      urgent: 'Срочно',
      reset_filters: 'Сбросить фильтры',
      start_typing: 'Начните вводить название задачи, описание или тег для поиска',
      nothing_found: 'Ничего не найдено',
      try_changing: 'Попробуйте изменить запрос или сбросить фильтры',
      found_tasks: 'Найдено задач',
      to_do: 'К выполнению',
      task_title: 'Название задачи',
      task_description: 'Описание задачи',
      select_status: 'Выберите статус',
      select_priority: 'Выберите приоритет',
      tags_comma_separated: 'Теги через запятую',
      save: 'Сохранить',
      cancel: 'Отменить',
      edit: 'Редактировать',
      edit_date: 'Изменить дату',
      add_comment: 'Добавить комментарий',
      add_comment_placeholder: 'Добавить комментарий...',
      activity: 'Активность',
      loading: 'Загрузка...',
      task_not_found: 'Задача не найдена',
      back_to_board: 'Назад к доске',
      quick_actions: 'Быстрые действия',
      change_status: 'Изменить статус',
      change_priority: 'Изменить приоритет',
      assignee: 'Исполнитель',
      created: 'Создано',
      updated: 'Обновлено',
      due_date: 'Дата выполнения',
      tags: 'Теги',
      comment: 'комментарий',
      comments_plural: 'комментариев',
      welcome_to_task_management: 'Добро пожаловать в систему управления задачами!',
      no_boards_created: 'У вас пока нет созданных досок. Создайте свою первую доску, чтобы начать работу с задачами.',
      create_first_board: 'Создать первую доску',
      board_helps_organize: 'Доска поможет вам организовать задачи, отслеживать прогресс и работать в команде',
      no_board_selected: 'Доска не выбрана',
      please_select_board: 'Пожалуйста, выберите доску для работы с задачами из боковой панели',
      select_board: 'Выбрать доску',
      today_tasks_from_all_projects: 'Задачи на сегодня из всех проектов',
      all_tasks_due_today: 'Здесь показаны все задачи с датой выполнения на сегодня',
      comments_in_tasks: 'комментариев в',
      standard_columns_cannot_rename: 'Стандартные колонки не могут быть переименованы!',
      default_columns_protected: 'Колонки по умолчанию (Планирование, В работе, На проверке, Завершено и др.) защищены от изменений.',
      standard_columns_cannot_delete: 'Стандартные колонки не могут быть удалены!',
      cannot_delete_column_with_tasks: 'Нельзя удалить колонку с задачами. Сначала переместите или удалите все задачи.',
      move_or_delete_tasks_first: 'Сначала переместите или удалите все задачи.',
      column_protected_from_changes: 'Эта колонка защищена от изменений!',
      default_columns_cannot_edit: 'Колонки по умолчанию нельзя редактировать или удалять.',
      standard_column_editing_unavailable: 'Стандартная колонка - редактирование недоступно',
      standard_column: 'Стандартная колонка',
      rename_column: 'Переименовать колонку',
      delete_column: 'Удалить колонку',
      new_task: 'Новая задача',
      due_date_auto_tomorrow: 'Дата выполнения автоматически установлена на завтра',
      task_title_placeholder: 'Название задачи...',
      description_placeholder: 'Описание...',
      add_task: 'Добавить задачу',
      add_task_button: 'Добавить задачу',
      new_column: 'Новая колонка',
      column_title_placeholder: 'Название колонки...',
      column_description_placeholder: 'Описание колонки...',
      add_column: 'Добавить колонку',
      add_column_button: 'Добавить колонку',
      // Стандартные колонки
      column_planning: 'Начало работы',
      column_in_progress: 'В работе',
      column_review: 'Проверка',
      column_testing: 'Тестирование',
      column_completed: 'Завершение',
      column_overdue: 'Просрочено',
      column_planning_desc: 'Задачи, которые нужно начать выполнять',
      column_in_progress_desc: 'Задачи, которые выполняются в данный момент',
      column_review_desc: 'Задачи, готовые к проверке и тестированию',
      column_testing_desc: 'Задачи на тестировании',
      column_completed_desc: 'Завершенные задачи',
      column_overdue_desc: 'Просроченные задачи',
      overdue_tasks_info: 'Просроченные задачи автоматически отображаются здесь',
      // Тестовые задачи
      test_task_1: 'Тестовая задача 1',
      test_task_2: 'Тестовая задача 2',
      test_task_1_desc: 'Это пример задачи для демонстрации функционала',
      test_task_2_desc: 'Еще одна тестовая задача для примера',
      not_specified: 'Не указан',
      // Лейблы в карточках задач
      board_label: 'Доска:',
      column_label: 'Колонка:',
      task_label: 'Задача',
    },
    home: {
      welcome: 'Добро пожаловать',
      good_morning: 'Доброе утро',
      good_afternoon: 'Добрый день',
      good_evening: 'Добрый вечер',
      tasks_completed: 'задач выполнено',
      members: 'участников',
      configure: 'Настроить',
      my_tasks: 'Мои задачи',
      upcoming: 'Предстоит',
      overdue: 'Просрочено',
      completed: 'Выполнено',
      show_more: 'Показать больше',
      projects: 'Проекты',
      recent: 'Недавние',
      browse_projects: 'Browse projects',
      create_project: 'Создать проект',
      tasks_with_expiring_deadline: 'задач с истекающим сроком',
      people: 'Люди',
      frequent_participants: 'Частые участники',
      view_groups: 'Смотреть группы',
      invite: 'Пригласить',
      drag_drop_widgets: 'Drag and drop new widgets',
      no_deadline: 'Без срока',
      design: 'Дизайн',
      participant: 'Участник',
      just_now: 'Только что',
      hours_ago: 'ч назад',
      days_ago: 'д назад',
      online_status: 'В сети',
      recent_activity: 'Недавняя активность',
      // Детальная статистика
      statistics: 'Статистика',
      productivity_analysis: 'Анализ продуктивности и эффективности',
      filters: 'Фильтры',
      reset: 'Сбросить',
      period: 'Период:',
      week: 'Неделя',
      month: 'Месяц',
      quarter: 'Квартал',
      year: 'Год',
      all_boards: 'Все доски',
      all_statuses: 'Все статусы',
      all_priorities: 'Все приоритеты',
      all_types: 'Все типы',
      all_assignees: 'Все исполнители',
      key_metrics: 'Ключевые метрики',
      total_tasks: 'Всего задач',
      active: 'Активные',
      no_tasks: 'Нет задач',
      average_time: 'Среднее время',
      per_task: 'На задачу',
      no_data: 'Нет данных',
      productivity: 'Продуктивность',
      plan_overfulfilled: 'План перевыполнен',
      plan_not_fulfilled: 'План не выполнен',
      task_distribution: 'Распределение задач',
      no_data_for_analysis: 'Нет данных для анализа',
      status_distribution: 'Распределение по статусам',
      priority_distribution: 'Распределение по приоритетам',
      type_distribution: 'Распределение по типам',
      detailization: 'Детализация',
      task_statuses: 'Статусы задач',
      task_priorities: 'Приоритеты задач',
      time_statistics: 'Временная статистика',
      analysis_period: 'Период анализа',
      days: 'дней',
      total_completed: 'Всего завершено',
      average_per_day: 'Среднее в день',
      efficiency: 'Эффективность',
      productivity_by_days: 'Продуктивность по дням',
      scroll_to_view: '← Прокрутите для просмотра всех данных →',
      no_data_to_display: 'Нет данных для отображения',
      try_changing_filters: 'Попробуйте изменить фильтры или создать новые задачи',
      key_indicators: 'Ключевые показатели',
      best_day: 'Лучший день',
      average_load: 'Средняя нагрузка',
      per_day: 'в день',
      peak_activity: 'Пиковая активность',
      max_per_day: 'максимум за день',
      time_metrics: 'Временные метрики',
      planned_time: 'Планируемое время',
      actual_time: 'Фактическое время',
      plan_execution: 'Выполнение плана',
      hours: 'часов',
      hours_short: 'ч',
      minutes: 'минут',
      minutes_short: 'мин',
      seconds: 'секунд',
      seconds_short: 'сек',
      unknown_participant: 'Неизвестный участник',
      task_count: 'Количество задач',
      upcoming_deadlines: 'Предстоящие дедлайны',
      team_performance: 'Производительность команды',
      quick_actions: 'Быстрые действия',
      good_day: 'Добрый день',
      user: 'Пользователь',
      main_title: 'Главная',
      overview_subtitle: 'Обзор вашей продуктивности и ключевые метрики',
      basic_statistics: 'Основная статистика',
      more_detailed: 'Более детальнее',
      away: 'Отошел',
      offline: 'Не в сети',
    },
    subscription: {
      title: 'Подписка',
      current_plan: 'Текущий план',
      free_plan: 'Бесплатный',
      free_plan_desc: 'У вас активен бесплатный план с базовыми возможностями',
      what_included: 'Что включено в бесплатный план:',
      up_to_boards: 'До 3 досок',
      basic_templates: 'Базовые шаблоны',
      up_to_tasks: 'До 100 задач',
      basic_support: 'Базовая поддержка',
      premium_plan: 'Премиум план',
      additional_features: 'Дополнительные возможности:',
      unlimited_boards: 'Неограниченное количество досок',
      advanced_templates: 'Расширенные шаблоны',
      unlimited_tasks: 'Неограниченное количество задач',
      priority_support: 'Приоритетная поддержка',
      analytics_reports: 'Аналитика и отчеты',
      integrations: 'Интеграции с внешними сервисами',
      backup: 'Резервное копирование',
      teams_collaboration: 'Команды и совместная работа',
      upgrade_to_premium: 'Перейти на Премиум',
      payment_methods: 'Способы оплаты',
      bank_cards: 'Банковские карты',
      bank_transfers: 'Банковские переводы',
      e_wallets: 'Электронные кошельки',
      need_help: 'Нужна помощь?',
      support_ready: 'Наша команда поддержки готова помочь с любыми вопросами',
      contact_support: 'Связаться с поддержкой',
    },
    help: {
      title: 'Помощь',
      categories: 'Категории',
      getting_started: 'Начало работы',
      boards: 'Доски',
      tasks: 'Задачи',
      collaboration: 'Совместная работа',
      settings: 'Настройки',
      troubleshooting: 'Решение проблем',
      select_category: 'Выберите категорию',
      select_category_desc: 'Выберите категорию слева, чтобы увидеть справочную информацию',
      search_help: 'Поиск по справке',
      enter_question: 'Введите ваш вопрос...',
      not_found_answer: 'Не нашли ответ?',
      support_ready: 'Наша команда поддержки готова помочь вам',
      chat_support: 'Чат поддержки',
      write_email: 'Написать письмо',
      how_create_first_board: 'Как создать первую доску?',
      how_create_first_board_answer: 'Нажмите на кнопку "+" в левом меню или используйте кнопку "Создать доску" в заголовке. Выберите шаблон и дайте название вашей доске.',
      how_add_task: 'Как добавить задачу?',
      how_add_task_answer: 'В режиме Board нажмите "+" в нужной колонке. В режиме List используйте кнопку "Добавить задачу" в верхней части списка.',
      how_switch_modes: 'Как переключаться между режимами?',
      how_switch_modes_answer: 'Используйте кнопки List, Board и Calendar в заголовке страницы для переключения между различными представлениями.',
      how_change_board_name: 'Как изменить название доски?',
      how_change_board_name_answer: 'Кликните на название доски в заголовке и введите новое название. Нажмите Enter для сохранения.',
      how_add_favorite: 'Как добавить доску в избранное?',
      how_add_favorite_answer: 'Кликните на три точки рядом с названием доски и выберите "Добавить в избранное".',
      how_share_board: 'Как поделиться доской?',
      how_share_board_answer: 'В настройках доски выберите "Поделиться" и отправьте ссылку коллегам или добавьте их по email.',
      how_assign_executor: 'Как назначить исполнителя?',
      how_assign_executor_answer: 'Кликните на задачу и в правой панели найдите поле "Исполнитель". Выберите пользователя из списка.',
      how_set_due_date: 'Как установить срок выполнения?',
      how_set_due_date_answer: 'Откройте задачу и в правой панели найдите поле "Срок". Выберите дату в календаре.',
      how_add_comment: 'Как добавить комментарий?',
      how_add_comment_answer: 'Откройте задачу и внизу найдите поле "Добавить комментарий". Введите текст и нажмите Enter.',
    },
    user: {
      loading: 'Загрузка...',
      login: 'Войти',
      online: 'Онлайн',
      profile: 'Профиль',
      settings: 'Настройки',
      subscription: 'Подписка',
      help: 'Помощь',
      logout: 'Выйти',
      user: 'Пользователь',
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
    },
    navigation: {
      home: 'Home',
      today: 'Today',
      inbox: 'Inbox',
      boards: 'Boards',
      profile: 'Profile',
      settings: 'Settings',
      subscription: 'Subscription',
      help: 'Help',
      favorites: 'Favorites',
      my_boards: 'My Boards',
      no_favorite_boards: 'No favorite boards',
      no_created_boards: 'No created boards',
      show_less: 'Show less',
      show_more: 'Show more',
      create_new_board: 'Create new board',
      create_new_board_shortcut: 'Create new board (Ctrl+N)',
      project_management: 'Project Management',
      board_not_selected: 'Board not selected',
      manage_profile: 'Manage your profile and personal information',
      configure_app: 'Configure the application to your preferences',
      choose_subscription: 'Choose the right subscription plan',
      get_help: 'Get help using the application',
      manage_messages: 'Manage your messages and notifications',
      general_statistics: 'General statistics and key metrics',
      today_tasks: 'Today\'s tasks from all projects',
      task_management_system: 'Task management system for effective planning and project execution',
      list: 'List',
      board: 'Board',
      calendar: 'Calendar',
      create_board: 'Create Board',
      board_settings: 'Board Settings',
    },
    profile: {
      title: 'User Profile',
      personal_info: 'Personal Information',
      about: 'About',
      statistics: 'Statistics',
      edit_profile: 'Edit Profile',
      save_changes: 'Save Changes',
      cancel: 'Cancel',
      upload_photo: 'Upload Photo',
      first_name: 'First Name',
      last_name: 'Last Name',
      middle_name: 'Middle Name',
      email: 'Email',
      phone: 'Phone',
      country: 'Country',
      city: 'City',
      occupation: 'Occupation',
      company: 'Company',
      website: 'Website',
      bio: 'About',
      teams: 'Teams',
      friends: 'Friends',
      notifications: 'Notifications',
      registration_year: 'Registration Year',
      not_specified: 'Not specified',
      online: 'Online',
      offline: 'Offline',
      last_seen: 'Last seen',
    },
    settings: {
      title: 'Settings',
      notifications: 'Notifications',
      email_notifications: 'Email notifications',
      email_notifications_desc: 'Receive notifications via email',
      push_notifications: 'Push notifications',
      push_notifications_desc: 'Receive push notifications in browser',
      desktop_notifications: 'Desktop notifications',
      desktop_notifications_desc: 'Show notifications on desktop',
      task_updates: 'Task updates',
      task_updates_desc: 'Notifications about task changes',
      comments: 'Comments',
      comments_desc: 'Notifications about new comments',
      mentions: 'Mentions',
      mentions_desc: 'Notifications when you are mentioned',
      due_date_reminders: 'Due date reminders',
      due_date_reminders_desc: 'Reminders about upcoming deadlines',
      send_test_email: 'Send test email',
      appearance: 'Appearance',
      dark_theme: 'Dark theme',
      dark_theme_desc: 'Switch to dark mode',
      language: 'Language',
      language_desc: 'Choose preferred language',
      security: 'Security',
      two_factor_auth: 'Two-factor authentication',
      two_factor_auth_desc: 'Additional account protection',
      configure: 'Configure',
      save_settings: 'Save settings',
      reset_settings: 'Reset settings',
      test_email_sent: 'Test email sent!',
      send_test: 'Send test',
      settings_saved: 'Settings saved successfully!',
      settings_save_error: 'Error saving settings. Please try again.',
      email_not_found: 'User email not found',
      test_email_sent_alert: 'Test email sent! Check your mailbox.',
      test_email_error: 'Error sending test email. Please try again.',
      saving: 'Saving...',
      language_russian: 'Русский',
      language_english: 'English',
      language_change_confirm: 'To apply the language, you need to reload the page. Reload now?',
      reset_settings_confirm: 'Are you sure you want to reset all settings to default values?',
    },
    inbox: {
      title: 'Inbox',
      subtitle: 'Manage your messages and notifications',
      mark_all_read: 'Mark all as read',
      total: 'Total',
      unread: 'Unread',
      urgent: 'Urgent',
      by_boards: 'By boards',
      status: 'Status:',
      type: 'Type:',
      priority: 'Priority:',
      board: 'Board:',
      all: 'All',
      all_types: 'All types',
      all_priorities: 'All priorities',
      all_boards: 'All boards',
      unread_notifications: 'Unread',
      read_notifications: 'Read',
      task_assigned: 'Assigned tasks',
      task_due_soon: 'Due soon',
      task_overdue: 'Overdue',
      task_completed: 'Completed',
      comment_added: 'Comments',
      mention: 'Mentions',
      board_invite: 'Board invitations',
      team_invite: 'Team invitations',
      friend_request: 'Friend requests',
      system_update: 'System updates',
      security_alert: 'Security',
      urgent_priority: 'Urgent',
      high_priority: 'High',
      normal_priority: 'Normal',
      low_priority: 'Low',
      mark_as_read: 'Mark as read',
      delete: 'Delete',
      show_more: 'Show more notifications',
      no_notifications: 'No notifications',
      no_unread_notifications: 'You have no unread notifications',
      notifications_will_appear: 'Notifications will appear here when new tasks, comments or other events are created',
      loading_notifications: 'Loading notifications...',
    },
    calendar: {
      title: 'Task Calendar',
      today_tasks: 'Today\'s Tasks',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      today: 'Today',
      todo_status: 'To Do',
      in_progress_status: 'In Progress',
      review_status: 'Review',
      testing_status: 'Testing',
      completed_status: 'Completed',
      total_tasks: 'Total tasks',
      with_date: 'With date',
    },
    boards: {
      create_board: 'Create Board',
      board_settings: 'Board Settings',
      add_column: 'Add Column',
      rename_column: 'Rename Column',
      delete_column: 'Delete Column',
      protected_column: 'This column is protected from changes!',
      protected_column_desc: 'Default columns cannot be edited or deleted.',
      double_click_rename: 'Double click to rename',
      standard_column: 'Standard column - editing unavailable',
      no_tasks: 'No tasks',
      add_task: 'Add Task',
      search_tasks: 'Search Tasks',
      filter_tasks: 'Filter Tasks',
    },
    tasks: {
      title: 'Title',
      description: 'Description',
      status: 'Status',
      priority: 'Priority',
      created_at: 'Created',
      updated_at: 'Updated',
      attachments: 'Attachments',
      subtasks: 'Subtasks',
      edit_task: 'Edit Task',
      delete_task: 'Delete Task',
      mark_complete: 'Mark as Complete',
      mark_incomplete: 'Mark as Incomplete',
      task_list: 'Task List',
      search_tasks: 'Search Tasks',
      enter_task_name: 'Enter task name, description or tag...',
      filters: 'Filters',
      all_statuses: 'All Statuses',
      all_priorities: 'All Priorities',
      planning: 'Planning',
      in_progress: 'In Progress',
      review: 'Review',
      testing: 'Testing',
      completed: 'Completed',
      cancelled: 'Cancelled',
      blocked: 'Blocked',
      on_hold: 'On Hold',
      critical: 'Critical',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
      reset_filters: 'Reset Filters',
      start_typing: 'Start typing task name, description or tag to search',
      nothing_found: 'Nothing found',
      try_changing: 'Try changing the query or reset filters',
      found_tasks: 'Found tasks',
      to_do: 'To Do',
      task_title: 'Task Title',
      task_description: 'Task Description',
      select_status: 'Select Status',
      select_priority: 'Select Priority',
      tags_comma_separated: 'Tags (comma separated)',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      edit_date: 'Edit Date',
      add_comment: 'Add Comment',
      add_comment_placeholder: 'Add a comment...',
      activity: 'Activity',
      loading: 'Loading...',
      task_not_found: 'Task not found',
      back_to_board: 'Back to Board',
      quick_actions: 'Quick Actions',
      change_status: 'Change Status',
      change_priority: 'Change Priority',
      assignee: 'Assignee',
      created: 'Created',
      updated: 'Updated',
      due_date: 'Due Date',
      tags: 'Tags',
      comment: 'comment',
      comments_plural: 'comments',
      welcome_to_task_management: 'Welcome to the task management system!',
      no_boards_created: 'You don\'t have any boards created yet. Create your first board to start working with tasks.',
      create_first_board: 'Create First Board',
      board_helps_organize: 'A board will help you organize tasks, track progress and work in a team',
      no_board_selected: 'No Board Selected',
      please_select_board: 'Please select a board to work with tasks from the sidebar',
      select_board: 'Select Board',
      today_tasks_from_all_projects: 'Today\'s Tasks from All Projects',
      all_tasks_due_today: 'Here are all tasks with due date for today',
      comments_in_tasks: 'comments in',
      standard_columns_cannot_rename: 'Standard columns cannot be renamed!',
      default_columns_protected: 'Default columns (Planning, In Progress, Review, Completed, etc.) are protected from changes.',
      standard_columns_cannot_delete: 'Standard columns cannot be deleted!',
      cannot_delete_column_with_tasks: 'Cannot delete column with tasks. First move or delete all tasks.',
      move_or_delete_tasks_first: 'First move or delete all tasks.',
      column_protected_from_changes: 'This column is protected from changes!',
      default_columns_cannot_edit: 'Default columns cannot be edited or deleted.',
      standard_column_editing_unavailable: 'Standard column - editing unavailable',
      standard_column: 'Standard Column',
      rename_column: 'Rename Column',
      delete_column: 'Delete Column',
      new_task: 'New Task',
      due_date_auto_tomorrow: 'Due date automatically set to tomorrow',
      task_title_placeholder: 'Task title...',
      description_placeholder: 'Description...',
      add_task: 'Add Task',
      add_task_button: 'Add Task',
      new_column: 'New Column',
      column_title_placeholder: 'Column title...',
      column_description_placeholder: 'Column description...',
      add_column: 'Add Column',
      add_column_button: 'Add Column',
      // Стандартные колонки
      column_planning: 'Planning',
      column_in_progress: 'In Progress',
      column_review: 'Review',
      column_testing: 'Testing',
      column_completed: 'Completed',
      column_overdue: 'Overdue',
      column_planning_desc: 'Tasks that need to be started',
      column_in_progress_desc: 'Tasks currently being worked on',
      column_review_desc: 'Tasks ready for review and testing',
      column_testing_desc: 'Tasks under testing',
      column_completed_desc: 'Completed tasks',
      column_overdue_desc: 'Overdue tasks',
      overdue_tasks_info: 'Overdue tasks are automatically displayed here',
      // Тестовые задачи
      test_task_1: 'Test Task 1',
      test_task_2: 'Test Task 2',
      test_task_1_desc: 'This is an example task to demonstrate functionality',
      test_task_2_desc: 'Another test task for example',
      not_specified: 'Not specified',
      // Лейблы в карточках задач
      board_label: 'Board:',
      column_label: 'Column:',
      task_label: 'Task',
    },
    home: {
      welcome: 'Welcome',
      good_morning: 'Good morning',
      good_afternoon: 'Good afternoon',
      good_evening: 'Good evening',
      tasks_completed: 'tasks completed',
      members: 'members',
      configure: 'Configure',
      my_tasks: 'My Tasks',
      upcoming: 'Upcoming',
      overdue: 'Overdue',
      completed: 'Completed',
      show_more: 'Show More',
      projects: 'Projects',
      recent: 'Recent',
      browse_projects: 'Browse projects',
      create_project: 'Create Project',
      tasks_with_expiring_deadline: 'tasks with expiring deadline',
      people: 'People',
      frequent_participants: 'Frequent Participants',
      view_groups: 'View Groups',
      invite: 'Invite',
      drag_drop_widgets: 'Drag and drop new widgets',
      no_deadline: 'No deadline',
      design: 'Design',
      participant: 'Participant',
      just_now: 'Just now',
      hours_ago: 'h ago',
      days_ago: 'd ago',
      online_status: 'Online',
      recent_activity: 'Recent Activity',
      // Детальная статистика
      statistics: 'Statistics',
      productivity_analysis: 'Productivity and efficiency analysis',
      filters: 'Filters',
      reset: 'Reset',
      period: 'Period:',
      week: 'Week',
      month: 'Month',
      quarter: 'Quarter',
      year: 'Year',
      all_boards: 'All Boards',
      all_statuses: 'All Statuses',
      all_priorities: 'All Priorities',
      all_types: 'All Types',
      all_assignees: 'All Assignees',
      key_metrics: 'Key Metrics',
      total_tasks: 'Total Tasks',
      active: 'Active',
      no_tasks: 'No Tasks',
      average_time: 'Average Time',
      per_task: 'Per Task',
      no_data: 'No Data',
      productivity: 'Productivity',
      plan_overfulfilled: 'Plan Overfulfilled',
      plan_not_fulfilled: 'Plan Not Fulfilled',
      task_distribution: 'Task Distribution',
      no_data_for_analysis: 'No Data for Analysis',
      status_distribution: 'Status Distribution',
      priority_distribution: 'Priority Distribution',
      type_distribution: 'Type Distribution',
      detailization: 'Detailization',
      task_statuses: 'Task Statuses',
      task_priorities: 'Task Priorities',
      time_statistics: 'Time Statistics',
      analysis_period: 'Analysis Period',
      days: 'days',
      total_completed: 'Total Completed',
      average_per_day: 'Average Per Day',
      efficiency: 'Efficiency',
      productivity_by_days: 'Productivity by Days',
      scroll_to_view: '← Scroll to view all data →',
      no_data_to_display: 'No data to display',
      try_changing_filters: 'Try changing filters or creating new tasks',
      key_indicators: 'Key Indicators',
      best_day: 'Best Day',
      average_load: 'Average Load',
      per_day: 'per day',
      peak_activity: 'Peak Activity',
      max_per_day: 'max per day',
      time_metrics: 'Time Metrics',
      planned_time: 'Planned Time',
      actual_time: 'Actual Time',
      plan_execution: 'Plan Execution',
      hours: 'hours',
      hours_short: 'h',
      minutes: 'minutes',
      minutes_short: 'min',
      seconds: 'seconds',
      seconds_short: 'sec',
      unknown_participant: 'Unknown Participant',
      task_count: 'Task Count',
      upcoming_deadlines: 'Upcoming Deadlines',
      team_performance: 'Team Performance',
      quick_actions: 'Quick Actions',
      good_day: 'Good day',
      user: 'User',
      main_title: 'Home',
      overview_subtitle: 'Overview of your productivity and key metrics',
      basic_statistics: 'Basic Statistics',
      more_detailed: 'More Detailed',
      away: 'Away',
      offline: 'Offline',
    },
    subscription: {
      title: 'Subscription',
      current_plan: 'Current Plan',
      free_plan: 'Free',
      free_plan_desc: 'You have an active free plan with basic features',
      what_included: 'What\'s included in the free plan:',
      up_to_boards: 'Up to 3 boards',
      basic_templates: 'Basic templates',
      up_to_tasks: 'Up to 100 tasks',
      basic_support: 'Basic support',
      premium_plan: 'Premium Plan',
      additional_features: 'Additional features:',
      unlimited_boards: 'Unlimited boards',
      advanced_templates: 'Advanced templates',
      unlimited_tasks: 'Unlimited tasks',
      priority_support: 'Priority support',
      analytics_reports: 'Analytics and reports',
      integrations: 'External service integrations',
      backup: 'Backup',
      teams_collaboration: 'Teams and collaboration',
      upgrade_to_premium: 'Upgrade to Premium',
      payment_methods: 'Payment Methods',
      bank_cards: 'Bank cards',
      bank_transfers: 'Bank transfers',
      e_wallets: 'E-wallets',
      need_help: 'Need help?',
      support_ready: 'Our support team is ready to help with any questions',
      contact_support: 'Contact Support',
    },
    help: {
      title: 'Help',
      categories: 'Categories',
      getting_started: 'Getting Started',
      boards: 'Boards',
      tasks: 'Tasks',
      collaboration: 'Collaboration',
      settings: 'Settings',
      troubleshooting: 'Troubleshooting',
      select_category: 'Select Category',
      select_category_desc: 'Select a category on the left to see help information',
      search_help: 'Search Help',
      enter_question: 'Enter your question...',
      not_found_answer: 'Can\'t find an answer?',
      support_ready: 'Our support team is ready to help you',
      chat_support: 'Support Chat',
      write_email: 'Write Email',
      how_create_first_board: 'How to create your first board?',
      how_create_first_board_answer: 'Click the "+" button in the left menu or use the "Create Board" button in the header. Choose a template and give your board a name.',
      how_add_task: 'How to add a task?',
      how_add_task_answer: 'In Board mode, click "+" in the desired column. In List mode, use the "Add Task" button at the top of the list.',
      how_switch_modes: 'How to switch between modes?',
      how_switch_modes_answer: 'Use the List, Board and Calendar buttons in the page header to switch between different views.',
      how_change_board_name: 'How to change board name?',
      how_change_board_name_answer: 'Click on the board name in the header and enter a new name. Press Enter to save.',
      how_add_favorite: 'How to add board to favorites?',
      how_add_favorite_answer: 'Click on the three dots next to the board name and select "Add to Favorites".',
      how_share_board: 'How to share a board?',
      how_share_board_answer: 'In board settings, select "Share" and send the link to colleagues or add them by email.',
      how_assign_executor: 'How to assign an executor?',
      how_assign_executor_answer: 'Click on the task and in the right panel find the "Executor" field. Select a user from the list.',
      how_set_due_date: 'How to set due date?',
      how_set_due_date_answer: 'Open the task and in the right panel find the "Due Date" field. Select a date in the calendar.',
      how_add_comment: 'How to add a comment?',
      how_add_comment_answer: 'Open the task and at the bottom find the "Add Comment" field. Enter text and press Enter.',
    },
    user: {
      loading: 'Loading...',
      login: 'Login',
      online: 'Online',
      profile: 'Profile',
      settings: 'Settings',
      subscription: 'Subscription',
      help: 'Help',
      logout: 'Logout',
      user: 'User',
    },
  },
};

// Функция для получения перевода
export const getTranslation = (language: string, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language] || translations['ru'];
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback на русский язык
      value = translations['ru'];
      for (const fallbackKey of keys) {
        value = value?.[fallbackKey];
        if (value === undefined) {
          return key; // Возвращаем ключ, если перевод не найден
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

// Хук для использования переводов в компонентах
export const useTranslation = (language: string = 'ru') => {
  const t = (key: string) => getTranslation(language, key);
  return { t };
};
