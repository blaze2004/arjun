import { JsonPresentResponse, ScheduleInfo } from "../types";

export const toCapitalCase=(str: string): string => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
        return char.toUpperCase();
    });
}


export const truncateString=(str: string): string => {
    const words=str.split(' ');
    let result='';
    let count=0;

    for (let i=0; i<words.length; i++) {
        const word=words[i];

        if (count+word.length>24) {
            break;
        }

        result+=`${word} `;
        count+=word.length+1;
    }

    return result.trim();
};

export const convertTo24HourFormat=(timeString: string): string => {
    const regex=/^([1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
    const match=timeString.match(regex);

    if (match) {
        const [_, hour, minute, meridiem]=match;
        let hour24=parseInt(hour);

        if (meridiem.toUpperCase()==="PM"&&hour24!==12) {
            hour24+=12;
        } else if (meridiem.toUpperCase()==="AM"&&hour24===12) {
            hour24=0;
        }

        return `${hour24.toString().padStart(2, "0")}:${minute}`;
    } else if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
        // Time is already in "HH:MM" 24 hour format
        return timeString;
    } else {
        return timeString;
    }
}

export const isJSONPresent=(str: string): JsonPresentResponse => {
    try {
        const jsonList=str.match(/\{[^{}]*\}/);
        if (jsonList!=null) {
            const obj: ScheduleInfo=JSON.parse(jsonList[0]);
            const time24Hour=convertTo24HourFormat(obj.time);
            obj.time=time24Hour;
            return { isJson: true, data: obj };
        }
        return { isJson: false };
    } catch (e) {
        return { isJson: false };
    }
};

export const getTodayDate=(): string => {
    const today=new Date();
    const dd=String(today.getDate()).padStart(2, '0');
    const mm=String(today.getMonth()+1).padStart(2, '0');
    const yyyy=today.getFullYear();
    return dd+'/'+mm+'/'+yyyy;
}

export const validateSchedule=(schedule: ScheduleInfo): boolean => {
    const dateRegex=/^(\d{2})\/(\d{2})\/(\d{4})$/;
    const timeRegex=/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

    const isDateValid=dateRegex.test(schedule.dueDate);
    const isTimeValid=timeRegex.test(schedule.time);

    if (isDateValid&&isTimeValid) {
        return true;
    }

    return false;
};