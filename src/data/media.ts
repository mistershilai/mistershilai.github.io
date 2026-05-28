// Media items appear on /media in reverse-chronological order.
// To add an entry, prepend a new MediaItem to the array.

export type MediaItem = {
  date: string; // ISO date, e.g. "2026-03-15"
  title: string;
  description?: string;
  href?: string; // optional link (talk recording, news article, etc.)
};

export const media: MediaItem[] = [
  {
    date: '2026-05-06',
    title: 'Princeton University Senior Thesis Spotlight',
    href: 'https://www.linkedin.com/posts/princeton-university_in-august-2025-botswanas-government-declared-activity-7457121647033233408-Om4o',
  },
  {
    date: '2026-03-15',
    title: 'Presented Kaelo to the Government of Botswana',
    description:
      'Presented the early stages of research on Kaelo to government officials at the Central Medical Stores and Ministry of Health.',
  },
];
