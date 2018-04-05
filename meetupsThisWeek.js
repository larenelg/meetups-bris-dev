let startDate = "2018-04-07";
let endDate = "2018-04-13";

const meetupsThisWeek = require(`./meetups-brisbane-tech__${startDate}_to_${endDate}.json`);
const groupBy = require('group-by');

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function _dayOfTheWeek(date) {
    return DAY[(new Date(date)).getDay()];
}

const city = meetupsThisWeek.city.city;
const totalMembersInCity = meetupsThisWeek.city.member_count;

console.log(`:pizza: *MEETUPS FOR THE WEEK* :pizza: ${startDate} to ${endDate}`);
console.log(`\t\t${city} | Tech | ${totalMembersInCity} total members`);

const eventsThisWeek = meetupsThisWeek.events;
const eventsGroupdByDate = groupBy(eventsThisWeek, 'local_date');
const dates = Object.keys(eventsGroupdByDate);

dates.forEach(date => {
    console.log('\n');    
    console.log(`${_dayOfTheWeek(date)}, _${date}_`);
    eventsGroupdByDate[date].forEach(event => {
        let venue = "";
        // if (event.venue) {
        //     venue = ` | _${event.venue.name}, ${event.venue.address_2 ? event.venue.address_2 : event.venue.address_1}_`
        // }
        console.log(`${event.local_time}\t*${event.name}* by _${event.group.name} (${event.yes_rsvp_count} RSVPs)_${venue} | ${event.short_link}`);
    });
});

// 17:30      *April Meetup * by _Brisbane Dynamics 365 User Group (27 RSVPs)_ |  | http://meetu.ps/e/F2bRP/rzNlF/i
