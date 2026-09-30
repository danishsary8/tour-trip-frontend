/**
 * Local mock data for the destinations list — Cambodian regions, cities and spots.
 * Fields mirror the `destinations_tb` table exactly:
 * destination_id, name, description, image, created_at.
 * Descriptions are kept to a single short line so they render without truncating.
 * Replace with a destinationService call once the API is ready.
 */
export const mockDestinations = [
  {
    destination_id: 1,
    name: 'Siem Reap',
    description: 'Gateway city to the Angkor temple complex.',
    image: 'https://picsum.photos/seed/siemreap/160/160',
    created_at: '2024-05-20T09:15:00Z',
  },
  {
    destination_id: 2,
    name: 'Angkor Wat',
    description: 'The largest religious monument in the world.',
    image: 'https://picsum.photos/seed/angkorwat/160/160',
    created_at: '2024-05-28T08:00:00Z',
  },
  {
    destination_id: 3,
    name: 'Phnom Penh',
    description: 'Riverside capital and cultural heart.',
    image: 'https://picsum.photos/seed/phnompenh/160/160',
    created_at: '2024-06-02T11:40:00Z',
  },
  {
    destination_id: 4,
    name: 'Koh Rong',
    description: 'White-sand island in the Gulf of Thailand.',
    image: 'https://picsum.photos/seed/kohrong/160/160',
    created_at: '2024-06-18T08:05:00Z',
  },
  {
    destination_id: 5,
    name: 'Battambang',
    description: 'Colonial river town and bamboo train.',
    image: 'https://picsum.photos/seed/battambang/160/160',
    created_at: '2024-07-04T14:22:00Z',
  },
  {
    destination_id: 6,
    name: 'Kampot',
    description: 'Pepper farms below Bokor Mountain.',
    image: 'https://picsum.photos/seed/kampot/160/160',
    created_at: '2024-07-22T10:30:00Z',
  },
  {
    destination_id: 7,
    name: 'Kep',
    description: 'Seaside town known for its crab market.',
    image: '',
    created_at: '2024-08-11T06:50:00Z',
  },
  {
    destination_id: 8,
    name: 'Sihanoukville',
    description: 'Port city and gateway to the islands.',
    image: 'https://picsum.photos/seed/sihanoukville/160/160',
    created_at: '2024-09-27T16:30:00Z',
  },
  {
    destination_id: 9,
    name: 'Kratié',
    description: 'Mekong town with Irrawaddy dolphins.',
    image: 'https://picsum.photos/seed/kratie/160/160',
    created_at: '2024-10-09T10:05:00Z',
  },
  {
    destination_id: 10,
    name: 'Mondulkiri',
    description: 'Forested highlands and waterfalls.',
    image: 'https://picsum.photos/seed/mondulkiri/160/160',
    created_at: '2024-11-15T13:45:00Z',
  },
  {
    destination_id: 11,
    name: 'Preah Vihear Temple',
    description: 'Clifftop temple on the Dangrek range.',
    image: 'https://picsum.photos/seed/preahvihear/160/160',
    created_at: '2024-12-01T07:20:00Z',
  },
  {
    destination_id: 12,
    name: 'Banteay Srei',
    description: 'Pink sandstone temple with fine carving.',
    image: 'https://picsum.photos/seed/banteaysrei/160/160',
    created_at: '2025-01-19T09:10:00Z',
  },
];
