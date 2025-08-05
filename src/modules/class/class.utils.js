import { createError } from "../../common/utils/create-error.js";

export const generateSessionDates = (
    startDate,
    totalSessions,
    daysOfWeek = [1],
) => {
    if(!daysOfWeek || daysOfWeek.length === 0) {
        throw createError(400, "daysOfWeek is required and cannot be empty");
    }
    const sessionDates = [];
    let sessionCount = 0;
    let currentWeek = 0;

    while(sessionCount < totalSessions) {
        for(const day of daysOfWeek) {
            if(sessionCount >= totalSessions) break;
            const nextDate = new Date(startDate);
            nextDate.setDate(
                startDate.getDate() + ((day - startDate.getDay() + 7) % 7) + currentWeek * 7,
            );
            sessionDates.push(nextDate);
            sessionCount++;
        }
        currentWeek++;
    }

    return sessionDates.sort((a, b) => a - b);
}