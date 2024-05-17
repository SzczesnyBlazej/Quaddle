const API_ENDPOINTS = {
    // MESSAGES
    CREATE_MESSAGE: 'http://127.0.0.1:8000/api/create_message',
    UPDATE_MESSAGE: 'http://127.0.0.1:8000/api/update_message',
    MESSAGES_TASK: 'http://127.0.0.1:8000/api/get_messages',
    DELETE_MESSAGES_TASK: 'http://127.0.0.1:8000/api/delete_message/',

    // USERS
    UPDATE_USER: 'http://127.0.0.1:8000/update_user/',
    SOLVERS_LIST: 'http://127.0.0.1:8000/api/get_solvers_list/',
    USERS_LIST: 'http://127.0.0.1:8000/api/get_users/',
    USER_DATA: 'http://127.0.0.1:8000/api/get_user_data/',
    USER_MANAGEMENT: 'http://127.0.0.1:8000/api/',
    REGISTRATION: 'http://127.0.0.1:8000/api/register/',

    // TASKS
    UPDATE_TASK: 'http://127.0.0.1:8000/api/update_task',
    CREATE_TASK: 'http://127.0.0.1:8000/api/create_task',
    TASK_API: 'http://127.0.0.1:8000/api/task/',
    GET_TASKS_BY_ID: 'http://127.0.0.1:8000/api/get_tasks_by_id/',
    TASKOPTIONS: 'http://127.0.0.1:8000/api/taskOptions/',
    FAVORITE: 'http://127.0.0.1:8000/api/toggle_favorite',
    CHECK_FAVORITE: 'http://127.0.0.1:8000/api/check_favorite',
    RECENTLY_VIEWED_TASKS: 'http://127.0.0.1:8000/api/get_recently_viewed_tasks',

    // NOTIFICATION
    CREATE_NOTIFICATION: 'http://127.0.0.1:8000/api/create_notification',
    NOTIFICATIONAPI: 'http://127.0.0.1:8000/api/notification/',

    // DASHBOARD
    GET_PRIORITY_COUNTS: 'http://127.0.0.1:8000/api/get_priority_counts_dashboard',
    GET_DIFFICULTY_COUNTS: 'http://127.0.0.1:8000/api/get_difficulty_counts_dashboard',
    GET_UNITS_COUNTS: 'http://127.0.0.1:8000/api/get_units_counts_dashboard',
    GET_TASKS_COUNTS_DASHBOARD: 'http://127.0.0.1:8000/api/get_task_counts_dashboard/',
    GET_LAST_THIRTY_DAYS_COUNT: 'http://127.0.0.1:8000/api/get_last_thirty_days_task_counts',
    COUNT_ALL_TASKS_TO_MENU: 'http://127.0.0.1:8000/api/count_all_tasks_to_menu/',

    //OTHER FUNCTIONS
    APPLICATIONCONFIG: 'http://127.0.0.1:8000/api/applicationConfig',
    DOWNLOAD_ATTACHMENTS: 'http://127.0.0.1:8000/api/download/',
};

export default API_ENDPOINTS;

