const http = require('http');
const { generateParams, formatMeetups } = require('./helpers');
const token = require('./token.json'); /* file containing Meetup api key e.g. { "key" : "1234abcd" } */

const START_DATE = "2018-04-21";
const END_DATE = "2018-04-27";
const TECH = 292;

let meetupsThisWeek = {};

const params = {
    'photo-host':'public',
    'start_date_range': START_DATE + 'T00%3A00%3A00',
    'end_date_range': END_DATE + 'T23%3A59%3A59',
    'topic_category': TECH,
    'page': 100,
    'radius': 'smart',
    'order': 'time',
    'lon': '153.021072',
    'lat': '-27.470125',
    'fields': 'short_link',
    'key': token.key
}

const url = `http://api.meetup.com/find/upcoming_events?${generateParams(params)}`;


http.get(url, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      meetupsThisWeek = JSON.parse(rawData);
      formatMeetups(meetupsThisWeek, START_DATE, END_DATE);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
