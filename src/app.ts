import { PrismaClient } from '@prisma/client';
import express, { response } from 'express'

// ==> import generated route functions
// import { addEmployeeRoutes } from './api/employeeRoutes';
// import { addBenefitRoutes } from './api/benefitRoutes';

// setup express routes

const app = express()
app.use(express.json());

const prisma = new PrismaClient();

// API end points

/**
   * @swagger
   * /benefits:
   *   get:
   *     summary: Fetch benefits
   *     responses:
   *       200:
   *         description: Returns a list of Benefits.
   *         content:
   *           application/json:
   *             schema: 
   *               type: array
   *               items: 
   *                 $ref: '#/components/schemas/Benefit'
   */
app.get('/benefits', async (req, res) => {
  try {
    const benefits: any = await prisma.benefit.findMany()
    res.json(benefits);
  }
  catch (e: any) {
    console.error(e);
    res.status(400).json({ errors: e.errors });
  }
})

/**
   * @swagger
   * /employees/{id}:
   *   get:
   *     summary: Fetch an employee by id
   *     parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: The unique identifier of the employee.
   *        schema:
   *          type: integer
   *          example: 123
   *     responses:
   *       200:
   *         description: Returns a list of Employees.
   *         content:
   *           application/json:
   *             schema: 
   *               $ref: '#/components/schemas/Employee'
   */
app.get('/employees/:id', async (req, res) => {
  //res.json({ message: 'Implement Me!'}) 
  try {
    const empId: number = parseInt(req.params.id, 10);
    const employee = await prisma.employee.findUnique({
      where: {
        id: empId,
      },
    });
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    const { secret, ...rest } = employee;

    res.json(rest)

  }
  catch (e: any) {
    console.error(e);
    res.status(400).json({ errors: e.errors });
  }
})

/**
 * @swagger
 * /employees/{id}:
 *   patch:
 *     summary: Update employee details
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The unique identifier of the employee.
 *        schema:
 *          type: integer
 *          example: 123
 *     requestBody:
 *       description: Partial employee details to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the employee
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: The last name of the employee
 *                 example: "Smith"
 *     responses:
 *       200:
 *         description: Returns a list of Employees.
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/Employee'
 */
app.patch('/employees/:id', async (req, res) => {
  //res.json({ message: 'Implement Me!'}) 

  try {
    const id: number = parseInt(req.params.id, 10);
    const { firstName, lastName } = req.body

    if (!firstName || !lastName) {
      return res.status(400).json({ msg: 'Please provide first name or last name' });
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id: id,
      },
    });
    if (!employee) {
      res.status(404).json({ msg: 'Employee not found' });
    }

    const UpdateEmployee = await prisma.employee.update({
      where: { id: id },
      data: {
        firstName: firstName,
        lastName: lastName
      }
    });

    const { secret, ...rest } = UpdateEmployee;

    res.json(rest)

  }
  catch (e: any) {
    console.error(e);
    res.status(400).json({ errors: e.errors });
  }

})

app.post('/applications', async (req, res) => {
  //res.json({ message: 'Implement Me!' })
  try {

    const { empId, leave_start_date, leave_end_date } = req.body
    if (!leave_start_date || !leave_end_date || !empId) {
      return res.status(400).json({ msg: 'Please provide empId, leave_start_date, leave_end_date' });
    }
    const employee = await prisma.employee.findUnique({
      where: {
        id: empId,
      },
    });
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    const newApplication = await prisma.application.create({
      data: {
        employeeId: empId,
        leave_start_date: leave_start_date,
        leave_end_date: leave_end_date
      }
    });
    res.json(newApplication)
  }
  catch (e: any) {
    console.error(e);
    res.status(400).json({ errors: e.errors });
  }

})


app.get('/applications/search', async (req, res) => {
  //res.json({ message: 'Implement Me!' })

  try {
    const { employeeId, firstName, lastName, page, limit } = req.body;


    let applications;

    if (!employeeId && !firstName && !lastName && !page && !limit) {
      applications = await prisma.application.findMany()
    }

    else {
      const pgNumber = page > 0 ? page : 1
      const pgsize = limit > 0 ? limit : 5

      if (!employeeId && !firstName && !lastName) {
        applications = await prisma.application.findMany({
          skip: (pgNumber) * pgsize,
          take: pgsize,  // Limit the number of posts returned
          orderBy: {
            employeeId: 'desc',  // Order the posts by creation date, most recent first
          },
        });
      } else {
        const empId = await prisma.employee.findMany({
          where: {
            id: employeeId ? employeeId : undefined,
            firstName: firstName ? firstName : undefined,
            lastName: lastName ? lastName : undefined,
          },
          select: {
            id: true
          }
        });

        const id = empId[0].id

        if (id) {
          applications = await prisma.application.findMany({
            where: { employeeId: id },
            skip: (pgNumber - 1) * pgsize,
            take: pgsize,  // Limit the number of posts returned
            orderBy: {
              employeeId: 'desc',  // Order the posts by creation date, most recent first
            },
          });
        } else {
          return res.status(404).json({ msg: 'Employee not found' });
        }
      }

    }

    res.json(applications)


  }
  catch (e: any) {
    console.error(e);
    res.status(400).json({ errors: e.errors });
  }



})


export default app;