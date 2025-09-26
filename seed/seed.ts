import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with events...");

  const events = [
    {
      title: "Tech Conference 2025",
      description: "Annual technology conference with workshops and networking.",
      location: "Lagos, Nigeria",
    },
    {
      title: "Startup Pitch Night",
      description: "Local startups pitch to investors.",
      location: "Abuja, Nigeria",
    },
    {
      title: "Music Festival",
      description: "A 3-day outdoor music festival with live performances.",
      location: "London, UK",
    },
    {
      title: "Art Expo",
      description: "Gallery showcasing contemporary artists.",
      location: "Berlin, Germany",
    },
    {
      title: "Food Fair",
      description: "International cuisines and street food.",
      location: "Paris, France",
    },
    {
      title: "Charity Marathon",
      description: "Run for a cause, raising funds for local hospitals.",
      location: "Nairobi, Kenya",
    },
    {
      title: "Film Premiere",
      description: "Red carpet event for a blockbuster movie.",
      location: "Los Angeles, USA",
    },
    {
      title: "Book Fair",
      description: "Meet authors and explore new releases.",
      location: "Toronto, Canada",
    },
    {
      title: "Fashion Week",
      description: "Runway shows and designer exhibitions.",
      location: "Milan, Italy",
    },
    {
      title: "Coding Bootcamp",
      description: "Intensive programming bootcamp for beginners.",
      location: "Remote (Online)",
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
