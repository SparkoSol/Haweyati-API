export const LocationSchema = {
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  address : {
    type: String,
    required: false
  }
}
