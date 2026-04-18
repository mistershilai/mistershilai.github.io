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
  {
    slug: 'vicfalls',
    name: 'Victoria Falls',
    lat: -17.9243,
    lon: 25.8572,
    blurb: 'Mosi-oa-Tunya.',
    photos: [
      { file: 'IMG_4260.jpeg' },
      { file: 'IMG_4274.jpeg' },
      { file: 'IMG_4352.jpeg' },
      { file: 'IMG_4362.jpeg' },
      { file: 'IMG_4512.jpeg' },
      { file: 'IMG_4546.jpeg' },
    ],
  },
  {
    slug: 'capetown',
    name: 'Cape Town, South Africa',
    lat: -33.9249,
    lon: 18.4241,
    blurb: 'Mother City.',
    photos: [
      { file: 'IMG_3922.jpeg' },
      { file: 'IMG_3941.jpeg' },
      { file: 'IMG_3962.jpeg' },
      { file: 'IMG_3991.jpeg' },
      { file: 'IMG_4015.jpeg' },
      { file: 'IMG_4052.jpeg' },
      { file: 'IMG_4116.jpeg' },
      { file: 'IMG_4122.jpeg' },
      { file: 'IMG_4139.jpeg' },
      { file: 'IMG_4143.jpeg' },
      { file: 'IMG_4168.jpeg' },
      { file: 'IMG_4172.jpeg' },
    ],
  },
  {
    slug: 'swakopmund',
    name: 'Swakopmund, Namibia',
    lat: -22.6792,
    lon: 14.5272,
    blurb: 'Mouth of the Swakop.',
    photos: [
      { file: 'IMG_3620.jpeg' },
      { file: 'IMG_3634.jpeg' },
      { file: 'IMG_3668.jpeg' },
      { file: 'IMG_3697.jpeg' },
      { file: 'IMG_3790.jpeg' },
      { file: 'IMG_3797.jpeg' },
      { file: 'IMG_3834.jpeg' },
      { file: 'IMG_3848.jpeg' },
      { file: 'IMG_3877.jpeg' },
    ],
  },
  {
    slug: 'windhoek',
    name: 'Windhoek, Namibia',
    lat: -22.5594,
    lon: 17.0832,
    blurb: 'Windy Corner.',
    photos: [
      { file: 'IMG_3552.jpeg' },
      { file: 'IMG_3553.jpeg' },
      { file: 'IMG_3556.jpeg' },
      { file: 'IMG_3568.jpeg' },
      { file: 'IMG_3576.jpeg' },
    ],
  },
  {
    slug: 'joburg-pretoria',
    name: 'Johannesburg / Pretoria',
    lat: -26.1052,
    lon: 28.0560,
    blurb: 'City of Gold.',
    photos: [
      { file: 'IMG_3273.jpeg' },
      { file: 'IMG_3298.jpeg' },
      { file: 'IMG_3305.jpeg' },
      { file: 'IMG_3316.jpeg' },
      { file: 'IMG_3330.jpeg' },
      { file: 'IMG_3339.jpeg' },
      { file: 'IMG_3383.jpeg' },
    ],
  },
];
