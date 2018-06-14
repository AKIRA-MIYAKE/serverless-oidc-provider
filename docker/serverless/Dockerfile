FROM node:8.10.0

WORKDIR /serverless-oidc-provider

ENV PATH $PATH:/serverless-oidc-provider/node_modules/.bin

RUN npm i npm@latest -g && npm install -g serverless

CMD ["npm", "test"]
