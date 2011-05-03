
/**
 * Returns a url to meetup.com that returns all
 * our members.
 */

var fs = require('fs');

var url = 'https://api.meetup.com/2/members?key={key}&group_urlname=charlottejs';

// substitute this with your own api key to run this example
var meetupkey = fs.readFileSync('/home/aaron/.meetupkey').toString().trim();

exports.url = url.replace(/{key}/, meetupkey);
