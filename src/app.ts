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

  try {
    //Getting employee for requested employee id
    const empId: number = parseInt(req.params.id, 10);
    const employee = await prisma.employee.findUnique({
      where: {
        id: empId,
      },
    });
    //Checking whether employee exists
    if (!employee) {
      return res.status(404).json({ "message": 'Employee not found.' });
    }
    //Excluding the field secret from the response payload
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

  try {
    const id: number = parseInt(req.params.id, 10);
    const { firstName, lastName } = req.body
    //checking for the request parameters

    if (!lastName) {
      return res.status(400).json({ "message": 'lastName can not be blank.' });
    }
    if (!firstName) {
      return res.status(400).json({ "message": 'firstName can not be blank.' });
    }
    //fetching the employee for the id provided
    const employee = await prisma.employee.findUnique({
      where: {
        id: id,
      },
    });
    //checking employees existance
    if (!employee) {
      return res.status(404).json({ "message": 'Employee not found.' });
    }
    //updating employee
    const UpdateEmployee = await prisma.employee.update({
      where: { id: id },
      data: {
        firstName: firstName,
        lastName: lastName
      }
    });
    //excluding the secret field from the response payload
    const { secret, ...rest } = UpdateEmployee;

    res.json(rest)

  }
  catch (e: any) {
    console.error(e);
    res.status(400).json({ errors: e.errors });
  }

})

/**
 * @swagger
 * /applications: {
      "post":{
        "tags": [
          "Application"
        ], 
        "summary": "Create-application",
        "operationId": "Create-application",
        "parameters": [],
        "requestBody": {
          "description": "",
          "content": {
            "application/json": {
              "schema": {
                "allOf": [
                  {
                    "$ref": "#/components/schemas/Create-application-Request"
                  },
                  {
                    "example": {
                      "empId": 7,
                      "leave_start_date": "2014-09-07T13:02:17.000Z",
                      "leave_end_date": "2014-09-09T13:02:17.000Z"
                    }
                  }
                ]
              },
              "example": {
                "empId": 7,
                "leave_start_date": "2014-09-07T13:02:17.000Z",
                "leave_end_date": "2014-09-09T13:02:17.000Z"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/Create-application"
                    },
                    {
                      "example": {
                        "id": 12,
                        "employeeId": 7,
                        "leave_start_date": "2014-09-07T13:02:17.000Z",
                        "leave_end_date": "2014-09-09T13:02:17.000Z"
                      }
                    }
                  ]
                },
                "example": {
                  "id": 12,
                  "employeeId": 7,
                  "leave_start_date": "2014-09-07T13:02:17.000Z",
                  "leave_end_date": "2014-09-09T13:02:17.000Z"
                }
              }
            }
          }
        },
        "deprecated": false,
        "security": []
      }
    }
 */
app.post('/applications', async (req, res) => {

  try {
    //checking for request params
    const { empId, leave_start_date, leave_end_date } = req.body

    if (!leave_start_date) {
      return res.status(400).json({ "message": 'leave_start_date can not be blank.' });
    }
    if (!leave_end_date) {
      return res.status(400).json({ "message": 'leave_end_date can not be blank.' });
    }
    if (!empId) {
      return res.status(400).json({ "message": 'Employee id can not be blank.' });
    }
    console.log(empId)
    //fetching employee
    const employee = await prisma.employee.findUnique({
      where: {
        id: empId,
      },
    });
    console.log("employee::" + JSON.stringify(employee))
    console.log(typeof (empId))
    //checking for employee existance
    if (!employee) {
      return res.status(400).json({ "message": 'Employee not found.' });
    }
    //creating application for the provided employee id
    const newApplication = await prisma.application.create({
      data: {
        employeeId: empId,
        leave_start_date: leave_start_date,
        leave_end_date: leave_end_date
      }
    });
    res.json(newApplication)
    console.log("newApplication::" + JSON.stringify(newApplication))
  }
  catch (e: any) {
    console.error(e);
    res.status(400).json({ errors: e.errors });
  }

})

/**
 * @swagger
 * "/applications/search": {
      "parameters": [
        {
          "in": "query",
          "name": "firstName",
          "required": false,
          "schema": {
            "type": "string"
          },
          "description": "Employe First name"
        },
        {
          "in": "query",
          "name": "lastName",
          "required": false,
          "schema": {
            "type": "string"
          },
          "description": "Employee Last Name"
        },
        {
          "in": "query",
          "name": "employeeId",
          "required": false,
          "schema": {
            "type": "integer"
          },
          "description": "Employee Id"
        },
        {
          "in": "query",
          "name": "limit",
          "required": false,
          "schema": {
            "type": "integer"
          },
          "description": "The numbers of items to return"
        },
        {
          "in": "query",
          "name": "page",
          "required": false,
          "schema": {
            "type": "integer"
          },
          "description": "The page to return set"
        }
      ],
      "get": {
        "tags": [
          "Application"
        ],
        "summary": "Fetch application",
        "operationId": "Fetchapplication",
        "parameters": [],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/GET-application"
                  },
                  "description": "",
                  "example": [
                    {
                      "id": 5,
                      "employeeId": 7,
                      "leave_start_date": "2014-09-01T13:02:17.000Z",
                      "leave_end_date": "2014-09-09T13:02:17.000Z"
                    },
                    {
                      "id": 6,
                      "employeeId": 7,
                      "leave_start_date": "2014-09-02T13:02:17.000Z",
                      "leave_end_date": "2014-09-09T13:02:17.000Z"
                    }
                  ]
                },
                "example": [
                  {
                    "id": 5,
                    "employeeId": 7,
                    "leave_start_date": "2014-09-01T13:02:17.000Z",
                    "leave_end_date": "2014-09-09T13:02:17.000Z"
                  },
                  {
                    "id": 6,
                    "employeeId": 7,
                    "leave_start_date": "2014-09-02T13:02:17.000Z",
                    "leave_end_date": "2014-09-09T13:02:17.000Z"
                  }
                ]
              }
            }
          }
        },
        "deprecated": false,
        "security": []
      }
    }
  }
 */
app.get('/applications/search', async (req, res) => {

  try {
    //parsing provided request params
    const employeeId = parseInt(req.query.employeeId?.toString() ?? '0', 10);
    const page = parseInt(req.query.page?.toString() ?? '0', 10);
    const limit = parseInt(req.query.limit?.toString() ?? '0', 10);
    const firstName = req.query.firstName?.toString();
    const lastName = req.query.lastName?.toString();
    console.log('request:' + (!employeeId && !firstName && !lastName && !page && !limit))

    let applications;
    //returning all application if no req param is provided
    if (!employeeId && !firstName && !lastName && !page && !limit) {
      applications = await prisma.application.findMany()
    }
    else {
      //page or limit params are provided in req param
      if (page || limit) {
        let pgNumber = page > 0 ? page : 1
        const pgsize = limit > 0 ? limit : 5
        //no first last, or employeeId provided
        if (!employeeId && !firstName && !lastName) {
          //checking for application records count against limit provided
          const appCount = await prisma.application.count()
          if (appCount <= limit) {
            //application count is less than limit, pull all records
            applications = await prisma.application.findMany({
              orderBy: {
                employeeId: 'desc',
              },
            });
          } else {
            //application records count is greater than the limit so pagination took place for all records
            applications = await prisma.application.findMany({
              skip: (pgNumber - 1) * pgsize,
              take: pgsize,
              orderBy: {
                employeeId: 'desc',
              },
            });
          }

        } else {
          //first, last or employeeId provided
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
          //searching for employeeId
          const id = (empId && empId.length > 0) ? empId[0].id : 0

          if (id) {
            const appCount = await prisma.application.count({
              where: { employeeId: id }
            });
            //checking application count against limit
            if (appCount <= pgsize) {
              //application count is less than or equal to limit
              applications = await prisma.application.findMany({
                where: { employeeId: id },
                orderBy: {
                  employeeId: 'desc',
                },
              });
            }
            else {
              //providing paginated response for provided employee
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
            //employee not found for the provided employee details
            return res.status(404).json({ "message": 'Employee not found.' });
          }
        }
      } else {
        //no page or limit is provided in the req param returning application for provided employee details

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
        //searching for employee
        const id = (empId && empId.length > 0) ? empId[0].id : 0

        if (id) {
          applications = await prisma.application.findMany({
            where: { employeeId: id },
            orderBy: {
              employeeId: 'desc',
            },
          });
        } else {
          //employee not found for provided details
          return res.status(404).json({ "message": 'Employee not found.' });
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