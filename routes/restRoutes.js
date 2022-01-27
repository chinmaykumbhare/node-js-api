const express = require('express');
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');
const rest = express.Router();
const employeeModel = require('../schema/employeeSchema');

mongoose.connect("mongodb://localhost:27017/employeedb", (error) => {
    if (error) throw new Error(error);
    console.log("Connection to MongoDB successful");
});

rest.get('/', async (request, response) => {
    const data = await employeeModel.find({});
    response.json(data);
})

//custom validation

rest.post('/post', body('age').custom((value, { request }) => {
    if (value === undefined) throw new Error('Field cannot be empty');
    else return true;
    }), body('name').isAlpha('en-US', { ignore: " " }).withMessage('Name cannot contain numeric values'),
    async (request, response) => {
        
        // error check
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(230).json({ errors: errors.array() });
        } else {
            await employeeModel.insertMany({ id: request.body.id, name: request.body.name, age: request.body.age }, (error) => {
                if (error) response.status(203).send(error.name);
                else response.send('data added');
            });
        }
    })

//custom validation

rest.put('/put/:id', body('age').custom((value, { request }) => {
    if (value === undefined) throw new Error('Field cannot be empty');
    else return true;
}), body('name').isAlpha('en-US', { ignore: " " }).withMessage('Name cannot contain numeric values'),
    param('id').isNumeric().withMessage('ID has to be a number'), async (request, response) => {

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(230).json({ errors: errors.array() });
        } else {
            const status = await employeeModel.updateMany({ id: request.params.id }, { name: request.body.name, age: request.body.age });
            response.send('employee data updated successfully');
        }
    })

rest.delete('/delete/:id', param('id').isNumeric().withMessage('ID has to be a number'),
    async (request, response) => {
        try {
            const status = await employeeModel.deleteMany({ id: request.params.id });
            console.log(status);
            response.send('employee data deleted successfully');
        } catch (error) {
            response.status(230).send(error.name);
        }
    })

module.exports = rest;