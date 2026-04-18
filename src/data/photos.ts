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
];
