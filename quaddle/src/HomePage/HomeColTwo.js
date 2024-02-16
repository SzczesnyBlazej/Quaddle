import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faFireFlameCurved, faBroom, faCirclePause } from '@fortawesome/free-solid-svg-icons';
import LastThirtyDaysBar from '../Charts/LastThirtyDaysBar';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Account/AuthContext/authContext';
import PriorityChart from '../Charts/PriorityChart';
import DifficultyChart from '../Charts/DifficultyChart';
import { useNotification } from '../Functions/NotificationContext';
import UnitsChart from '../Charts/UnitsChart';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';
import axios from 'axios';

function HomeColTwo() {
    const { authState } = useAuth();
    const user = authState.user;
    const showNotification = useNotification();

    const [taskCounts, setTaskCounts] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.GET_TASKS_COUNTS_DASHBOARD, {
                    params: {
                        userID: user && user.id,
                    },
                });
                setTaskCounts(response.data);
            } catch (error) {
                showNotification('Error fetching task counts:', error);

            }
        };

        fetchData();
    }, [user]);
    const cardTop = {
        card1: ['Closed today', taskCounts && taskCounts.closed_today_count, faFire],
        card2: ['Closed this week', taskCounts && taskCounts.closed_this_week_count, faFireFlameCurved],
        card3: ['My pending', taskCounts && taskCounts.my_pending_count, faBroom],
        card4: ['All pending', taskCounts && taskCounts.all_pending_count, faCirclePause],
    };


    return (

        <div className="col-md-8 dark-bg min-vh-100 border-start border-end border-secondary ">

            <div className="p-5" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                <div className="row">
                    {Object.entries(cardTop).map(([key, value]) => (
                        <React.Fragment key={key}>
                            <div className="col-md-3">
                                <div className="card light-bg text-light text-center">
                                    <div className="card-body">
                                        <div className='mt-3'><FontAwesomeIcon icon={value[2]} size="2xl" /></div>
                                        <h2 className="card-title m-4">{value[1]}</h2>
                                        <div className="card-subtitle">{value[0]}</div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className='row pt-4'>
                    <div className="col">
                        <div className="card light-bg text-light">
                            <div className="card-body">
                                <LastThirtyDaysBar user={user} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row pt-4">
                    <div className="col-md-4">
                        <div className="card light-bg text-light">
                            <div className="card-body">
                                <h5 className="card-title">Priority</h5>

                                <PriorityChart user={user} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card light-bg text-light">
                            <div className="card-body">
                                <h5 className="card-title">Difficulty</h5>
                                <DifficultyChart user={user} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card light-bg text-light">
                            <div className="card-body">
                                <h5 className="card-title">Units</h5>
                                <UnitsChart user={user} />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeColTwo;
