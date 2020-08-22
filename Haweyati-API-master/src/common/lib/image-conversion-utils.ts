import * as webpConverter from 'webp-converter'
export class ImageConversionUtils {
  static async toWebp(imagePath: string, destination: string, quality: number){
    await webpConverter.cwebp(imagePath, destination, "-q "+quality);
  }
}