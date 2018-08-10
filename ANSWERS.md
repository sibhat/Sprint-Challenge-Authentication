<!-- Answers to the Short Answer Essay Questions go here -->

1.  Describe Middleware, Sessions (as we know them in express), bcrypt and JWT.
    Middleware are basically functions that add more functionality to the express server.
    Session are a secure way of authenticating user by creating a token.
    bcrypt will hash what ever string its given uponed specified round.
    JWT is another security measurement that can be used to authenticate user by creating a token.
2.  What does bcrypt do in order to prevent attacks?
    bcrypt will hash the password using some algorithim, (i think default is h256), and that hashed password can not be returned to the original string, but upon sign in, you can hash the newpassord and compare with the hashed password from db, if its true, that means the user is authorized.
3.  What are the three parts of the JSON Web Token?
    < header, payload, secret >
