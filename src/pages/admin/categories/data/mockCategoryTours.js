export const mockCategoryTours = {
  1: [
    { id: 'TR-001', name: 'Angkor Wat Sunrise Explorer', duration: '2 Days', price: '$89', status: 'active' },
    { id: 'TR-002', name: 'Siem Reap Temple Circuit', duration: '3 Days', price: '$149', status: 'active' },
    { id: 'TR-003', name: 'Battambang Heritage Walk', duration: '1 Day', price: '$39', status: 'active' },
    { id: 'TR-004', name: 'Royal Palace & Silver Pagoda', duration: '1 Day', price: '$29', status: 'inactive' },
    { id: 'TR-027', name: 'Preah Vihear Cliffside Temple', duration: '2 Days', price: '$139', status: 'active' },
  ],
  2: [
    { id: 'TR-005', name: 'Koh Rong Island Escape', duration: '3 Days', price: '$199', status: 'active' },
    { id: 'TR-006', name: 'Sihanoukville Beach Hopping', duration: '2 Days', price: '$119', status: 'active' },
    { id: 'TR-007', name: 'Koh Rong Samloem Snorkeling', duration: '1 Day', price: '$59', status: 'active' },
    { id: 'TR-008', name: 'Kep Crab Market & Coastline', duration: '1 Day', price: '$45', status: 'active' },
    { id: 'TR-009', name: 'Sunset Sailing Sihanoukville', duration: '1 Day', price: '$65', status: 'inactive' },
    { id: 'TR-028', name: 'Koh Ta Kiev Camping Retreat', duration: '2 Days', price: '$109', status: 'active' },
  ],
  3: [
    { id: 'TR-010', name: 'Cardamom Mountains Trek', duration: '4 Days', price: '$259', status: 'active' },
    { id: 'TR-011', name: 'Bokor Hill Station Hike', duration: '1 Day', price: '$49', status: 'active' },
    { id: 'TR-012', name: 'Kirirom National Park Trek', duration: '2 Days', price: '$99', status: 'active' },
    { id: 'TR-013', name: 'Phnom Kulen Waterfall Climb', duration: '1 Day', price: '$55', status: 'active' },
    { id: 'TR-029', name: 'Elephant Mountains Overnight Trek', duration: '2 Days', price: '$149', status: 'active' },
  ],
  4: [
    { id: 'TR-014', name: 'Phnom Penh City Highlights', duration: '1 Day', price: '$35', status: 'active' },
    { id: 'TR-015', name: 'Siem Reap Night Market Tour', duration: '1 Day', price: '$25', status: 'active' },
    { id: 'TR-016', name: 'Battambang Bamboo Train & Town', duration: '1 Day', price: '$32', status: 'active' },
    { id: 'TR-017', name: 'Phnom Penh Street Food Walk', duration: '1 Day', price: '$28', status: 'inactive' },
    { id: 'TR-030', name: 'Kampot Riverside City Tour', duration: '1 Day', price: '$30', status: 'active' },
  ],
  5: [
    { id: 'TR-018', name: 'Tonle Sap Floating Village Safari', duration: '1 Day', price: '$42', status: 'active' },
    { id: 'TR-019', name: 'Mondulkiri Elephant Sanctuary', duration: '2 Days', price: '$179', status: 'active' },
    { id: 'TR-020', name: 'Cardamom Rainforest Wildlife Spotting', duration: '3 Days', price: '$229', status: 'active' },
    { id: 'TR-021', name: 'Bengal Florican Bird Watching', duration: '1 Day', price: '$69', status: 'active' },
  ],
  6: [
    { id: 'TR-022', name: 'Ratanakiri Waterfall Adventure', duration: '3 Days', price: '$189', status: 'active' },
    { id: 'TR-023', name: 'Mekong River Kayaking', duration: '1 Day', price: '$55', status: 'active' },
    { id: 'TR-024', name: 'Cardamom Zipline Canopy Tour', duration: '1 Day', price: '$79', status: 'active' },
    { id: 'TR-025', name: 'Koh Kong Jungle ATV Ride', duration: '1 Day', price: '$89', status: 'inactive' },
    { id: 'TR-026', name: 'Angkor Cycling Backroads', duration: '2 Days', price: '$129', status: 'active' },
  ],
};

export function getToursForCategory(categoryId) {
  return mockCategoryTours[categoryId] ?? [];
}
