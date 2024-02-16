export const calculateTimeDifference = (targetDateString2) => {
    const targetDateString = targetDateString2 || '';
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2}:\d{2})$/;
    const match = targetDateString.match(dateRegex);
    if (!match) {
        return 'Invalid date format';
    }


    const [, year, month, day, time] = match;
    const [hours, minutes, seconds] = time.split(':');

    const targetDate = new Date(year, month - 1, day, hours, minutes, seconds);

    const currentDate = new Date();

    const timeDifference = currentDate - targetDate;

    const secondsDifference = timeDifference / 1000;

    let timeString;

    if (secondsDifference < 60) {
        timeString = `${Math.floor(secondsDifference)} seconds`;
    } else if (secondsDifference < 60 * 60) {
        const minutes = Math.floor(secondsDifference / 60);
        timeString = `${minutes} minutes`;
    } else if (secondsDifference < 60 * 60 * 24) {
        const hours = Math.floor(secondsDifference / (60 * 60));
        const remainingMinutes = Math.floor((secondsDifference % (60 * 60)) / 60);
        timeString = `${hours} h, ${remainingMinutes} min`;
    } else if (secondsDifference < 60 * 60 * 24 * 7) {
        const days = Math.floor(secondsDifference / (60 * 60 * 24));
        const remainingHours = Math.floor((secondsDifference % (60 * 60 * 24)) / (60 * 60));
        const remainingMinutes = Math.floor((secondsDifference % (60 * 60)) / 60);
        timeString = `${days} d, ${remainingHours} h, and ${remainingMinutes} m`;
    } else {
        const weeks = Math.floor(secondsDifference / (60 * 60 * 24 * 7));
        const remainingDays = Math.floor((secondsDifference % (60 * 60 * 24 * 7)) / (60 * 60 * 24));
        timeString = `${weeks} weeks and ${remainingDays} days`;
    }

    return timeString;
}
