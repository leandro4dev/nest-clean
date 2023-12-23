import {
  UploadParams,
  Uploader,
} from "@/domain/forum/application/storage/uploader";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class S3Storage implements Uploader {
  private client: S3Client;

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      endpoint: envService.get("AWS_ACCESS_POINT"),
      region: envService.get("AWS_ACCESS_REGION"),
      credentials: {
        accessKeyId: envService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: envService.get("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get("AWS_BUCKET_NAME"),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return {
      url: uniqueFileName,
    };
  }
}
