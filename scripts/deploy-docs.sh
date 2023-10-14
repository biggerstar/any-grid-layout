#!/usr/bin/env sh

# 忽略错误
set -e  #有错误抛出错误

# 构建
pnpm run docs:build

cd docs/.vitepress/dist

git init
git add -A
git commit -m 'deploy docs'

git push -f git@github.com:biggerstar/any-grid-layout.git main:docs-pages

cd -

rm -rf docs/.vitepress/dist
