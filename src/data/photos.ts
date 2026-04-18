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
  // Example entry — replace/add as photos come in.
  // {
  //   slug: 'botswana',
  //   name: 'Botswana',
  //   lat: -22,
  //   lon: 24,
  //   year: '2024',
  //   blurb: 'ACHAP + Ministry of Health fieldwork. Gaborone, Serowe, and out to the Central Medical Stores.',
  //   photos: [
  //     { file: 'gaborone-1.jpg', caption: 'Gaborone, at dusk' },
  //     { file: 'cms-visit.jpg', caption: 'Central Medical Stores' },
  //   ],
  // },
];
