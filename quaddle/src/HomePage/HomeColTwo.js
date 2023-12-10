import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faFireFlameCurved, faBroom, faCirclePause } from '@fortawesome/free-solid-svg-icons';
import LastThirtyDaysBar from '../Charts/LastThirtyDaysBar';
import React, { useState, useEffect } from 'react';
import { getTaskCounts } from '../Charts/CalculateData';
import { useAuth } from '../Account/AuthContext/authContext';
import PriorityChart from '../Charts/PriorityChart';
import DifficultyChart from '../Charts/DifficultyChart';
import { useNotification } from '../Functions/NotificationContext';
import UnitsChart from '../Charts/UnitChart';

function HomeColTwo() {
    const { user } = useAuth();
    const showNotification = useNotification();

    const [taskCounts, setTaskCounts] = useState({
        closedToday: 0,
        closedThisWeek: 0,
        myPending: 0,
        allPending: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newTaskCounts = await getTaskCounts(user);
                setTaskCounts(newTaskCounts);
            } catch (error) {
                showNotification('Error fetching task counts:', error);

            }
        };

        fetchData();
    }, [user, showNotification]); // Include other dependencies if needed
    const cardTop = {
        card1: ['Closed today', taskCounts.closedToday, faFire],
        card2: ['Closed this week', taskCounts.closedThisWeek, faFireFlameCurved],
        card3: ['My pending', taskCounts.myPending, faBroom],
        card4: ['All pending', taskCounts.allPending, faCirclePause],
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
                                <LastThirtyDaysBar />
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
                                <UnitsChart />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeColTwo;
