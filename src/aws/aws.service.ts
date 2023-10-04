import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: 'AKIASJ7DBOZUC3JOQX5B',
      secretAccessKey: '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',
    });
  }

  async generatePresignedUrls(
    albumId: string,
    filePaths: string[],
  ): Promise<{ [key: string]: string }> {
    const preSignedUrls = {};

    console.log(process.env.AWS_EXPIRED);
    for (const filePath of filePaths) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${albumId}/${filePath}`,
        Expires: parseInt(process.env.AWS_URL_EXPIRED),
      };

      const url = await this.generatePreSignedUrl(params);
      preSignedUrls[filePath] = url;
    }

    return preSignedUrls;
  }

  private generatePreSignedUrl(params: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }
}
