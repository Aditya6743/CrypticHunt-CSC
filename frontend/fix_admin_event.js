const fs = require('fs');

let content = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

const oldToggle = `async function toggleEventState(formData: FormData) {
  "use server";
  const newStatus = formData.get("status") as string;
  const event = await prisma.event.findFirst();
  if (event) {
    await prisma.event.update({ where: { id: event.id }, data: { status: newStatus } });
  } else {
    await prisma.event.create({ data: { status: newStatus } });
  }
  revalidatePath("/admin");
}`;

const newToggle = `async function toggleEventState(formData: FormData) {
  "use server";
  const newStatus = formData.get("status") as string;
  const event = await prisma.event.findFirst();
  if (event) {
    const updateData = { status: newStatus };
    if (newStatus === "LIVE" && !event.startTime) {
      updateData.startTime = new Date();
    }
    await prisma.event.update({ where: { id: event.id }, data: updateData });
  } else {
    await prisma.event.create({ 
      data: { 
        status: newStatus, 
        startTime: newStatus === "LIVE" ? new Date() : null 
      } 
    });
  }
  revalidatePath("/admin");
}`;

content = content.replace(oldToggle, newToggle);
fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', content);
console.log("Admin event toggle fixed");
