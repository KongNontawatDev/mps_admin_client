import { default as dayjs } from 'dayjs';
import { default as customParseFormat } from 'dayjs/plugin/customParseFormat';
import { default as buddhistEra } from 'dayjs/plugin/buddhistEra'
import utc from 'dayjs/plugin/utc'; // Import the UTC plugin
import timezone from 'dayjs/plugin/timezone'; // Import the timezone plugin

dayjs.extend(buddhistEra)
dayjs.extend(customParseFormat);

dayjs.extend(utc);
dayjs.extend(timezone);
const localTimezone = "Asia/Bangkok"

export function toTime(time: any): any {
  if(time == ''  || time == null) {
    return '-'
  }
  const localTime = dayjs.utc(time).tz(localTimezone);
  return localTime.format('HH:mm');
}
export function toDate(date: any): any {
  const localTime = dayjs.utc(date).tz(localTimezone);
  return localTime.format('DD/MM/BBBB');
}

export function toDateTime(datetime: any): any {
  const localTime = dayjs.utc(datetime).tz(localTimezone);
  return localTime.format('DD/MM/BBBB HH:mm');
}

export function getCurrentTimestamp (digit:number=10):number {
  return +new Date().getTime().toString().substring(0,digit)
}

export function calculateDaysApart(startDate: any, endDate: any): number {
  const startDateTime = dayjs(startDate);
  const endDateTime = dayjs(endDate);

  // Calculate the difference in days
  const daysApart = endDateTime.diff(startDateTime, 'day')+1;

  return Math.abs(daysApart); // Use Math.abs to ensure a positive number
}

export function convertHoursToDays(hours: number): any {
  if (hours < 0) {
    return 'Invalid input'; // Handle negative input as needed
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  let result = '';

  if (days > 0) {
    result += `${days} วัน${days > 1 ? '' : ''}`;
  }

  if (remainingHours > 0) {
    if (result !== '') {
      result += ' ';
    }
    result += `${remainingHours} ชม.${remainingHours > 1 ? '' : ''}`;
  }

  if (result === '') {
    result = '0 วัน';
  }

  return result;
}

export function calculateHoursApart(startDate: any, endDate: any): number {
  const startDateTime = dayjs(startDate);
  const endDateTime = dayjs(endDate);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = endDateTime.diff(startDateTime) + 1;

  // Calculate hours from milliseconds
  const hours = Math.floor(diffInMilliseconds / (60 * 60 * 1000));

  return hours; // Return the number of hours as a numeric value
}

export function calculateHoursInRange(startTime: any, endTime: any): any {
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  if (!start.isValid() || !end.isValid()) {
    throw new Error('Invalid date format');
  }

  const duration = end.diff(start, 'hour');

  const hoursInRangeRounded = Math.round(duration); // Round down to the nearest integer

  return hoursInRangeRounded;
}

export function calculateAge(dateString: any): number | null {
  const birthDate = dayjs(dateString);
  const currentDate = dayjs();

  if (!birthDate.isValid()) {
    // Invalid date string, return null or handle the error as needed
    return null;
  }

  const age = currentDate.diff(birthDate, 'year');
  return age;
}

//หาวันที่ย้อนหลัง เริ่มต้น1เดือนก่อน สิ้นสุดวันนี้
export function getValuesBetweenDates() {
  const today = dayjs();

  const startDate = today.subtract(1, 'month');

  const endDate = today;
  return {
    startDate:startDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate:endDate.format('YYYY-MM-DDTHH:mm:ss[Z]')
  }
}
