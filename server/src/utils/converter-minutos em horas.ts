export function convertMinuteStringToMinutes(minutesAnount: number){
    const hours = Math.floor(minutesAnount / 60);
    const minutes = minutesAnount % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}