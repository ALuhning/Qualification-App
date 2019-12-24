exports.handler = function(event, context, callback) {
    const tokenId = event.queryStringParameters.tokenId
    const metadata =  {
    "name": "Token #" + tokenId,
    "description": "Describes the asset to which this token represents",
    "image": "https://dummyimage.com/600x400/000000/fff/&text=token%20" + tokenId,
}
    console.log("EVENT", event)
    console.log("CONTEXT", context)
    callback(null, {
        statusCode: 200,
        body: JSON.stringify(metadata)
    });
  };



