export interface dtoFinishingMaterialQuery{
  city: string
  parent: string
  supplier: string
  id: string
  data: dtoFinishingMaterialData
  name: string
}

export interface dtoFinishingMaterialData{
  name: string
}

export interface dtoFinishingMaterial{
  price: string | number
  optionName: string[] | string
  optionValues: string[] | string
  varientName: string[] | string
  varientPrice: string[] | string
  varientWeight: string[] | string
  varientLength: string[] | string
  varientWidth: string[] | string
  varientHeight: string[] | string
  varient: any
  options: any
  volume: any
  webassembly: any
}

