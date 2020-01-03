const functions = require('firebase-functions')
const { Storage } = require('@google-cloud/storage');
const storage = new Storage ({
  projectId: 'qualification-coin',
  keyFilename: "qualification-coin-firebase-adminsdk-jik4j-73a246a7eb.json"
});


const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const cors = require('cors')({ origin: true });
const Busboy = require('busboy');
const fs = require('fs')
const admin = require('firebase-admin')
const getUniqueName = require('get-unique-name')
admin.initializeApp();

exports.onFileChange = functions.storage.object().onFinalize(event => {
    console.log(event);
    const bucket = storage.bucket('qualification-coin.appspot.com');
    const contentType = event.contentType;
    const filePath = event.name;
    console.log('file detected')

    // if(event.resourceState === 'not_exists') {
    //     console.log('We deleted a file, exit...')
    //     return true;
    // }
    
    if(path.basename(filePath).startsWith('resized-')){
    console.log('already renamed this file')
    return true;
    }

    const destBucket = bucket;
    const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = { predefinedAcl: 'publicRead', contentType : contentType }
    return destBucket.file(filePath).download({
        destination : tmpFilePath
        }).then(() => {
            return spawn('convert', [tmpFilePath, '-resize', '150x150', tmpFilePath]).then(() => null);
        }).then(()=> {
            return destBucket.upload(tmpFilePath, {
                destination: 'user/images/resized-'+ path.basename(filePath),
                metadata: metadata
            })
        }).then((result) => {
            const file = result[0]
            return file.getMetadata()
        }).then(results => {
            const metadata = results[0]
            console.log('metadata=', metadata.mediaLink)
            return metadata.mediaLink
        }).catch(error => {
            console.log(error)
        })
    });
     

exports.uploadFile = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !=='POST'){
        return res.status(500).json({
            message: 'Not allowed'
            })
        }
        const busboy = new Busboy({headers: req.headers});
        let uploadData = null
        busboy.on('file', (fieldname, file, filename, encoding, mimetype)=> {
            let fileext = filename.match(/\.[0-9a-z]+$/i)[0];
            let storagefilename = getUniqueName() + fileext
            const filepath = path.join(os.tmpdir(), storagefilename)
            uploadData = { file: filepath, filename: storagefilename, type: mimetype};
            file.pipe(fs.createWriteStream(filepath));
        });
        
        busboy.on('finish', () => {
            const bucket = storage.bucket('qualification-coin.appspot.com')
        
            bucket.upload(uploadData.file, {
                uploadType: 'media',
                metadata: {
                    predefinedAcl: 'publicRead',
                    metadata: {
                        contentType: uploadData.type
                    }
                }
            }).then((result) => {
                res.status(200).json({
                message: 'It worked',
                generation: result[0].metadata.generation,
                filename: uploadData.filename
                })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })                
            })
        })
       
            busboy.end(req.rawBody)
    })
})

exports.getFile = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !=='POST'){
            return res.status(500).json({
                message: 'Not allowed'
                })
            }
        const storageRef = storage.ref()
        const filename = storageRef.child('/user/images/resized-'+ req.data.filename).getDownloadURL().then((url) => {
        console.log(url)
        return url
        })

        return res.status(200).json({
            downloadURL: filename
        })
        
    })
})