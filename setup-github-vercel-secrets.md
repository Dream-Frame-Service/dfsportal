# GitHub Secrets Setup for Vercel Deployment

## Required GitHub Repository Secrets

Add these secrets to your GitHub repository at: `Settings > Secrets and variables > Actions > New repository secret`

### 1. VERCEL_TOKEN
```
Df9VdVMiA6JDBApzLr8om3SS
```

### 2. VERCEL_ORG_ID
```
team_3q6IOr30kaMWw9pfulba28ef
```

### 3. VERCEL_PROJECT_ID
```
prj_pCpaWRWFomnGIsvBEnzZeUrsWAgb
```

## Step-by-Step Instructions

1. **Go to your GitHub repository**
   - Navigate to `https://github.com/[YOUR-USERNAME]/[YOUR-REPO-NAME]`

2. **Access Settings**
   - Click on the "Settings" tab at the top of your repository

3. **Navigate to Secrets**
   - In the left sidebar, click "Secrets and variables"
   - Click "Actions"

4. **Add Each Secret**
   - Click "New repository secret"
   - Name: `VERCEL_TOKEN`
   - Secret: `Df9VdVMiA6JDBApzLr8om3SS`
   - Click "Add secret"

   - Click "New repository secret"
   - Name: `VERCEL_ORG_ID` 
   - Secret: `team_3q6IOr30kaMWw9pfulba28ef`
   - Click "Add secret"

   - Click "New repository secret"
   - Name: `VERCEL_PROJECT_ID`
   - Secret: `prj_pCpaWRWFomnGIsvBEnzZeUrsWAgb`
   - Click "Add secret"

## Verification

After adding the secrets, your GitHub Actions workflow in `.github/workflows/deploy.yml` will automatically use them for Vercel deployments.

The deployment will trigger when you push to:
- `main` branch (production deployment)
- `production` branch (production deployment)

## Test the Setup

1. Make a small change to your code
2. Commit and push to the `main` branch
3. Check the Actions tab in GitHub to see the deployment progress
4. Verify the deployment on Vercel

Your existing workflow is already correctly configured to use these secrets!
