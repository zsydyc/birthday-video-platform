import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.template.deleteMany();

  await prisma.template.createMany({
    data: [
      // ── Toddler ─────────────────────────────────────────────────────────────
      {
        category: "toddler",
        name: "Sunny Meadow",
        description:
          "Soft watercolour animals sing a gentle birthday song in a sunlit meadow.",
        occasionTags: ["birthday"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "short",
        isActive: true,
      },
      {
        category: "toddler",
        name: "Ocean Dreamtime",
        description:
          "A sleepy adventure under the sea with a personalised bedtime story.",
        occasionTags: ["birthday"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "medium",
        isActive: true,
      },
      {
        category: "toddler",
        name: "Rainbow Farm",
        description:
          "Friendly farm animals celebrate with balloons and a cheerful song.",
        occasionTags: ["birthday"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "short",
        isActive: true,
      },

      // ── Kids ─────────────────────────────────────────────────────────────────
      {
        category: "kids",
        name: "Star Explorer",
        description:
          "The birthday kid blasts off on an epic space mission — hero style.",
        occasionTags: ["birthday"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "short",
        isActive: true,
      },
      {
        category: "kids",
        name: "Jungle Quest",
        description:
          "A wild adventure through a cartoon jungle full of surprises.",
        occasionTags: ["birthday"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "medium",
        isActive: true,
      },
      {
        category: "kids",
        name: "Comedy Hour",
        description: "Funny skits, silly jokes, and a roast only a kid could love.",
        occasionTags: ["birthday"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "short",
        isActive: true,
      },

      // ── Adult Fun ────────────────────────────────────────────────────────────
      {
        category: "adult_fun",
        name: "Heartfelt Tribute",
        description:
          "A warm, cinematic celebration packed with memories and well-wishes.",
        occasionTags: ["birthday", "graduation"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "medium",
        isActive: true,
      },
      {
        category: "adult_fun",
        name: "The Roast",
        description:
          "Good-natured ribbing and laughs — the birthday roast they'll never forget.",
        occasionTags: ["birthday"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "short",
        isActive: true,
      },
      {
        category: "adult_fun",
        name: "Party Anthem",
        description: "High-energy, upbeat celebration video with custom shout-outs.",
        occasionTags: ["birthday"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "short",
        isActive: true,
      },

      // ── Pet ──────────────────────────────────────────────────────────────────
      {
        category: "pet",
        name: "Pawty Time",
        description:
          "A fun, colourful celebration video starring your fur baby.",
        occasionTags: ["birthday", "adoption"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "short",
        isActive: true,
      },
      {
        category: "pet",
        name: "Best in Show",
        description:
          "A documentary-style tribute to the world's most important pet.",
        occasionTags: ["birthday", "adoption"],
        requiredAssets: ["photo"],
        price: 0,
        durationTier: "medium",
        isActive: true,
      },
    ],
  });

  console.log("✅ Seeded templates");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
