export type PlacePriceRange = 0 | 1 | 2 | 3 | 4

export type PlaceFilter = {
  isOpenNow: boolean
  priceRange: Partial<{
    min: PlacePriceRange,
    max: PlacePriceRange
  }>,
  location: [number, number],
  ratings: number,
}

export type PlaceRequestParam = {
  location: string
  query: string
  radius: string
  key: string
  opennow: boolean
  minprice: PlacePriceRange
  maxprice: PlacePriceRange
}
