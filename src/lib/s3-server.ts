import AWS from 'aws-sdk';
import fs from 'fs';

export async function downloadFromS3 (file_key: string){
    try {
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

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
        };

        const obj = await s3.getObject(params).on('httpDownloadProgress', evt => {
            console.log('downloading from S3...', parseInt((evt.loaded * 100 / evt.total).toString()) + '%')
        }).promise();

        const filename = `/tmp/pdf-${Date.now()}.pdf`;
        fs.writeFileSync(filename, obj.Body as Buffer);
        return filename;
    }
    catch (err) {
        console.error(err)
        return null
    }
}