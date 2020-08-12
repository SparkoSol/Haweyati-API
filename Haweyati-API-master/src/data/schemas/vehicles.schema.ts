export const VehiclesSchema = {
   name: {
      type: String,
      required: true
   },
   model : {
      type: String,
      required: true
   },
   identificationNo: {
      type: String,
      unique: true,
      required: true
   },
   type : {
      type: String,
      required : true,
   }
}