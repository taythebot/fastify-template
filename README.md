# Fastify Starter Template
This is an API starter template for [Fastify](https://www.fastify.io/). I'm an avid user of Fastify and thought it might
be useful for others if I shared my setup. This template includes some custom plugins I wrote for Fastify, which
are explained below.

## Features
* Usage of Fastify cli
* [Sequelize](https://sequelize.org/) (Postgresql by default)
* [Joi Validator](https://joi.dev/) (Only used for request schema)
* Custom Joi Validator functions
    * Alpha - Extends string and must only contain alpha characters
    * Escape - Extends string and escapes it
* `.env` file support
* Class based service model
* Version based routing
* Improved error handling
  * Human friendly format
  * Internal error codes
  * Override request schema errors

## Quick Start
1. Clone repository
```
git clone https://github.com/taythebot/fastify-template.git
```
2. Set values in `.env`
3. Run Sequelize seeds
```
sequelize db:seed:all
```
4. Start Fastify
```
npm run dev
```
5. Visit http://localhost:3000

Test Routes:
- GET http://localhost:3000/v1/users
- GET http://localhost:3000/v1/users/admin

## Table of Content
I got a bit carried away with my explanations below. You don't have to read them to use this template, but it'll help
in understanding why I design it this way.

* Errors
* Sequelize
* Joi Validator

### [Errors](plugins/errors.js)
The errors plugin formats your application errors into a human friendly format. It's modeled after Stripe's API.

**All examples shown below are actually used and shown in the `routes` and `services` folder.**

#### Base Format
All responses always include a `success` key which holds a boolean value indicating if the request was successful.
If an error has occurred, there will be a `errors` object with the appropriate details.

#### Errors Object
The `errors` object is only present when you throw an error as shown above.

Object Keys
* Status - HTTP status code
* Code - Internal Error code (Useful for handling specific errors on the client)
* Message - Error message

You can add custom error codes in [errors.js](plugins/errors.js) and pass it via the `code` key when throwing an error.
You can see an example at [services/user.js](services/user.js).

```json
{
  "success": false,
  "errors": {
    "status": 404,
    "code": 20404,
    "message": "Not Found"
  }
}
```


#### Throwing an error
The plugin provides and easy way to throw errors with a specific status code and message or a validation error.

#### Regular Errors
```js
throw fastify.error({ status: 404, messsage: 'user not found' })
```
```json
{
  "success": false,
  "errors": {
    "status": 404,
    "code": 20404,
    "message": "user not found"
  }
}
```

#### Validation Errors
Validation errors `message` contains an object which shows which error message corresponds to which `key` in the
request body. This is useful for showing errors in your client and works out of the box with
[vee-validate](https://vee-validate.logaretm.com/v4/).

```js
throw fastify.validationError({ name: 'name is incorrect' })
```
```json
{
  "success": false,
  "errors": {
    "status": 400,
    "code": 1000,
    "message": {
      "name": "ok"
    }
  }
}
```

#### Overriding Route Schema Validation Error
Sometimes it's useful to be able to override the message for a route schema validation error.

For example, you have a route `GET /user/:username` and the route schema dictates that `:username` must be a string
with a max length of 3 characters. When a user requests `GET /user/abcd`, you don't want to respond with a standard
validation error like above, instead you want to respond with 404 status code.

Example:
```js
fastify.get(
  '/:username',
  {
    schema: schemas.getUser,
    config: {
      errors: { params: { status: 404, message: 'user not found' } },
    },
  },
  async (req, _) => {
    const users = await userService.getUser(req.params.username)
    return { users }
  }
)
```

#### Why the hell would you make this? Doesn't Fastify already handle errors for you?
The situation above is something everyone has come across while making a web application. Normally in frameworks like
Express, this isn't a problem because after validation the result is handed to the controller. However Fastify
handles this error for you and your request won't even reach your controller.

### [Sequelize](plugins/sequelize.js)
This plugin initializes Sequelize and loads in your models. The models are loaded from the `models` folder. It makes

#### Accessing Sequelize
Sequelize available to the application via `sequelize`. Native sequelize functions such as `transaction`
can be access via `sequelize.sequelize.<method>`.

#### Syncing Models
Models are automatically synced when `process.env.NODE_ENV` is equal to `development`.

#### Example
```js
const { sequelize } = fastify
const user = await sequelize.users.findOne({ where: { username: 'admin' } })
```
You can see additional examples at [services/user.js](services/user.js).

#### Notes
* Default connector is Postgresql
* Date columns have underscores: `created_at`, `updated_at`
* There is a connection pool configured

### [Joi](plugins/validator.js)
Fastify by default uses the AJV validator. While AJV is fine, I think it's hard to get used to a JSON based validator.
Joi is a popular Javascript validator and is very extendable.

**Joi is only used for request schemas. Response schemas still use AJV.**

#### Custom Joi Methods
1. Alpha

Apparently this is not a default method in Joi, so I added it because it's pretty useful to have
```js
Joi.string().alpha()
```
2. Escape

You don't really need to escape strings these days as ORMs and alike handle all that fancy jazz for you, but it's always
nice to have
```js
Joi.string().escape()
```