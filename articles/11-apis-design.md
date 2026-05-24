设计一个好的 API 既是一门科学也是一门艺术。以下是我从多年实践中总结的原则。

## 命名是门手艺

URL 用名词复数：`/users`、`/articles`、`/comments`。不要用动词：`/getUsers` 是错的，`GET /users` 是对的。关联资源用嵌套：`/users/42/articles`。但嵌套不要超过两层，否则 URL 会变得难以管理。

## HTTP 状态码的正确用法

`200` 成功、`201` 创建成功、`204` 删除成功。`400` 客户端请求错误、`401` 未认证、`403` 无权限、`404` 资源不存在。`422` 请求格式正确但语义错误（参数校验失败）。`500` 服务器内部错误。不要所有情况都返回 200 然后在 body 里放 error 字段。

## 分页与过滤

列表接口一定要分页。使用 `?page=2&limit=20` 或基于游标的分页 `?after=xyz`。过滤用查询参数：`?status=active&role=admin`。排序用 `sort` 参数：`?sort=-created_at` 按创建时间倒序。

## 错误响应格式

一致的错误格式让前端开发事半功倍：`{ "error": { "code": "VALIDATION_ERROR", "message": "用户名不能为空", "details": [{"field": "username", "reason": "required"}] } }`。不要返回裸奔的字符串或 HTML。

## API 版本管理

在 URL 中做版本管理：`/v1/users`、`/v2/users`。或使用请求头：`Accept: application/vnd.api+json;version=2`。如果 API 只有你自己用，可以暂时不版本化。一旦有外部用户，版本管理就变成必须的。
