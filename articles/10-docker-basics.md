Docker 改变了我们构建、发布和运行应用的方式。理解其核心概念是每个开发者的必修课。

## 镜像 vs 容器

镜像是蓝图，容器是运行实例。`docker build` 创建镜像，`docker run` 从镜像启动容器。一个镜像可以启动无数个容器。镜像分层存储，每一层是文件系统的一次变更。相同的基础层可以被不同镜像共享，节省大量磁盘空间。

## Dockerfile 最佳实践

把不常变的层放前面。`COPY package.json` 在 `RUN npm install` 之前，这样改了源码不会触发重新安装依赖。使用 `.dockerignore` 排除 node_modules 等不需要的文件。用多阶段构建减小最终镜像体积。

## Compose 编排

`docker-compose.yml` 定义多容器应用。一个文件描述数据库、缓存、应用服务器的关系和网络。`docker compose up` 一行命令启动整个开发环境。新成员加入项目不需要装 MySQL、Redis，只需 Docker。

## 卷挂载

数据不应该存在容器里。容器销毁后容器内的数据丢失。使用 Volume 或 Bind Mount 将数据持久化到宿主机。数据库的数据目录、应用日志、用户上传的文件都应该挂载。

## 生产环境检查清单

永远不要用 `latest` 标签部署到生产。指定精确版本号。限制容器内存和 CPU 使用，防止一个容器拖垮整个服务器。配置健康检查 `HEALTHCHECK`。日志输出到 stdout/stderr，用 `docker logs` 查看。用非 root 用户运行应用进程。
