import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useAuth } from '../Account/AuthContext/authContext';
import { Popover, List, ListItem, ListItemText, ListItemIcon, Divider, Button, Box } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function NotificationsDropdown({ open, handleClose, anchorRef, onNotificationCountChange }) {
    const [notifications, setNotifications] = useState([]);
    const { authState } = useAuth();
    const user = authState.user;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const accessToken = Cookies.get('access_token');
                const response = await axios.get(API_ENDPOINTS.GET_NOTIFICATION_FOR_USER_BADGE, {
                    params: { user_id: user.id },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const notifications = response.data;
                setNotifications(notifications);

                const unreadCount = notifications.filter(notification => !notification.is_read).length;
                onNotificationCountChange(unreadCount);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        const intervalId = setInterval(fetchNotifications, 30000);

        return () => clearInterval(intervalId);
    }, [user, onNotificationCountChange]);

    const formatDate = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            return format(date, 'dd-MM-yyyy HH:mm');
        }
        return 'Unable to retrieve date';
    };

    const handleMarkAllAsRead = async () => {
        try {
            const accessToken = Cookies.get('access_token');
            await axios.patch(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_AS_READ, {
                user_id: user.id,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setNotifications(notifications.map(notification => ({
                ...notification,
                is_read: true,
            })));
            onNotificationCountChange(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    return (
        <Popover
            open={open}
            onClose={handleClose}
            anchorEl={anchorRef.current}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
            PaperProps={{
                style: {
                    margin: '5px',
                    width: '40ch',
                    backgroundColor: '#20232d',
                },
            }}
        >
            {notifications.length > 0 ?
                <><Box display="flex" justifyContent="flex-start" padding="8px">
                    <button
                        className='btn btn-outline-light m-2'
                        type='button'
                        onClick={handleMarkAllAsRead}
                        disabled={notifications.every(notification => notification.is_read)}
                    >
                        Mark All as Read
                    </button>
                </Box>
                    <Divider sx={{ backgroundColor: 'white' }} />
                </>

                : ''
            }

            <List dense>
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <React.Fragment key={notification.id}>
                            <ListItem
                                button
                                component={Link}
                                to={`/tasks/${notification.notification_fk.id}`}
                                onClick={handleClose}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#333',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: notification.is_read ? 'darkgray' : 'lightgray',
                                }}>
                                    <NotificationsIcon sx={{
                                        color: notification.is_read ? 'gray' : 'white',
                                    }} />
                                </ListItemIcon>

                                <ListItemText
                                    primary={`${notification.message} - ${notification.notification_fk.title}`}
                                    secondary={`${formatDate(notification.create_date)}`}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            color: notification.is_read ? 'gray' : 'white',
                                            opacity: notification.is_read ? 0.6 : 1,
                                        },
                                        '& .MuiListItemText-secondary': {
                                            color: notification.is_read ? 'gray' : 'white',
                                            opacity: notification.is_read ? 0.6 : 1,
                                        }
                                    }}
                                />
                            </ListItem>
                            {index < notifications.length - 1 && <Divider variant="middle" sx={{ backgroundColor: 'white' }} />}
                        </React.Fragment>
                    ))
                ) : (
                    <ListItem>
                        <ListItemText
                            primary="No notifications"
                            primaryTypographyProps={{ style: { color: 'white' } }}
                        />
                    </ListItem>
                )}
            </List>
        </Popover>
    );
}

export default NotificationsDropdown;
