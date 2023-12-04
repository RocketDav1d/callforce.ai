import AWS from 'aws-sdk'

export async function uploadToS3(file: File) {
     try {
        console.log('uploading to S3...', file.name)
        console.log("S3_ACCESS_KEY_ID", process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID)
        console.log("S3_SECRET_KEY", process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY)
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'eu-central-1',
        });

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-')

        // new code
        const fileExtension = file.name.split('.').pop();
        let contentType = 'application/octet-stream'; // default binary stream

        if (fileExtension) {
            switch (fileExtension.toLowerCase()) {
                case 'pdf':
                    contentType = 'application/pdf';
                    break;
                case 'mp3':
                    contentType = 'audio/mpeg';
                    break;
                case 'mp4':
                    contentType = 'video/mp4';
                    break;
                case 'wav':
                    contentType = 'audio/wav';
                    break;
                // add other cases as needed
            }
        }
        // new code ends

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file,
            // new code line 
            // contentType: contentType,
        };

        const upload = s3.putObject(params).on('httpUploadProgress', evt => {
            console.log('uploading to S3...', parseInt((evt.loaded * 100 / evt.total).toString()) + '%')
        }).promise();

        console.log(upload)

        await upload.then(data => {
            console.log('successfully uploaded to S3', file_key)
        })

        return Promise.resolve({
            file_key,
            file_name: file.name
        })
     }
     catch (e) {}
}


export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${file_key}`;
    return url; 
}
