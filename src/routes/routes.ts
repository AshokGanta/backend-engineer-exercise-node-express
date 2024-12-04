import { Router } from 'express';
import employeeController from '../controllers/employee.controller';
import applicationController from '../controllers/application.controller';
import benefitController from '../controllers/benefit.controller';
const api = Router()
    .use(employeeController)
    .use(benefitController)
    .use(applicationController);

export default Router().use('/', api);
