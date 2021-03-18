import * as webpConverter from 'webp-converter'

export class ImageConversionUtils {
  static imagePath = process.cwd() + '../../uploads'

  static async toWebp(
    imagePath: string,
    destination = imagePath,
    quality = 20
  ): Promise<void> {
    await webpConverter.cwebp(imagePath, destination, '-q ' + quality)
  }
}