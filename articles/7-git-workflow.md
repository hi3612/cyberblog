Git 是大规模协作的基础设施。用了十年 Git，总结了这些最佳实践。

## Commit 信息规范

好的 commit message 是给自己和同事的情书。我用 Conventional Commits 格式：`feat:` 新功能、`fix:` 修 Bug、`docs:` 文档、`refactor:` 重构、`chore:` 杂项。第一行不超过 50 个字符，用英文祈使句。

## 分支策略

单人项目用 Trunk-based：直接在 master 上开发，功能用 feature flag 控制。团队项目用 GitHub Flow：从 master 拉 feature 分支，PR 审核后合并。Release 分支只在需要发布多个版本时使用。

## Rebase vs Merge

合并 feature 分支到 master 前先 `git rebase master`。保持提交历史线性，没有多余的 merge commit。黄金法则：只 rebase 还没有 push 的提交。已经 push 的分支不要 rebase，用 merge。

## 交互式暂存

`git add -p` 可以逐块选择要暂存的改动。你会惊讶地发现一个文件里常常混着多个不相关的修改。用这个命令把它们拆成多个语义清晰的 commit。

## 找回丢失的 Commit

`git reflog` 是后悔药。即使你 reset --hard 了，reflog 也能找回之前的 commit。`git reflog` 找到 commit hash，`git checkout` 过去，再 `git branch` 保存下来。
