import { PrismaClient } from '@prisma/client';
import express from 'express'
import { Employee } from '../models/employee.model';

const app = express()
app.use(express.json());

const prisma = new PrismaClient();

export const getEmployeeById = async (empId: number) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id: empId,
      },
    });

    //Checking whether employee exists
    if (!employee) {
      return { "message": 'Employee not found.' };
    }

    //Excluding the field secret from the response payload
    const { secret, ...rest } = employee;
    return rest;
  }
  catch (e: any) {
    console.error(e);
    return { errors: e.errors };
  }
};

export const updateEmployeeById = async (emp: Employee, id: number) => {
  try {
    //checking for the request parameters
    if (!emp.lastName) {
      return { "message": 'lastName can not be blank.' };
    }
    if (!emp.firstName) {
      return { "message": 'firstName can not be blank.' };
    }

    //fetching the employee for the id provided
    const employee = await prisma.employee.findUnique({
      where: {
        id: id,
      },
    });

    //checking employees existance
    if (!employee) {
      return { "message": 'Employee not found.' };
    }

    //updating employee
    const updateEmployee = await prisma.employee.update({
      where: { id: id },
      data: {
        firstName: emp.firstName,
        lastName: emp.lastName
      }
    });

    //excluding the secret field from the response payload
    const { secret, ...rest } = updateEmployee;
    return rest;
  }
  catch (e: any) {
    console.error(e);
    return { errors: e.errors };
  }
};

export const createEmployee = async (emp: Employee) => {
  try {
    //checking for the request parameters
    if (!emp.lastName) {
      return { "message": 'lastName can not be blank.' };
    }
    if (!emp.firstName) {
      return { "message": 'firstName can not be blank.' };
    }
    if (!emp.secret) {
      return { "message": 'secret can not be blank.' };
    }
    if (!emp.date_of_birth) {
      return { "message": 'date_of_birth can not be blank.' };
    }
    //updating employee
    const createEmployee = await prisma.employee.create({
        data: {
            firstName: emp.firstName,
            lastName: emp.lastName,
            date_of_birth: emp.date_of_birth,
            secret: emp.secret
        }
    });

    //excluding the secret field from the response payload
    const { secret, ...rest } = createEmployee;
    return rest;
  }
  catch (e: any) {
    console.error(e);
    return { errors: e.errors };
  }
};