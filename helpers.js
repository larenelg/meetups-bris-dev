const https = require('https');
const groupBy = require('group-by');
const tokens = require('./token.json');

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function _dayOfTheWeek(date) {
    return DAY[(new Date(date)).getDay()];
}

async function _createShortUrl(longUrl) {
    let urlEncodedLongUrl = encodeURIComponent(longUrl);
    let url = `${tokens.bitly.apiAddress}/v3/shorten?access_token=${tokens.bitly.key}&longUrl=${urlEncodedLongUrl}&format=txt`;
    var shortUrl = 'NA';

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const { statusCode } = res;
    
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`);
            }
    
            if (error) {
                console.error(error.message);
                // consume response data to free up memory
                res.resume();
                reject(error);
            }
    
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve(rawData); // short
            });
        });
    });
}

function generateParams(params) {
    var urlParams = '';
    Object.keys(params).forEach(key => urlParams += `&${key}=${params[key]}`);
    return urlParams.substring(1); /* remove first '&' */
}

async function formatMeetups(meetupsJson, startDate, endDate) {
    const city = meetupsJson.city.city;
    const totalMembersInCity = meetupsJson.city.member_count;
    
    console.log(`:pizza: *MEETUPS FOR THE WEEK* :pizza: ${startDate} to ${endDate}`);
    console.log(`\t\t${city} | Tech | \`https://github.com/larenelg/meetups-bris-dev\``);
    
    const eventsThisWeek = meetupsJson.events;
    const eventsGroupdByDate = groupBy(eventsThisWeek, 'local_date');
    const dates = Object.keys(eventsGroupdByDate);
    
    await _asyncForEach(dates, async date => await _outputEvents(date, eventsGroupdByDate));
}

async function _outputEvents(date, eventsGroupdByDate) {
    console.log('\n');
    console.log(`${_dayOfTheWeek(date)}, _${date}_`);
    await _asyncForEach(eventsGroupdByDate[date], async event => await _outputEvent(event));
}

async function _outputEvent(event) {
    const venue = ""; // venue name is too long
    const shortUrl = await _createShortUrl(event.link);
    console.log(`${event.local_time}\t*${event.name}* by _${event.group.name} (${event.yes_rsvp_count} RSVPs)_${venue} | ${shortUrl.trim()}`);
}

async function _asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

module.exports = {
    generateParams,
    formatMeetups
}