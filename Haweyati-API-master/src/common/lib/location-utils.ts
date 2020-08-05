import { Client } from '@googlemaps/google-maps-services-js'
export class LocationUtils {
  static async getLocationData(lat: any, lng: any): Promise<any> {
    const client = new Client({})

    let location = null
    try {
      location = await client.reverseGeocode({
        params: {
          latlng: [lat, lng],
          // key: process.env.GOOGLE_MAPS_API_KEY,
          key: 'AIzaSyDSz2Q7d49FVjGoAW2k8eWFXSdQbbipVc8'
        },
        timeout: 1000 // milliseconds
      })
    } catch (e) {
      console.log(e.response)
      console.log(e.response.data.error_message)
    }

    return location
  }

  static async getCity(lat: any, lng: any): Promise<string> {
    const location = await this.getLocationData(lat, lng)
    const length = location.data?.results[0]?.address_components.length
    return location.data?.results[0]?.address_components[length - 3]?.long_name
  }

  static async getAddress(lat: any, lng: any): Promise<string> {
    const location = await this.getLocationData(lat, lng)
    return location.data?.results[0]?.formatted_address
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
