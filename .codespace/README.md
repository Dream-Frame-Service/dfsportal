# GitHub Codespace Configuration for DFS Portal

## Recommended machine types for different use cases

- **2-core, 8GB RAM, 32GB storage**: Basic development
- **4-core, 16GB RAM, 64GB storage**: Full development with builds
- **8-core, 32GB RAM, 128GB storage**: Heavy development, testing, and CI/CD

## To manually select a machine type

1. Go to your repository on GitHub
2. Click "Code" > "Codespaces" > "Create codespace on main"
3. Click "Configure and create codespace"
4. Select your preferred machine type

## Or use the GitHub CLI

```bash
gh codespace create --repo YOUR_USERNAME/dfsportal --machine basicLinux32gb
```

## Machine type recommendations

- **basicLinux32gb**: 2-core, 8GB RAM, 32GB storage
- **standardLinux32gb**: 4-core, 16GB RAM, 32GB storage  
- **premiumLinux**: 8-core, 32GB RAM, 128GB storage

## Environment variables for larger storage requirements

```bash
CODESPACE_STORAGE_REQUEST=64gb
CODESPACE_PREBUILD_ENABLED=true
```
