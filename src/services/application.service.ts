import { PrismaClient } from '@prisma/client';
import express from 'express'
import { Application } from '../models/application.model';

const app = express()
app.use(express.json());

const prisma = new PrismaClient();

export const createApplication = async (app: Application) => {
  try {
    //checking for the request parameters
    if (!app.employeeId) {
      return { "message": 'employeeId can not be blank.' };
    }
    if (!app.leave_end_date) {
      return { "message": 'leave_end_date can not be blank.' };
    }
    if (!app.leave_start_date) {
      return { "message": 'leave_start_date can not be blank.' };
    }
    //creating application
    const createApplication = await prisma.application.create({
        data: {
            employeeId: app.employeeId,
            leave_end_date: app.leave_end_date,
            leave_start_date: app.leave_start_date
        }
    });
    return createApplication;
  }
  catch (e: any) {
    console.error(e);
    return { errors: e.errors };
  }
};

export const searchApplications = async (employeeId: number, page: number, limit: number, firstName: string, lastName: string) => {
  try {
    let applications;
    //returning all application if no req param is provided
    if (!employeeId && !firstName && !lastName && !page && !limit) {
      applications = await prisma.application.findMany()
    }
    else {
      //page or limit params are provided in req param
      if (page || limit) {
        console.log('page======');
        console.log(page);
        console.log('limit======');
        console.log(limit);
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
          console.log('empId======');
          console.log(id);
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
            console.log('not found');
            //employee not found for the provided employee details
            return { "message": 'Employee not found.' };
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
          return { "message": 'Employee not found.' };
        }
      }
    }
    return applications
  }
  catch (e: any) {
    console.error(e);
    return ({ errors: e.errors });
  }
};