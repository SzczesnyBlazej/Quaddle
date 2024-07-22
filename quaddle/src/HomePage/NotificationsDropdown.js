import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import { useAuth } from '../Account/AuthContext/authContext';
import { Popover, List, ListItem, ListItemText, ListItemIcon, IconButton, Badge } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
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
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [user]);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                onClick={handleClick}
                ref={anchorRef}
            >
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    style: {
                        width: '30ch',
                        backgroundColor: '#333',
                    },
                }}
            >
                <List dense>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <ListItem
                                button
                                key={notification.id}
                                component={Link}
                                to={`/tasks/${notification.notification_fk.id}`}
                                onClick={handleClose}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#555',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white' }}>
                                    <NotificationsIcon sx={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${notification.message} - ${notification.notification_fk.title}`}
                                    primaryTypographyProps={{ style: { color: 'white' } }}
                                />
                            </ListItem>
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
        </>
    );
}

export default NotificationsDropdown;
