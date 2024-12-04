import { Request, Response, Router } from 'express';
import {
  getEmployeeById,
  updateEmployeeById,
  createEmployee
} from '../services/employee.service';

const router = Router();

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
router.get('/employees/:id', async (req: Request, res: Response) => {
  try {
    const empId: number = parseInt(req.params.id, 10);
    const result = await getEmployeeById(empId);
    // @ts-ignore
    if (result.message === undefined) {
        res.status(200).json(result);
    } else { 
        res.status(404).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
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
router.patch('/employees/:id', async (req: Request, res: Response) => {
  try {
      const empId: number = parseInt(req.params.id, 10);
      const result = await updateEmployeeById(req.body, empId);
      // @ts-ignore
      if (result.message === undefined) {
         res.status(204).json(result);
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
 * /employees:
 *   post:
 *     summary: Create employee details
 *     requestBody:
 *       description: Create employee details
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
router.post('/employees', async (req, res) => {
    try {
        console.log(req.body);
        const result = await createEmployee(req.body);
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
export default router;