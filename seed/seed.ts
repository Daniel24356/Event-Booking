import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with events...");

  const events = [
    {
      title: "Tech Conference 2025",
      description: "Annual technology conference with workshops and networking.",
      location: "Lagos, Nigeria",
      date: "28-9-2025"
    },
    {
      title: "Startup Pitch Night",
      description: "Local startups pitch to investors.",
      location: "Abuja, Nigeria",
      date: "29-9-2025"
    },
    {
      title: "Music Festival",
      description: "A 3-day outdoor music festival with live performances.",
      location: "London, UK",
      date: "30-9-2025"
    },
    {
      title: "Art Expo",
      description: "Gallery showcasing contemporary artists.",
      location: "Berlin, Germany",
      date: "1-10-2025"
    },
    {
      title: "Food Fair",
      description: "International cuisines and street food.",
      location: "Paris, France",
      date: "2-10-2025"
    },
    {
      title: "Charity Marathon",
      description: "Run for a cause, raising funds for local hospitals.",
      location: "Nairobi, Kenya",
      date: "3-10-2025"
    },
    {
      title: "Film Premiere",
      description: "Red carpet event for a blockbuster movie.",
      location: "Los Angeles, USA",
      date: "4-10-2025"
    },
    {
      title: "Book Fair",
      description: "Meet authors and explore new releases.",
      location: "Toronto, Canada",
      date: "5-10-2025"
    },
    {
      title: "Fashion Week",
      description: "Runway shows and designer exhibitions.",
      location: "Milan, Italy",
      date: "6-10-2025"
    },
    {
      title: "Coding Bootcamp",
      description: "Intensive programming bootcamp for beginners.",
      location: "Remote (Online)",
      date: "7-10-2025"
    },
  ];

  await prisma.event.createMany({
    data: events,
  });

  console.log("Seeding completed!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
