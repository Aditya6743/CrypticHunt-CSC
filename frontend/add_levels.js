const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Level 4
  const level4 = await prisma.level.create({
    data: {
      levelNumber: 4,
      title: "Operation: Darknet Relay",
      description: "We've intercepted a highly encrypted packet stream from the rogue server. The packet contains a signature payload that leads to the final mainframe. Analyze the hexadecimal signature and identify the underlying protocol exploit.\n\n`0x4A 0x61 0x76 0x61 0x53 0x63 0x72 0x69 0x70 0x74`",
      category: "Network Forensics",
      difficulty: "HARD",
      points: 750,
      active: true,
      answers: {
        create: [
          { answer: "javascript" },
          { answer: "Javascript" },
          { answer: "JAVASCRIPT" }
        ]
      },
      hints: {
        create: [
          { hintNumber: 1, content: "Look at the hex values closely. They represent ASCII characters.", penalty: 50 },
          { hintNumber: 2, content: "Convert the hex string to ASCII text to find the exploit vector.", penalty: 100 }
        ]
      }
    }
  });

  console.log("Created Level 4:", level4.id);

  // Create Level 5
  const level5 = await prisma.level.create({
    data: {
      levelNumber: 5,
      title: "THE FINAL BOSS: Mainframe Collapse",
      description: "**CRITICAL ALERT: MAINFRAME BREACHED**\n\nYou have reached the core of the Rogue AI's mainframe. The system is armed with a self-destruct sequence. To disarm it, you must bypass the cryptographic lock by providing the master override passphrase. \n\nWe found a strange encrypted string in the memory dump: `Y3J5cHRpY19tYXN0ZXI=`\n\nDecrypt this string to initiate the final override.",
      category: "Cryptography & Final Boss",
      difficulty: "INSANE",
      points: 1500,
      active: true,
      answers: {
        create: [
          { answer: "cryptic_master" }
        ]
      },
      hints: {
        create: [
          { hintNumber: 1, content: "The string ends with an equals sign. What common encoding uses padding like that?", penalty: 150 },
          { hintNumber: 2, content: "It's Base64 encoding. Decode it to get the final override key.", penalty: 300 }
        ]
      }
    }
  });

  console.log("Created Level 5:", level5.id);
}
main().catch(console.error).finally(() => prisma.$disconnect());
