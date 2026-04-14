const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const defaults = [
  {
    key: "notification_email",
    value: "pureglimsydney@gmail.com",
  },
  {
    key: "email_intro",
    value: "A new booking enquiry has been submitted via the website. Please review the details below and follow up with the customer within 24 hours.",
  },
  {
    key: "email_footer",
    value: "PureGlim Cleaning Services\nPhone: +61 449 963 099\npureglimsydney@gmail.com\npureglim.com.au",
  },
  {
    key: "customer_email_intro",
    value: "Thanks for reaching out to PureGlim! We've received your request and here's a summary of the details you submitted. Our team will be in touch shortly to confirm your booking.",
  },
  {
    key: "customer_email_footer",
    value: "The PureGlim Team\nPhone: +61 449 963 099\npureglimsydney@gmail.com\npureglim.com.au",
  },
];

async function main() {
  for (const { key, value } of defaults) {
    await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    console.log(`  ✓ ${key}`);
  }
  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
