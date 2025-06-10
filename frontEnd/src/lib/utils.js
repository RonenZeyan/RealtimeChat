
export function FormatMessageTime(date){
    return new Date(date).toLocaleTimeString("he-IL",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false,
    })
}