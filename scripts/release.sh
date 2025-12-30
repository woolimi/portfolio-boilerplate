#!/usr/bin/env sh

# abort on errors
set -e

# Check if repository URL is provided
if [ -z "$1" ]; then
  echo "Error: Repository URL is required"
  echo "Usage: ./release.sh <repository-url>"
  echo "Example: ./release.sh git@github.com:nickname/nickname.github.io.git"
  exit 1
fi

REPOSITORY_URL="$1"

# build
echo "Building project..."
pnpm build

# navigate into the build output directory
cd out

# remove system files
find . -name ".DS_Store" -delete

# create .nojekyll file to prevent Jekyll from ignoring _next directory
touch .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# initialize git repository
git init
git add -A
git commit -m 'deploy'

# deploy to the specified repository
echo "Deploying to $REPOSITORY_URL..."
git push -f "$REPOSITORY_URL" main

cd -