// Photo data. To add a place:
//   1. Drop images into /public/photos/<slug>/ (e.g. /public/photos/botswana/)
//   2. Add a Place entry below with matching `slug` and filenames.
//
// Photos are displayed in the order listed. Lat/lon is used to place a
// marker on the globe at the top of /photos.

export type Photo = { file: string; caption?: string };

export type Place = {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  year?: string;
  blurb?: string;
  photos: Photo[];
};

export const places: Place[] = [
  {
    slug: 'durban',
    name: 'Durban, South Africa',
    lat: -29.8587,
    lon: 31.0218,
    blurb: 'Largest port in ZA, along the Indian Ocean coast.',
    photos: [
      { file: 'IMG_6633.jpeg' },
      { file: 'IMG_6643.jpeg' },
      { file: 'IMG_6644.jpeg' },
    ],
  },
  {
    slug: 'lesotho-drakensberg',
    name: 'Lesotho / KZN Drakensberg',
    lat: -29.5874,
    lon: 29.2922,
    blurb: 'Kingdom in the sky.',
    photos: [
      { file: 'IMG_6488.jpeg' },
      { file: 'IMG_6496.jpeg' },
      { file: 'IMG_6501.jpeg' },
      { file: 'IMG_6508.jpeg' },
      { file: 'IMG_6557.jpeg' },
      { file: 'IMG_6581.jpeg' },
      { file: 'IMG_6590.jpeg' },
      { file: 'IMG_6599.jpeg' },
    ],
  },
  {
    slug: 'hongkong',
    name: 'Hong Kong',
    lat: 22.3193,
    lon: 114.1694,
    blurb: 'Highest concentration of skyscrapers in the world.',
    photos: [
      { file: 'IMG_5522.jpeg' },
      { file: 'IMG_5546.jpeg' },
      { file: 'IMG_5642.jpeg' },
      { file: 'IMG_5669.jpeg' },
      { file: 'IMG_5674.jpeg' },
      { file: 'IMG_5737.jpeg' },
      { file: 'IMG_5766.jpeg' },
    ],
  },
  {
    slug: 'macau',
    name: 'Macau',
    lat: 22.1987,
    lon: 113.5439,
    blurb: 'Las Vegas of Asia.',
    photos: [
      { file: 'IMG_5439.jpeg' },
      { file: 'IMG_5443.jpeg' },
      { file: 'IMG_5455.jpeg' },
      { file: 'IMG_5497.jpeg' },
      { file: 'IMG_5498.jpeg' },
    ],
  },
  {
    slug: 'yancheng',
    name: 'Yancheng, China',
    lat: 33.3476,
    lon: 120.1630,
    blurb: 'Ancestral homeland.',
    photos: [
      { file: 'IMG_5196.jpeg' },
      { file: 'IMG_5212.jpeg' },
      { file: 'IMG_5224.jpeg' },
      { file: 'IMG_5232.jpeg' },
    ],
  },
  {
    slug: 'istanbul',
    name: 'Istanbul, Türkiye',
    lat: 41.0082,
    lon: 28.9784,
    blurb: 'City on two continents.',
    photos: [
      { file: 'IMG_5144.jpeg' },
      { file: 'IMG_5147.jpeg' },
      { file: 'IMG_5154.jpeg' },
      { file: 'IMG_5160.jpeg' },
      { file: 'IMG_5162.jpeg' },
      { file: 'IMG_5166.jpeg' },
      { file: 'IMG_5177.jpeg' },
    ],
  },
  {
    slug: 'wuxi',
    name: 'Wuxi, China',
    lat: 31.4912,
    lon: 120.3119,
    blurb: 'Pearl of Taihu Lake.',
    photos: [
      { file: 'IMG_5321.jpeg' },
      { file: 'IMG_5329.jpeg' },
      { file: 'IMG_5339.jpeg' },
      { file: 'IMG_5375.jpeg' },
      { file: 'IMG_5387.jpeg' },
    ],
  },
];
