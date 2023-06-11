function decodeBase64Image(dataString) {
   
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}
function uploadImage(base46String) {
    try {
        // Decoding base-64 image
        // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
        

        // Regular expression for image type:
        // This regular image extracts the "jpeg" from "image/jpeg"
        const imageTypeRegularExpression = /\/(.*?)$/;

        // Generate random string
        const crypto = require('crypto');
        const seed = crypto.randomBytes(20);
        const uniqueSHA1String = crypto
            .createHash('sha1')
            .update(seed)
            .digest('hex');

        const base64Data = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAZABkAAD/4Q3zaHR0cDovL25zLmFkb2JlLmN...';

        const imageBuffer = decodeBase64Image(base46String);
        const userUploadedFeedMessagesLocation = 'images/';

        const uniqueRandomImageName = 'image-' + uniqueSHA1String;
        // This variable is actually an array which has 5 values,
        // The [1] value is the real image extension
        const imageTypeDetected = imageBuffer
            .type
            .match(imageTypeRegularExpression);

        const userUploadedImagePath = userUploadedFeedMessagesLocation +
            uniqueRandomImageName +
            '.' +
            imageTypeDetected[1];

        // Save decoded binary image to disk
        try {
            require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
                function () {
                    console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                });
        }
        catch (error) {
            console.log('ERROR:', error);
        }
        return userUploadedImagePath;

    }
    catch (error) {
        console.log('ERROR:', error);
    }
}
module.exports = uploadImage;