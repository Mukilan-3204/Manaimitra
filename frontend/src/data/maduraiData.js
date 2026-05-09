// Madurai District Divisions, Places, and Sample Plot Data

export const divisions = [
  {
    id: 1, name: 'Central', icon: '🏛️',
    description: 'Heart of Madurai — historic temple area, bustling markets, and heritage landmarks.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600'
  },
  {
    id: 2, name: 'North', icon: '🌆',
    description: 'Modern residential hubs — K.K. Nagar, Anna Nagar, and well-planned colonies.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'
  },
  {
    id: 3, name: 'South', icon: '⛰️',
    description: 'Scenic hill views — Pasumalai, Thirupparankundram, and premium residential zones.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600'
  },
  {
    id: 4, name: 'East', icon: '🌿',
    description: 'Rural charm meets growth — Melur, Alanganallur, and emerging investment corridors.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600'
  },
  {
    id: 5, name: 'West', icon: '🏞️',
    description: 'Gateway to the hills — Vadipatti, Usilampatti, and agricultural belt opportunities.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=600'
  }
]

export const places = {
  1: [
    { id: 101, name: 'Meenakshi Temple Area', description: 'Heritage zone near the iconic temple' },
    { id: 102, name: 'Periyar Bus Stand', description: 'Major transit and commercial hub' },
    { id: 103, name: 'Town Hall', description: 'Administrative center of the city' },
    { id: 104, name: 'Teppakulam', description: 'Famous temple tank neighbourhood' },
    { id: 105, name: 'Pudhu Mandapam', description: 'Historical market arcade' },
    { id: 106, name: 'Nethaji Road', description: 'Busy commercial street' },
    { id: 107, name: 'East Masi Street', description: 'Traditional bazaar street' },
    { id: 108, name: 'West Masi Street', description: 'Vibrant market corridor' },
    { id: 109, name: 'South Masi Street', description: 'Cultural shopping area' },
    { id: 110, name: 'North Masi Street', description: 'Heritage commercial district' }
  ],
  2: [
    { id: 201, name: 'K.K. Nagar', description: 'Premium residential colony' },
    { id: 202, name: 'Anna Nagar', description: 'Well-developed residential area' },
    { id: 203, name: 'Arappalayam', description: 'Growing commercial zone' },
    { id: 204, name: 'Tallakulam', description: 'Central residential area' },
    { id: 205, name: 'Koodal Nagar', description: 'Planned township' },
    { id: 206, name: 'Goripalayam', description: 'Historic neighbourhood' },
    { id: 207, name: 'Jaihindpuram', description: 'Popular residential locality' },
    { id: 208, name: 'Aavin', description: 'Industrial and residential mix' },
    { id: 209, name: 'Simmakkal', description: 'Traditional market area' },
    { id: 210, name: 'Villapuram', description: 'Suburban residential zone' }
  ],
  3: [
    { id: 301, name: 'Thirupparankundram', description: 'Temple town with hill views' },
    { id: 302, name: 'Pasumalai', description: 'Hilltop premium locality' },
    { id: 303, name: 'Vilangudi', description: 'Rapidly developing area' },
    { id: 304, name: 'Nagamalai Pudukottai', description: 'Hill-adjacent township' },
    { id: 305, name: 'Surveyor Colony', description: 'Established residential area' },
    { id: 306, name: 'Gomathipuram', description: 'Well-connected locality' },
    { id: 307, name: 'S.S. Colony', description: 'Premium gated community area' },
    { id: 308, name: 'Thirunagar', description: 'Popular residential hub' },
    { id: 309, name: 'Vishwanathapuram', description: 'Growing residential zone' },
    { id: 310, name: 'Thathaneri', description: 'Modern residential neighbourhood' }
  ],
  4: [
    { id: 401, name: 'Melur', description: 'Major taluk headquarters' },
    { id: 402, name: 'Keelavalavu', description: 'Scenic rural area' },
    { id: 403, name: 'Alanganallur', description: 'Famous for Jallikattu' },
    { id: 404, name: 'Sholavandan', description: 'Historic temple town' },
    { id: 405, name: 'Vaigai Dam Area', description: 'Waterfront properties' },
    { id: 406, name: 'Thiruppuvanam', description: 'Weaving town' },
    { id: 407, name: 'Samayanallur', description: 'Suburban growth area' },
    { id: 408, name: 'Othakadai', description: 'Commercial corridor' },
    { id: 409, name: 'T. Kallupatti', description: 'Agricultural hub' },
    { id: 410, name: 'Elumalai', description: 'Rural investment zone' }
  ],
  5: [
    { id: 501, name: 'Vadipatti', description: 'Taluk headquarters' },
    { id: 502, name: 'Usilampatti', description: 'Growing market town' },
    { id: 503, name: 'Andipatti', description: 'Agricultural zone' },
    { id: 504, name: 'Theni Road Area', description: 'Highway corridor' },
    { id: 505, name: 'Perungudi', description: 'Developing locality' },
    { id: 506, name: 'Checkanurani', description: 'Suburban residential' },
    { id: 507, name: 'Thirumangalam', description: 'Major town center' },
    { id: 508, name: 'Peraiyur', description: 'Historic market town' },
    { id: 509, name: 'Kalligudi', description: 'Agricultural hub' },
    { id: 510, name: 'Sedapatti', description: 'Emerging growth area' }
  ]
}

// Generate 10 sample plots per place
function generatePlots(placeId, placeName) {
  const types = ['Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Villa Plot', 'DTCP Approved Plot']
  const plots = []
  for (let i = 1; i <= 10; i++) {
    const type = types[(i - 1) % types.length]
    const area = 600 + Math.floor(Math.random() * 2400)
    const pricePerSqft = 800 + Math.floor(Math.random() * 4200)
    plots.push({
      id: `${placeId}-${i}`,
      placeId,
      title: `${type} in ${placeName} - Plot ${i}`,
      type,
      area,
      price: area * pricePerSqft,
      address: `Plot No. ${i}, ${placeName}, Madurai`,
      description: `Premium ${type.toLowerCase()} available in ${placeName}. Well-connected to main roads, water and electricity supply available. Clear title, ready for registration.`,
      images: [
        `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=80`,
        `https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=400&h=300&fit=crop&q=80`
      ],
      seller: 'Manai Mitra Verified',
      status: 'approved',
      createdAt: new Date(2026, 0, Math.floor(Math.random() * 120) + 1).toISOString()
    })
  }
  return plots
}

// Build full plot data map: placeId -> plots[]
export const plotsByPlace = {}
Object.values(places).flat().forEach(place => {
  plotsByPlace[place.id] = generatePlots(place.id, place.name)
})

export function getDivision(id) {
  return divisions.find(d => d.id === Number(id))
}

export function getPlaces(divisionId) {
  return places[Number(divisionId)] || []
}

export function getPlace(placeId) {
  const pid = Number(placeId)
  for (const list of Object.values(places)) {
    const found = list.find(p => p.id === pid)
    if (found) return found
  }
  return null
}

export function getPlots(placeId) {
  return plotsByPlace[Number(placeId)] || []
}

export function getPlot(plotId) {
  for (const plots of Object.values(plotsByPlace)) {
    const found = plots.find(p => p.id === plotId)
    if (found) return found
  }
  return null
}

export function getDivisionForPlace(placeId) {
  const pid = Number(placeId)
  for (const [divId, list] of Object.entries(places)) {
    if (list.find(p => p.id === pid)) {
      return divisions.find(d => d.id === Number(divId))
    }
  }
  return null
}
