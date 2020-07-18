export const VehiclesSchema = {
   name: String,
   model : String,
   identificationNo: String,
   type : {
      type: [String],
      required : false,
   }
}