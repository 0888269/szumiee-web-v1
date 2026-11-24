#!/usr/bin/env python3
"""校验 backend-schema/ 下的字段表：严格 JSON、字段命名、必填键、引用前缀。

用法：python3 validate.py [目录]
退出码：0 全部通过；1 存在问题。
"""
import json
import os
import re
import sys

SNAKE = re.compile(r"^[a-z][a-z0-9]*(_[a-z0-9]+)*$")
ALLOWED_KEYS = {
    "字段名", "类型", "必填", "说明", "唯一", "格式", "enum", "enum_labels",
    "引用", "ref", "单位", "minimum", "minLength", "write_only", "storage_type",
    "数据归属", "pattern",
}
# 引用前缀 → 目标文件；None 表示待确认、暂不校验
TARGETS = {
    "account": "Account.json",
    "course_shared": "共享定义字段/course_shared.json",
    "assignment": "assignment.json",
    "assignment_shared": "共享定义字段/assignment_shared.json",
    "route": "route.json",
    "badge": "利兆焯/badge.json",
    "badge_award": "利兆焯/badge.json",
    "certification": "利兆焯/certification.json",
    "adminAccount": "利兆焯/adminAccount.json",
    "message": "吴颖/message.json",
}


def all_field_names(node, out):
    """收集文件内出现的所有字段名（含嵌套类型）。"""
    if isinstance(node, dict):
        for k, v in node.items():
            if k == "字段名" and isinstance(v, str):
                out.add(v)
            else:
                all_field_names(v, out)
    elif isinstance(node, list):
        for v in node:
            all_field_names(v, out)
    return out


def walk_fields(node, path, problems, names_by_file):
    if isinstance(node, dict):
        if "字段名" in node and isinstance(node["字段名"], str):
            name = node["字段名"]
            if not SNAKE.match(name):
                problems.append(f"{path}: 字段名 {name!r} 不符合 snake_case")
            for k in node:
                if k not in ALLOWED_KEYS:
                    problems.append(f"{path}: 字段 {name} 有非标准键 {k!r}")
            ref = node.get("引用") or node.get("ref")
            if isinstance(ref, str) and ref:
                head = ref.split(".")[0].rstrip("[]")
                if head not in TARGETS:
                    problems.append(f"{path}: 字段 {name} 的引用 {ref!r} 前缀未知")
        for k, v in node.items():
            walk_fields(v, f"{path}/{k}", problems, names_by_file)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk_fields(v, f"{path}[{i}]", problems, names_by_file)


def main(root):
    files = []
    for dirpath, _, filenames in os.walk(root):
        for f in filenames:
            if f.endswith(".json"):
                files.append(os.path.relpath(os.path.join(dirpath, f), root))
    files.sort()

    problems, docs = [], {}
    for rel in files:
        p = os.path.join(root, rel)
        try:
            docs[rel] = json.load(open(p, encoding="utf-8"))
        except json.JSONDecodeError as e:
            problems.append(f"{rel}: 不是合法 JSON —— {e}")
    print(f"JSON 解析：{len(docs)}/{len(files)} 个文件通过")

    names_by_file = {rel: all_field_names(d, set()) for rel, d in docs.items()}
    for rel, d in docs.items():
        walk_fields(d, rel, problems, names_by_file)

    for rel, d in docs.items():
        for k in ("实体", "说明"):
            if k not in d:
                problems.append(f"{rel}: 缺少顶层键 {k}")
        if not ({"物理表", "来源物理表", "子实体"} & set(d)):
            problems.append(f"{rel}: 缺少物理表标识（物理表/来源物理表/子实体 至少一项）")
        if not ({"字段", "子实体"} & set(d)):
            problems.append(f"{rel}: 缺少字段声明（字段/子实体 至少一项）")

    # 引用目标字段是否存在
    for rel, d in docs.items():
        for m in re.finditer(r'"引用": "([^"]+)"|"ref": "([^"]+)"',
                             open(os.path.join(root, rel), encoding="utf-8").read()):
            ref = m.group(1) or m.group(2)
            parts = ref.split(".")
            head, tail = parts[0].rstrip("[]"), parts[-1].rstrip("[])")
            if head in TARGETS and TARGETS[head] in names_by_file:
                if tail not in names_by_file[TARGETS[head]]:
                    problems.append(f"{rel}: 引用 {ref!r} 的字段 {tail!r} 在目标文件中不存在")

    print(f"字段命名与结构：{'通过' if not problems else f'{len(problems)} 处问题'}")
    for p in problems:
        print("  -", p)
    return 0 if not problems else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))))
