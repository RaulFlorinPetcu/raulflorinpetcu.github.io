class DateTimeService {
    static format_standard_date(date: Date) {
        const date_month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const date_day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const date_year = date.getFullYear();

        const time_stamp = date.toTimeString().slice(0, 8).trim();
        return `${date_day}-${date_month}-${date_year} ${time_stamp}`;
    }
};

export default DateTimeService;