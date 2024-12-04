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

export default app;