import request from 'supertest';
import app from '../src/app';

describe('Benefit API Test', () => {
  it('should return a list of benefits', async () => {
    const res = await request(app).get('/benefits');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].name).toEqual('Medical Leave')
  });  
})

describe('Employee API Tests', () => {
  it('should return an employee by id, without their secret', async () => {
    const res = await request(app).get('/employees/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.firstName).toEqual('Jane');
    expect(res.body.secret).toBeUndefined();
  });

  it('should return a 404 when employee not found by id', async () => {
    const res = await request(app).get('/employees/3');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Employee not found.");
  });

  it('should patch and employee first and last name', async () => {
    const res = await request(app).patch('/employees/1').send({ firstName: 'Zoe', lastName: 'Sanchez'});    
    expect(res.statusCode).toEqual(200);
    expect(res.body.firstName).toEqual('Zoe');
    expect(res.body.lastName).toEqual('Sanchez');
  });

  it('should return a 404 when employee to patch not found by id', async () => {
    const res = await request(app).patch('/employees/99').send({ firstName: 'Zoe', lastName: 'Sanchez'});
    console.log(res.body.errors);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Employee not found.");
  });

  it('should return a 400 when invalid patch request', async () => {
    const res = await request(app).patch('/employees/99').send({ lastName: ''});
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("lastName can not be blank.");
  });

})

describe('Application API Tests', () => {
  // it('should return created application record for employee id', async () => {
  //   const res = await request(app).post('/applications').send({ empId: 7, leave_start_date: "2014-09-11T13:02:17.000Z", leave_end_date: "2014-09-09T13:02:17.000Z"});
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.leave_start_date).toEqual('2014-09-11T13:02:17.000Z');
  //   expect(res.body.id).toBeGreaterThan(0);
  // });

  
  it('should return a 400 when employee not found by id for application creation', async () => {
    const res = await request(app).post('/applications').send({ empId: 30, leave_start_date: "2014-09-11T13:02:17.000Z", leave_end_date: "2014-09-09T13:02:17.000Z"});
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Employee not found.");
  });

  it('should return a 400 when parameter missing for application creation', async () => {
    const res = await request(app).post('/applications').send({ empId: 7, leave_end_date: "2014-09-09T13:02:17.000Z"});
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("leave_start_date can not be blank.");
  });

  it('should return all application records', async () => {
        const res = await request(app).get('/applications/search');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].employeeId).toEqual(7);
        
      });

  it('should return  application records that much the query parameter', async () => {
        const res = await request(app).get('/applications/search').query({empId: 7});;
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

      });
})
