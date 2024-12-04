import { Request, Response, Router } from 'express';
import {
  createApplication,
  searchApplications
} from '../services/application.service';

const router = Router();

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
          "201": {
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
router.post('/applications', async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const result = await createApplication(req.body);
        // @ts-ignore
        if (result.message === undefined) {
            res.status(201).json(result);
        } else { 
            res.status(400).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
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
router.get('/applications/search', async (req: Request, res: Response) => {
  try {
      // @ts-ignore
      const employeeId = parseInt(req.query.employeeId, 10) || 0;
      // @ts-ignore
      const page = parseInt(req.query.page, 10) || 0;
      // @ts-ignore
      const limit = parseInt(req.query.limit, 10) || 0;
      const firstName = req.query.firstName as string;
      const lastName = req.query.lastName  as string;
      const result = await searchApplications(employeeId, page, limit, firstName, lastName);
      // @ts-ignore
      const message = result.message;
      if (message === undefined) {
          res.status(200).json(result);
      } else if (message === 'Employee not found.') { 
          res.status(404).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
})
export default router;