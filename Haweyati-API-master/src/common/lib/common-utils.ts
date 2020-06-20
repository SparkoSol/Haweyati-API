import { get } from 'https'

export class CommonUtils {
  static async download(url: string) {
    return new Promise((resolve, reject) => {
      get(url, async res => {
        let data = ''

        if (res.headers.location) {
          resolve(await this.download(res.headers.location))
        } else {
          res.on('data', chunk => (data += chunk))
          res.on('end', () => resolve(data))

          res.on('error', reject)
        }
      }).on('error', reject)
    })
  }
}
