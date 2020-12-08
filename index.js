var Twitter = require('twit');
var fs = require('fs');
var path = require('path');

var T = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN_KEY,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

console.log('Starting!');

function random_from_array(images){
  return images[Math.floor(Math.random() * images.length)];
}

function tweetRandomImage(){
  fs.readdir( __dirname + '/images', function( err, files ) {
    if ( err ){
      console.log( 'error:', err );
    }
    else{
      let images = [];
      files.forEach( function( f ) {
        images.push( f );
      } );
      console.log('Opening an image...');
      const imagePath = path.join('./images/' + randomFromArray( images ) ),
            b64content = fs.readFileSync( imagePath, { encoding: 'base64' } );

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      T.post('statuses/update', {
        media_ids: new Array(data.media_id_string)
      },
      function(err, data, response) {
        if (err){
          console.log('ERROR:');
          console.log(err);
        }
        else{
          console.log('Posted an image!');
        }
      }
    );
  }
});
}

setInterval( function() {
  tweetRandomImage();
}, (60 * 60 * 1000) );