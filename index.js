const express = require('express');
const cors = require('cors');
const server = express();
const jwt = require('jsonwebtoken');
const secret = "chinmay123";
const restRoutes = require('./routes/restRoutes');

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cors());

//tokens

server.post('/', async(request, response) => {
    const token = jwt.sign({
        verified: true,
        email: request.body.email
    }, secret, {expiresIn: "2h"});
    response.send(token);
})

server.post('/verify', async(request, response) => {
    const token = request.body.token;
    jwt.verify(token, secret, (err, data) => {
        if(err) response.send(err);
        response.send(data);
    });
})

//rest apis

server.use('/api', restRoutes);

server.listen(8090, () => {
    console.log('Server running on port 8090');
});