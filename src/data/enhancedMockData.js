export const enhancedMockData = {
  users: [
    { id: "u-admin-1", role: "admin", name: "Platform Admin", email: "admin@chc.com", phone: "9000000001" },
    { id: "u-org-1", role: "organizer", name: "OMR Grounds Pvt", email: "org1@chc.com", phone: "9000000002" },
    { id: "u-org-2", role: "organizer", name: "Siruseri Sports", email: "org2@chc.com", phone: "9000000003" },
    { id: "u-cap-1", role: "captain", name: "Arun Captain", email: "captain1@chc.com", phone: "9000000004" }
  ],
  organizers: [
    { id: "u-org-1", name: "OMR Grounds Pvt", phone: "9000000002", status: "approved", docs: ["id-proof.pdf", "ground-photos.zip"] },
    { id: "u-org-2", name: "Siruseri Sports", phone: "9000000003", status: "pending", docs: ["id-proof.pdf"] }
  ],
  grounds: [
    {
      id: "g1",
      organizerId: "u-org-1",
      name: "OMR Premier Ground",
      area: "OMR",
      type: "open-ground leather",
      pitchType: "matting",
      ballTypeSupported: ["leather", "tennis"],
      pricePerHour: 2500,
      availableSlots: [{ date: "2026-03-28", start: "06:00", end: "09:00" }],
      isVerified: true,
      organizerContact: "9000000002",
      googleMapsLink: "https://maps.google.com"
    },
    {
      id: "g2",
      organizerId: "u-org-2",
      name: "Siruseri Corporate Oval",
      area: "Siruseri",
      type: "corporate tennis ball",
      pitchType: "turf",
      ballTypeSupported: ["tennis"],
      pricePerHour: 1800,
      availableSlots: [{ date: "2026-03-29", start: "18:00", end: "21:00" }],
      isVerified: false,
      organizerContact: "9000000003",
      googleMapsLink: "https://maps.google.com"
    }
  ],
  teams: [
    {
      id: "team1",
      captainUserId: "u-cap-1",
      name: "Tidel Titans",
      companyName: "ABC Tech",
      level: "corporate",
      primaryArea: "Tidel Park",
      captainName: "Arun Captain",
      captainPhone: "9000000004",
      cricHeroesProfileUrl: "https://www.cricheroes.com"
    }
  ],
  matches: [
    {
      id: "m1",
      postedByUserId: "u-cap-1",
      groundId: "g1",
      date: "2026-03-30",
      startTime: "06:30",
      endTime: "09:00",
      ballType: "leather",
      format: "T20",
      level: "serious amateur",
      status: "open",
      organizerTeamName: "Tidel Titans",
      lookingForOpponent: true,
      notes: "Need strong opponent"
    }
  ],
  tournaments: [
    {
      id: "t1",
      organizerId: "u-org-1",
      name: "Chennai Corporate Champions Cup",
      season: "Summer 2026",
      locationArea: "Tidel Park",
      ballType: "tennis",
      startDate: "2026-04-10",
      endDate: "2026-05-10",
      status: "upcoming",
      numberOfTeams: 16,
      prizePool: "₹2,00,000",
      usesCricHeroes: true,
      cricHeroesLink: "https://www.cricheroes.com"
    }
  ],
  bookings: [
    { id: "b1", captainUserId: "u-cap-1", groundId: "g1", date: "2026-03-31", start: "07:00", end: "09:00" }
  ],
  verificationRequests: []
};