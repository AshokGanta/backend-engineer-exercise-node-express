import { PrismaClient } from '@prisma/client';
import express from 'express'
import { Benefit } from '../models/benefit.model';

const app = express()
app.use(express.json());

const prisma = new PrismaClient();

export const createBenefit = async (benefit: Benefit) => {
  try {
    //checking for the request parameters
    if (!benefit.name) {
      return { "message": 'name can not be blank.' };
    }
    //creating benefit
    const createBenefit = await prisma.benefit.create({
        data: {
            name: benefit.name
        }
    });
    return createBenefit;
  }
  catch (e: any) {
    console.error(e);
    return { errors: e.errors };
  }
};

export const getBenefits = async () => {
  try {
    const benefits: any = await prisma.benefit.findMany()
    return benefits;
  }
  catch (e: any) {
    console.error(e);
    return { errors: e.errors };
  }
};