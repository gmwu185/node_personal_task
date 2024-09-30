const swaggerAutogen = require('swagger-autogen')();
const dotenv = require('dotenv');
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

let doc_server_path = "";
if (process.env.NODE_ENV === "prod") {
  doc_server_path = `${process.env.DOMAIN_SERVER}`;
} else {
  doc_server_path = `${process.env.DOMAIN_SERVER}:${process.env.CUSTOMPORT}`;
}

const doc = {
  // 生成資料、格式、設定
  info: {
    title: 'API DOC',
    description: '',
  },
  host: doc_server_path,
  schemes: [process.env.PROTOCOL],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'headers',
      name: 'authorization',
      description: 'Token 前請加上 Bearer，<code>Bearer ＜Token＞</code>',
    },
  },
  definitions: {
    // createdPosts: {
    //   $name: 'createdPost--test 加入 swagger.js 中',
    //   content: 'createdPost-test',
    //   tags: ['string-1', 'string-2'],
    //   type: 'string',
    // },
  },
};
const outputFile = `./swagger-output_${process.env.NODE_ENV}.json`; // 使用套件生成文件讀取用的 JSON 資料檔
const endpointsFiles = ['./app.js']; // 專案系統的注入點，成為套件所讀取的檔案

swaggerAutogen(outputFile, endpointsFiles, doc);
