export interface dtoBuildingMaterialCreateUpdate {
  city: string | string[]
  count: number
  price: number[]
  unit: number[]
  pricing: any[]
}

export interface dtoBuildingMaterialAvailable {
  city: string
  parent: string
}