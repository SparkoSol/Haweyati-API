import * as webpConverter from 'webp-converter'
export class ImageConversionUtils {

  static imagePath = process.cwd() + '../../uploads'

  static async toWebp(imagePath: string, destination?: string, quality?: number): Promise<void>{
    //Default destination is imagePath and default quality is 20
    await webpConverter.cwebp(imagePath, destination ?? imagePath, "-q "+ quality ?? 20);
  }
}