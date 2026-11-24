# 后端字段表

卓工协会系统的实体字段定义，按来源整理，文件内容与提交者提供的原件逐字节一致（未改写、未格式化）。

## 目录

| 路径 | 实体 | 主键 | 来源 |
|---|---|---|---|
| `Account.json` | 学员账号 account | `accountId` | 组内 |
| `course.json` | 课程（引用共享定义） | `courseid` | 组内 |
| `共享定义字段/course_shared.json` | 课程共享定义 | `courseid` | 组内 |
| `assignment.json` | 大作业（含提交实例） | `assignmentid` | 组内 |
| `共享定义字段/assignment_shared.json` | 大作业共享定义 | `assignmentid` | 组内 |
| `route.json` | 学习路线 | `routeid` | 组内 |
| `利兆焯/adminAccount.json` | 管理端账号 adminAccount | `admin_account_id` | 利兆焯 |
| `利兆焯/badge.json` | 徽章定义 + 颁发记录 | `badge_id` / `badge_award_id` | 利兆焯 |
| `利兆焯/certification.json` | 等级认定 | `certification_id` | 利兆焯 |
| `吴颖/message.json` | 消息 | `id` | 吴颖 |
| `吴颖/plan.json` | 规划 | `id` | 吴颖 |
| `吴颖/todo.json` | 待办 | `id` | 吴颖 |

## 引用关系

`course.json` 与 `assignment.json` 通过 `$ref` 指向同目录下的 `共享定义字段/`：

```
"共享定义引用": "./共享定义字段/course_shared.json"
"共享定义引用": "./共享定义字段/assignment_shared.json"
```

因此两处路径保持原样，不要单独移动 `共享定义字段/` 下的文件，否则引用失效。

## 注意

- `吴颖/message.json`、`吴颖/plan.json`、`吴颖/todo.json` 含 `//` 行内注释，属于 JSONC，**不能被 `JSON.parse` 或严格 JSON 解析器直接读取**；需要先剥注释，或改存为 `.jsonc`。
- 其余 9 个文件是严格合法 JSON。
- 字段名大小写风格不统一，是各来源原貌：共享定义用 `courseid`（全小写无分隔），`Account.json` 用 `accountId`（小驼峰），`adminAccount` 用 `admin_account_id`（蛇形）。合并进同一数据库前需要先定命名规范。
- `Account.json` 是带说明文字的字段清单（类型写成 `"string｜姓名"`），不是可直接落库的 schema。
