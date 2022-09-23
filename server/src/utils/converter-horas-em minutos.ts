export function convertHourStringToMinutes(hourString: string){
    const [hours, minutes] = hourString.split(':').map(Number)

    const minutesAnount = (hours * 60) + minutes;

    return minutesAnount;
}