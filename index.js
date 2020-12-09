var Twitter = require('twit');
var fs = require('fs');
var path = require('path');

var T = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN_KEY,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function tweetRandomImage() {
  console.log('getting an image...');
  const num = (Math.floor(Math.random()* 4)+1).toString();
  const imagePath = `./images/${num}.jpg`;
  const b64content = fs.readFileSync( imagePath, { encoding: 'base64' } );

  console.log('uploading image...', imagePath);

  T.post('media/upload', { media_data: b64content }, (err, data, response) => {
    if (err) {
      console.log('error:', err);
    }
    else {
      console.log('tweeting image...');

      T.post( 'statuses/update', {
        media_ids: new Array( data.media_id_string )
      },
        (err, data, response) => {
          if (err) {
            console.log('error:', err);
          }
          else {
            console.log('posted!');
          }
        });

      }
    });
  }

var run = setInterval(function(){tweetRandomImage();}, (60 * 60 * 1000));