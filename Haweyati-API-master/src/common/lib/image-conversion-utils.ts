import * as webpConverter from 'webp-converter'
export class ImageConversionUtils {

  static imagePath = process.cwd() + '../../uploads'

  static async toWebp(imagePath: string, destination: string, quality: number){
    await webpConverter.cwebp(imagePath, destination, "-q "+quality);
  }
}