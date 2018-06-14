# serverless-oidc-provider
Starter kit for providing OpenID Provider(OP) with serverless architectures using AWS Lambda.

## Overview
Base project of providing OpenID Provider (OP) quickly with Serverless architecture.  
You do not need to implement the mechanism of user authentication and data persistence yourself.  
Use [node-oidc-provider](https://github.com/panva/node-oidc-provider) to provide necessary functions as OpenID Provider(OP), and it is highly customizable.  
By using [Serverless Framework](https://serverless.com/framework/) built in the project, you can deploy applications easily and quickly.  

## Usage
### Preparation
#### DynamoDB
Create a table of DynamoDB with `id` as HashKey.  

#### Cognito User Pool
If it does not exist, or if you want to use a new user pool, create a Cognito User Pool.  
Add an application client that enabled `ADMIN_NO_SRP_AUTH` to the created User Pool.  

*Notice*  
User management is out of scope. Please manage users with console and various SDK.  

### Setup
#### Clone Project
```
$ git clone git@github.com:AKIRA-MIYAKE/serverless-oidc-provider.git
$ cd serverless-oidc-provider
```

#### Prepare `.env`
```
cp .env.sample .env
```

Update the following items with your values.  

* `OIDC_ISSURE`
  * URL using the https scheme with no query or fragment component that the OP asserts as its Issuer Identifier.
* `SECURE_KEYS`
  * Signed cookie keys for koa app.
* `AWS_ACCOUNT_ID`
* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_DEFAULT_REGION`
* `AWS_DYNAMODB_TABLE_NAME`
  * Name of table created in preparation.
* `AWS_COGNITO_USER_POOL_ID`
  * Id of User Pool created in preparation.
* `AWS_COGNITO_USER_POOL_CLIENT_ID`
  * Id of Client of User Pool created in preparation.

#### Setup Docker image
```
$ ENV_FILE=.env docker-compose build
```

#### npm install
```
$ ENV_FILE=.env docker-compose run --rm serverless npm install
```

#### Generate Keystore
```
$ ENV_FILE=.env docker-compose run --rm serverless npm run generate-keys
```

### Configuration
The basic settings are defined in the `src/app/oidc/setting.js`. Change according to the situation.  
For details, check [node-oidc-provider: Configuration](https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md).  

The interaction sample is defined in the `src/app/oidc/actions/interaction.js` and `src/app/oidc/views`. Please customize the views etc.  

The setting of AWS is `src/services/oidc-provider/serverless.yml`. Change each item if necessary.  

### Deploy
```
$ ENV_FILE=.env docker-compose run --rm serverless npm run deploy
```

## Custom Authorizer
This project provide sample lambda function for use with Custom Authorizer of API Gateway on `src/services/authorize`.  
It is a Custom Authorizer that uses introspection endpoint of [RFC7662: OAuth 2.0 Token Introspection](https://tools.ietf.org/html/rfc7662).  
Of course, you can also use the introspection endpoint provided by node-oidc-provider.  
Please see `src/app/authorize` for details.   
And, `src/services/sample` is a sample of APIs protected by that Custom Authorizer.    
