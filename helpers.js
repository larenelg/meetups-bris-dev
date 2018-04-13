const groupBy = require('group-by');

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function _dayOfTheWeek(date) {
    return DAY[(new Date(date)).getDay()];
}

function generateParams(params) {
    var urlParams = '';
    Object.keys(params).forEach(key => urlParams += `&${key}=${params[key]}`);
    return urlParams.substring(1); /* remove first '&' */
}

function formatMeetups(meetupsJson, startDate, endDate) {
    const city = meetupsJson.city.city;
    const totalMembersInCity = meetupsJson.city.member_count;
    
    console.log(`:pizza: *MEETUPS FOR THE WEEK* :pizza: ${startDate} to ${endDate}`);
    console.log(`\t\t${city} | Tech | ${totalMembersInCity} total members`);
    
    const eventsThisWeek = meetupsJson.events;
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
}

module.exports = {
    generateParams,
    formatMeetups
}