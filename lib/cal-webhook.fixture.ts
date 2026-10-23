// Shape of Cal.com's BOOKING_CREATED webhook (trimmed)
export const created = {
  triggerEvent: 'BOOKING_CREATED',
  createdAt: '2026-10-23T04:48:00.000Z',
  payload: {
    uid: 'bk_123',
    title: 'OnPuck x Diego Orrego (test) - Founder chat',
    startTime: '2026-10-27T02:30:00Z',
    endTime: '2026-10-27T03:00:00Z',
    attendees: [{ email: 'Diego@Woku.app', name: 'Diego Orrego (test)', timeZone: 'America/Santiago' }],
    responses: {
      name: { label: 'your_name', value: 'Diego Orrego (test)' },
      email: { label: 'email_address', value: 'diego@woku.app' },
      'startup-website': { label: 'Startup website', value: 'https://www.woku.app/en' },
      interviews: { label: 'Do you run user interviews?', value: 'Not yet, but planning to' },
      guests: { label: 'Additional guests', value: [] },
      notes: { label: 'Additional notes', value: '' },
    },
  },
};
