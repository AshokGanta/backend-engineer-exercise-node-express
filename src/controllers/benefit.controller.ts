import { Request, Response, Router } from 'express';
import {
  createBenefit,
  getBenefits
} from '../services/benefit.service';

const router = Router();

/**
 * @swagger
 * /benefits: {
      "post":{
        "tags": [
          "Application"
        ], 
        "summary": "Create-benefits",
        "operationId": "Create-benefits",
        "parameters": [],
        "requestBody": {
          "description": "",
          "content": {
            "application/json": {
              "schema": {
                "allOf": [
                  {
                    "$ref": "#/components/schemas/Create-benefits-Request"
                  },
                  {
                    "example": {
                        "id": 1,
                        "name": "Medical Leave"
                      }
                  }
                ]
              },
              "example": {
                        "id": 1,
                        "name": "Medical Leave"
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
                        "id": 1,
                        "name": "Medical Leave"
                      }
                    }
                  ]
                },
                "example": {
                        "id": 1,
                        "name": "Medical Leave"
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
router.post('/benefits', async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const result = await createBenefit(req.body);
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
 * "/benefits": {
      "get": {
        "tags": [
          "Benefit"
        ],
        "summary": "Fetch benefit",
        "operationId": "FetchBenefits",
        "parameters": [],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/GET-benefits"
                  },
                  "description": "",
                  "example": [
                    {
                      "id": 1,
                      "name": "Medical Leave"
                    },
                    {
                      "id": 2,
                      "name": "Family Leave"
                    }
                  ]
                },
                "example": [
                  {
                    "id": 1,
                    "name": "Medical Leave"
                  },
                  {
                    "id": 2,
                    "name": "Family Leave"
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
router.get('/benefits', async (req: Request, res: Response) => {
  try {
      const result = await getBenefits();
      // @ts-ignore
      const message = result.message;
      if (message === undefined) {
          res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
})
export default router;