import { Client } from '@googlemaps/google-maps-services-js'
import { HttpException, HttpStatus } from '@nestjs/common'

export class LocationUtils {
  static async getLocationData(lat: any, lng: any): Promise<any> {
    const client = new Client({})

    let location = null
    try {
      location = await client.reverseGeocode({
        params: {
          latlng: [lat, lng],
          key: 'AIzaSyDSz2Q7d49FVjGoAW2k8eWFXSdQbbipVc8'
        },
        timeout: 1000
      })
    } catch (e) {
      console.log(e.response)
    }
    return location.data
  }

  static async getCity(lat: any, lng: any): Promise<string> {
    const location = await this.getLocationData(lat, lng)
    const length = location?.results[0]?.address_components.length
    console.log(location?.results[0]?.address_components)
    for (const index of location?.results[0]?.address_components) {
      if (index.types.includes('locality')) {
        return index.long_name
      } else if (index.types.includes('administrative_area_level_2')) {
        return index.long_name
      }
    }
    throw new HttpException(
      "can't find city, try again!",
      HttpStatus.NOT_ACCEPTABLE
    )
  }

  static async getAddress(lat: any, lng: any): Promise<string> {
    const location = await this.getLocationData(lat, lng)
    return location?.results[0]?.formatted_address
  }

  // getDistance(p1lat: any, p1lng: any, p2lat: any, p2lng: any){
  //    try {
  //       const p1latlng = new LatLng(p1lat, p1lng)
  //       const p2latlng = new LatLng(p2lat, p2lng)
  //       console.log(((computeDistanceBetween(p1latlng, p2latlng))/1000).toFixed(2) + 'KM')
  //    }
  //    catch (e) {
  //       console.log("Can't find distance")
  //    }
  // }
}
