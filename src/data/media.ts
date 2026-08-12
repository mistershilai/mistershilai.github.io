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
    date: '2026-05-28',
    title: 'Joseph Clifton Elgin Prize, Princeton Engineering',
    description:
      "Awarded to the senior who has done the most to advance the interests of the School of Engineering and Applied Science in the community at large. The citation describes Kaelo as a practitioner-facing application for Botswana's national health system.",
    href: 'https://engineering.princeton.edu/news/2026/05/28/uncertain-time-dean-encourages-graduates-rely-strength-knowledge-and-adaptability',
  },
  {
    date: '2026-05-25',
    title: "Beth N. Rom-Rymer '73 Senior Thesis Prize in Global Health and Health Policy",
    description:
      'Awarded by the Princeton Global Health Program for the most outstanding theses written by students minoring in global health and health policy.',
    href: 'https://globalhealth.princeton.edu/news/2026/2026-senior-thesis-prize-winners',
  },
  {
    date: '2026-05-25',
    title: 'Procter and Gamble Prize, Princeton ORFE',
    description:
      'Awarded to a graduating senior for the best thesis in operations research.',
    href: 'https://orfe.princeton.edu/undergraduate/awards',
  },
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
  {
    date: '2025-01-30',
    title: 'Named a Class of 2026 Health Scholar',
    description:
      'Selected by the Princeton Center for Health and Wellbeing, which funds and mentors independent research in health policy.',
    href: 'https://chw.princeton.edu/news/meet-class-2026-health-scholars',
  },
  {
    date: '2024-11-22',
    title: 'First Place, National College Fed Challenge',
    description:
      'Princeton won the national competition, representing the Philadelphia District. Served as presenter and labor specialist.',
    href: 'https://www.federalreserve.gov/newsevents/pressreleases/other20241122b.htm',
  },
];
