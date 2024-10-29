import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

const benefitData: Prisma.BenefitCreateInput[] = [
  {
    name: 'Medical Leave'
  },
  {
    name: 'Family Leave'
  }
]

const employeeData: Prisma.EmployeeCreateInput[] = [
  {
    firstName: 'Jane',
    lastName: 'Smith',
    date_of_birth: '2014-09-08T08:02:17-05:00',
    secret: 'jane-secret'
  },
  {
    firstName: 'John',
    lastName: 'Smith',
    date_of_birth: '1097-09-08T08:02:17-05:00',
    secret: 'john-secret'
  },
]

const applicationData: Prisma.ApplicationCreateInput[] = [
  {
    employeeId: 7,
    leave_start_date: '2014-09-08T08:02:17-05:00',
    leave_end_date: '2014-09-08T09:02:17-05:00'
  },
  {
    employeeId: 8,
    leave_start_date: '2014-09-08T08:02:17-05:00',
    leave_end_date: '2014-09-08T09:02:17-05:00'
  },
]


async function main() {
  console.log(`Start seeding`, process.env.DATABASE_URL)
  for (const u of benefitData) {
    await prisma.benefit.create({
      data: u,
    })
  }
  console.log('seeded benefits')

  for (const u of employeeData) {
    await prisma.employee.create({
      data: u,
    })
  }
  console.log('seeded employees')

  for (const u of applicationData) {
    await prisma.application.create({
      data: u,
    })
  }
  console.log(`Seeded application`)
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
