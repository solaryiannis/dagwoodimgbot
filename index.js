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
  /* First, read the content of the images folder. */

  fs.readdir( __dirname + '/images', function( err, files ) {
    if ( err ){
      console.log( 'error:', err );
      return;
    }
    else{
      let images = [];
      files.forEach( function( f ) {
        images.push( f );
      } );

      console.log( 'opening an image...' );

      const imagePath = path.join( __dirname, '/images/' + randomFromArray( images ) ),
            b64content = fs.readFileSync( imagePath, { encoding: 'base64' } );

      console.log( 'uploading an image...', imagePath );

      T.post( 'media/upload', { media_data: b64content }, function ( err, data, response ) {
        if ( err ){
          console.log( 'error:', err );
        }
        else{
          console.log( 'image uploaded, now tweeting it...' );

          T.post( 'statuses/update', {
            media_ids: new Array( data.media_id_string )
          },
            function( err, data, response) {
              if (err){
                console.log( 'error:', err );
              }
              else{
                console.log( 'posted an image!' );
              }
            }
          );
        }
      } );
    }
  } );
}

setInterval( function() {
  tweetRandomImage();
}, (60 * 60 * 1000));