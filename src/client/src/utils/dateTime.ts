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

const daysInMonth = (y: number, m: number) => 
    new Date(y, m + 1, 0).getDate();

const toYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const daysOfWeek : Array<string> = [ 
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" 
];

const monthsOfYear : Array<string> = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

export { formatDate, getDayOfWeek, daysOfWeek, monthsOfYear, isSameDay, daysInMonth, toYmd };