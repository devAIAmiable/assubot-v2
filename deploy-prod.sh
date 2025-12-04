#!/bin/bash

# Production Deployment Script
# This script automates the deployment to production by merging dev into main
# and pushing to trigger Railway auto-deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to cleanup on error
cleanup() {
    if [ $? -ne 0 ]; then
        print_error "Deployment failed. Cleaning up..."
        # Restore original branch if we switched
        if [ ! -z "$ORIGINAL_BRANCH" ] && [ "$ORIGINAL_BRANCH" != "dev" ]; then
            git checkout "$ORIGINAL_BRANCH" 2>/dev/null || true
        fi
    fi
}

trap cleanup EXIT

print_info "Starting production deployment..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi

# Store original branch
ORIGINAL_BRANCH=$(git branch --show-current)
print_info "Current branch: $ORIGINAL_BRANCH"

# Ensure we're on dev branch
if [ "$ORIGINAL_BRANCH" != "dev" ]; then
    print_warning "Not on dev branch. Switching to dev..."
    git checkout dev || {
        print_error "Failed to checkout dev branch"
        exit 1
    }
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes. Please commit or stash them before deploying."
    exit 1
fi

# Fetch latest changes
print_info "Fetching latest changes from remote..."
git fetch origin || {
    print_error "Failed to fetch from remote"
    exit 1
}

# Check if local dev is behind remote
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
if [ ! -z "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    print_warning "Your local dev branch is behind remote. Pulling latest changes..."
    git pull origin dev || {
        print_error "Failed to pull latest changes. Please resolve conflicts and try again."
        exit 1
    }
fi

# Get current commit hash and message for reference
CURRENT_COMMIT=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B)
print_info "Current commit: $CURRENT_COMMIT"
print_info "Commit message: $COMMIT_MSG"

# Create backup branch (optional safety measure)
BACKUP_BRANCH="backup-before-prod-$(date +%Y%m%d-%H%M%S)"
print_info "Creating backup branch: $BACKUP_BRANCH"
git branch "$BACKUP_BRANCH" || {
    print_error "Failed to create backup branch"
    exit 1
}
print_success "Backup branch created"

# Checkout main branch
print_info "Checking out main branch..."
git checkout main || {
    print_error "Failed to checkout main branch"
    exit 1
}

# Pull latest main
print_info "Pulling latest main branch..."
git pull origin main || {
    print_error "Failed to pull latest main branch"
    git checkout dev
    exit 1
}

# Merge dev into main
print_info "Merging dev into main..."
if git merge dev --no-edit; then
    print_success "Merge successful"
else
    print_error "Merge failed due to conflicts. Please resolve conflicts manually:"
    echo "  1. Resolve conflicts in the files above"
    echo "  2. Run: git add ."
    echo "  3. Run: git commit"
    echo "  4. Run: git push origin main"
    echo "  5. Or abort the merge: git merge --abort"
    git checkout dev
    exit 1
fi

# Push to remote (this will trigger Railway deployment)
print_info "Pushing to remote main branch (this will trigger Railway deployment)..."
if git push origin main; then
    print_success "Push successful!"
    print_success "Production deployment triggered on Railway"
    print_info "Monitor deployment status in Railway dashboard"
else
    print_error "Failed to push to remote"
    print_warning "You may need to push manually: git push origin main"
    exit 1
fi

# Return to dev branch
print_info "Returning to dev branch..."
git checkout dev || {
    print_warning "Failed to checkout dev branch, but deployment was successful"
    exit 0
}

print_success "Production deployment completed successfully!"
print_info "You are back on the dev branch and can continue working."
