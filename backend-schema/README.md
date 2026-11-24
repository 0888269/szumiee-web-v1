# 后端字段表

卓工协会系统的实体字段定义。所有文件已统一为严格 JSON 与同一套字段格式，原始提交件保存在 git 历史（提交 `8127c3a`）中，可随时对照。

## 目录

| 路径 | 实体 | 物理表 | 主键 | 来源 |
|---|---|---|---|---|
| `Account.json` | 学员 / 助教 / 部门管理账号 | `account` | `account_id` | 组内 |
| `course.json` | 课程（字段引用共享定义） | `course` | `course_id` | 组内 |
| `共享定义字段/course_shared.json` | 课程共享定义 | `course` | `course_id` | 组内 |
| `assignment.json` | 大作业（含学生提交实例） | `assignment` | `assignment_id` | 组内 |
| `共享定义字段/assignment_shared.json` | 大作业共享定义 | `assignment` | `assignment_id` | 组内 |
| `route.json` | 学习路线 | `route` | `route_id` | 组内 |
| `利兆焯/adminAccount.json` | 管理端账号 | `admin_account` | `admin_account_id` | 利兆焯 |
| `利兆焯/badge.json` | 徽章定义 + 颁发记录 | `badge` / `badge_award` | `badge_id` / `badge_award_id` | 利兆焯 |
| `利兆焯/certification.json` | 等级认定 | `certification` | `certification_id` | 利兆焯 |
| `吴颖/message.json` | 消息 | `message` | `id` | 吴颖 |
| `吴颖/plan.json` | 规划 | `plan` | `id` | 吴颖 |
| `吴颖/todo.json` | 待办 | `todo` | `id` | 吴颖 |

## 统一格式

每个文件顶层结构一致：

```json
{
  "实体": "课程",
  "物理表": "course",
  "说明": "一句话说明这个实体是什么、和谁关联",
  "字段": [
    { "字段名": "course_id", "类型": "string", "必填": true, "说明": "…" }
  ],
  "嵌套类型": { "Chapter": [ … ] },
  "规则": [ "…" ]
}
```

字段对象允许的键：`字段名`、`类型`、`必填`、`说明`、`唯一`、`格式`、`enum`、`enum_labels`、`引用`、`单位`、`minimum`、`minLength`、`write_only`、`storage_type`、`数据归属`、`pattern`。

`利兆焯/badge.json` 有两个实体，用 `子实体` 分层；`共享定义字段/` 下两个文件用 `来源物理表` 代替 `物理表`，表示字段挂在该物理表上。

## 命名规范

**所有字段名一律 snake_case（小写 + 下划线）。** 三类主键统一为 `<实体>_id` 形式：

| 统一后 | 原写法 |
|---|---|
| `account_id` | `accountId` |
| `course_id` | `courseid` / `courseId` |
| `assignment_id` | `assignmentid` / `assignmentId` |
| `route_id` | `routeid` / `routeId` |
| `chapter_id` | `chapterid` |
| `task_id` | `taskid` |
| `submission_id` | `submissionid` |
| `student_account_id` | `studentaccountid` |
| `reviewer_account_id` | `revieweraccountid` |
| `operator_account_id` | `operatoraccountid` |
| `presentation_ta_account_id` | `presentationtaaccountid` |
| `criterion_id` | `criterionid` |
| `batch_id` | `batchid` |
| `cohort_ids` | `cohortids` |
| `course_ids` | `courseids` |
| `teacher_id` | `teacherid` |
| `chapter_completion` | `chapterCompletion` |
| `notification_prefs` | `notificationPrefs` |
| `badge_ids` | `badgeIds` |
| `received_messages` | `receivedMessages` |
| `teaching_assignments` | `teachingAssignments` |
| `student_number` | `studentNumber` |
| `training_status` | `trainingStatus` |
| `engineer_level` | `engineerLevel` |

跨实体引用统一写成 `<实体>.<字段>`，例如 `account.account_id`、`adminAccount.admin_account_id`、`badge_award.badge_award_id`。原先各文件写的是 `account.id`、`account.badges[]`、`account.level` 等，已按统一后的路径改写为 `account.achievements.badge_ids[]`、`personal.engineer_level`。

## 校验

```bash
python3 backend-schema/validate.py
```

检查四项：严格 JSON 解析、字段名 snake_case、字段对象无非法键、引用目标字段确实存在。当前 12 个文件全部通过。

## 引用关系

`course.json` 与 `assignment.json` 通过 `共享定义引用` 指向同目录下的 `共享定义字段/`：

```
"共享定义引用": "./共享定义字段/course_shared.json"
"共享定义引用": "./共享定义字段/assignment_shared.json"
```

因此不要单独移动 `共享定义字段/` 下的文件，否则引用失效。

## 已修正的问题

1. **JSONC → JSON**：`吴颖/message.json`、`plan.json`、`todo.json` 原含 `//` 行内注释，`JSON.parse` 直接报错（`Expecting property name enclosed in double quotes: line 2 column 33`）。注释内容全部保留，改写进对应的 `说明` 字段，未丢弃任何业务约定。
2. **`Account.json` → 可落库 schema**：原来类型写成 `"string｜姓名"` 这种带说明的字符串，机器无法解析。现按 `字段名/类型/必填/说明` 拆开，嵌套结构改用 `嵌套类型`（`Login`、`Personal`、`Learning`、`LearningCourse`、`Achievements`、`CertificationRef`、`ReceivedMessageRef`、`Settings`、`NotificationPrefs`、`TeachingAssignment`）。
3. **命名统一**：camelCase（`accountId`）、全小写连写（`courseid`）、snake_case（`admin_account_id`）三种风格并存，外键名对不上。现全部改为 snake_case，见上方映射表；`利兆焯` 三份的键名也从英文（`name/type/required/description`）统一成中文键，与其余文件一致。

## 仍需确认

- **时间单位两种并存**：`certification`、`badge_award`、`message` 用 Unix milliseconds 整数；`course`、`assignment`、`route`、`account` 用带时区的 ISO 8601 字符串（`datetime`）。落库前需二选一，我不便替你们决定，暂按各文件原口径保留。
- **`message` 缺接收人字段**：只有 `sender_id`，收件人靠 `account.received_messages[]` 反向引用，无法校验一条消息实际下发给了谁。
- **Agent 身份未定义**：`message.sender_id` 可能指向 agent，但 agent 实体与 ID 字段都还没有定义。
- **`adminAccount.account` 字段名易混**：它是管理员登录账号，与学员账号实体 `account` 同名，建议改成 `login_account`。
