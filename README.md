# InnTrack

Property management software for small accommodation businesses — guesthouses, motels and villas around Lake Ohrid and Struga, North Macedonia.

**Live:** [inntrackpage.vercel.app](https://inntrackpage.vercel.app)

## The problem

Small properties in the region run on paper ledgers, WhatsApp messages and a whiteboard behind reception. Existing property management systems are priced and designed for hotel chains — too expensive, too complex, and rarely localised. InnTrack targets the ten-to-thirty-room operator who needs to know who is arriving today and which rooms are clean.

## What it does

- **Availability calendar** — a room-by-night grid showing occupancy at a glance, with drag-free booking entry
- **Reservations** — guest details, stay dates, rates and status in one place
- **Housekeeping** — per-room cleaning status that updates as guests check in and out
- **Statistics** — occupancy rate and revenue over a selected period
- **Installable** — a progressive web app, so reception staff can run it from a phone or tablet without an app store

## Stack

| | |
|---|---|
| Framework | Next.js |
| Database & auth | Supabase (PostgreSQL) |
| Styling | CSS |
| Delivery | Progressive Web App — installable, custom splash screen and icons |
| Hosting | Vercel |

## Running locally

```bash
git clone https://github.com/rronnnnn/inntrackpage.git
cd inntrackpage
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Status

In active development and seeking its first production properties. Built and maintained by [Rron Tuda](https://github.com/rronnnnn) under [High Level](https://www.highlevel.mk).

## Contact

mkhighlevel@gmail.com
