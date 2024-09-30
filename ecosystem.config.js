const dotenv = require("dotenv");
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

/** pm2 參考：
  * node express 使用 pm2 ecosystem.config.js 運行站台
  * https://medium.com/@leodeo/deploying-multiple-applications-with-the-pm2-ecosystem-config-js-file-29637512f7b6
  * pm2 - 用法大全 
  * https://tn710617.github.io/zh-tw/pm2/
*/
module.exports = {
  apps: [
    {
      name: "metawall_persona",
      instances: "max", // 負載平衡模式下的 cpu 數量
      exec_mode: "cluster", // cpu 負載平衡模式
      max_memory_restart: "64M", // 緩存了多少記憶體重新整理
      port: process.env.CUSTOMPORT, // 指定伺服器上的 port
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
