import S3 from "aws-sdk/clients/s3";
import Jimp from "jimp";

exports.handler = async req => {
  try {
    //return "a";
    //if (req.queryStringParameters && req.queryStringParameters.key) {

    const s3 = new S3({
      accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY
    });
    return new Promise(res => {
      var sourceParams = { Bucket: "my-library-cover-upload-staging", Key: "big-image.jpg" };
      s3.getObject(sourceParams, (err, data) => {
        if (err) {
          return res(err);
        }
        const originalImg = data.Body; //.toString('base64');
        
        Jimp.read(originalImg, function(err, image) {
          if (err || !image) {
            return res(err);
          }
          
          try {
            if (image.bitmap.width > 100) {
              image.resize(100, Jimp.AUTO);
              
              image.getBuffer(image.getMIME(), (err, body) => {
                if (err){
                  return res(err);
                }
                var params = { Bucket: "my-library-cover-upload-staging", Key: "resized.jpg", Body: body };
                
                s3.upload(params, function(err, data) {
                  res(err || "success");
                });
              });
            } else {
              return res("no upload");
            }
          } catch (err) {
            console.log("H", err);
            return res(null);
          }
        });
      });
    });
    //}
    return "";
  } catch (err) {
    return "Err " + (err || "nothing");
  }
};
