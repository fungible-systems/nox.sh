import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%dm',
    h: 'an hour',
    hh: '%dhr',
    d: 'a day',
    dd: '%dd',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%dy',
  },
});

export function toRelativeTime(ts: any) {
  return dayjs(ts).fromNow();
}
