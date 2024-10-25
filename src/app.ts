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
    // const { employeeId, firstName, lastName, page, limit } = req.body;

    const employeeId = parseInt(req.query.employeeId?.toString() ?? '0', 10);
    const page = parseInt(req.query.page?.toString() ?? '0', 10);
    const limit = parseInt(req.query.limit?.toString() ?? '0', 10);
    const firstName = req.query.firstName?.toString();
    const lastName = req.query.lastName?.toString();


    let applications;

    if (!employeeId && !firstName && !lastName && !page && !limit) {
      console.log('no params provided')
      applications = await prisma.application.findMany()
    }

    else {
      console.log('any of the params are provided!')

      if (page || limit) {
        let pgNumber = page > 0 ? page : 1
        const pgsize = limit > 0 ? limit : 5
        console.log('either of page or limit provided!')
        if (!employeeId && !firstName && !lastName) {
          console.log('no first last, or employeeId provided!')
          const appCount = await prisma.application.count()
          if (appCount <= limit) {
            console.log('app count is less than limit, pull all records!')
            applications = await prisma.application.findMany({

              orderBy: {
                employeeId: 'desc',  
              },
            });
          } else {
            console.log('app count is greater than the limit so pagination took place for all records!')
            applications = await prisma.application.findMany({
              skip: (pgNumber - 1) * pgsize,
              take: pgsize,  
              orderBy: {
                employeeId: 'desc',  
              },
            });
          }

        } else {
          console.log('first, last or employeeId provided!')
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
          console.log('searching for employeeId' + id)
          if (id) {
            const appCount = await prisma.application.count({
              where: { employeeId: id }
            });
            if(appCount <= pgsize){
              applications = await prisma.application.findMany({
                where: { employeeId: id },
                orderBy: {
                  employeeId: 'desc',  
                },
              });
            }
            else {
              applications = await prisma.application.findMany({
                where: { employeeId: id },
                skip: (pgNumber - 1) * pgsize,
                take: pgsize,  
                orderBy: {
                  employeeId: 'desc',  
                },
              });
            }
          } else {
            return res.status(404).json({ msg: 'Employee not found' });
          }
        }
      } else {
        console.log('else part')

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
        console.log('searching for employeeId' + id)
        if (id) {
          applications = await prisma.application.findMany({
            where: { employeeId: id },
            orderBy: {
              employeeId: 'desc',  
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