const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig');
const jwt = require('jsonwebtoken');
const handleError = require('./error')
const {
    authenticate
} = require('./middlewares');

module.exports = server => {
    server.post('/api/register', register);
    server.post('/api/login', login);
    server.get('/api/jokes', authenticate, getJokes);
    server.use((req, res, next) => {
        let error = new Error('couldnt find what you looking for!');
        error.status = 404;
        next(error);
    })
    server.use(handleError);
};

function generate(user) {

    const token = jwt.sign({
        user
    }, process.env.SECRET_KEY)
    return token
}

function register(req, res, next) {
    // implement user registration
    const newUser = req.body
    if (newUser.username && newUser.password) {
        newUser.password = bcrypt.hashSync(newUser.password, 10);
        console.log('registering user')
        db('users')
            .insert(newUser)
            .then(ids => {
                db('users').where({
                        id: ids[0]
                    }).first()
                    .then(user => {
                        // generate token
                        const token = generate(user)

                        console.log('user registered')
                        res.status(200).json(token)
                    })
                    .catch(error => {
                        next({
                            status: 401,
                            message: error.message
                        })
                    })
            })
            .catch(error => {
                next({
                    status: 500,
                    message: 'error while creating user'
                })
            })
    } else {
        console.log(newUser)
        next({
            status: 401,
            message: "username and password is required to register"
        })
    }
}

function login(req, res, next) {
    // implement user login
    const newUser = req.body
    if (newUser.username && newUser.password) {
        console.log('loging in')
        db('users')
            .where({
                username: newUser.username
            })
            .first()
            .then(user => {
                if (bcrypt.compareSync(newUser.password, user.password)) {
                    // generate token
                    const token = generate(user)
                    console.log('loged in')
                    res.status(200).json(token)
                }
            })
            .catch(error => {
                next({
                    status: 401,
                    message: error.message
                })
            })
    } else {
        next({
            status: 401,
            message: "username and password is required"
        })
    }
}

function getJokes(req, res) {
    axios
        .get(
            'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
        )
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error Fetching Jokes',
                error: err
            });
        });
}