import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { CreatePhotoDto } from 'src/photo/dto/create-photo.dto';

@Injectable()
export class AwsService {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_RIGION,
    });
  }

  async generatePresignedUrls(
    createPhotoDto: CreatePhotoDto,
  ): Promise<{ [key: string]: string }> {
    const { albumId, fileInfos } = createPhotoDto;

    const preSignedUrls = {};
    for (const fileInfo of fileInfos) {
      const [filename, filetype] = fileInfo.split('|');

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${albumId}/${filename}`,
        Expires: parseInt(process.env.AWS_URL_EXPIRED),
        ContentType: filetype,
      };

      const url = await this.generatePreSignedUrl(params);
      preSignedUrls[filename] = url;
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
