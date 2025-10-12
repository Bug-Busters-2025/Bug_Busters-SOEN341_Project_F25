const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short" })
};

const isSameDay = (date1: Date, date2: Date) : boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

const isToday = (date: Date) : boolean => {
    return isSameDay(new Date(), date);
}

const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1)
}

const toYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const weekDays : string[] = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const weekDaysAbreviated : string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const monthsOfYear : string[] = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

export { formatDate, getDayOfWeek, getFirstDayOfMonth, isSameDay, isToday, getDaysInMonth, toYmd, weekDays, weekDaysAbreviated, monthsOfYear };