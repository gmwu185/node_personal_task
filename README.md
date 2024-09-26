
# 終端機指令運行 pm2，主機直接掛上 node 應用程式

``` bash
# 於全域之中 pm2 指令，直接運行 Node.js 應用程式並將 npm 加入 pm2 運行列表中
pm2 start npm --name "node_personal_task" -- start

# 查看 pm2 運行列表
pm2 ls

# 重開機再查看 pm2 列表是否開機後自動運行
sudo reboot
```
