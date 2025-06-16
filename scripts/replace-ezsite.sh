#!/bin/bash
# Script to replace all window.ezsite API calls with DatabaseService calls

echo "🔄 Replacing ezsite API calls with DatabaseService calls..."

# Find all TypeScript/TSX files in the src directory
find /workspaces/dfsportal/src -name "*.ts" -o -name "*.tsx" | while read -r file; do
    # Skip if the file doesn't contain window.ezsite
    if ! grep -q "window\.ezsite" "$file"; then
        continue
    fi
    
    echo "Processing: $file"
    
    # Add DatabaseService import if not already present
    if ! grep -q "import.*DatabaseService" "$file"; then
        # Find the last import line and add our import after it
        sed -i '/^import.*from.*$/a import DatabaseService from '\''@\/services\/databaseService'\'';' "$file"
    fi
    
    # Replace window.ezsite.apis calls with DatabaseService calls
    sed -i 's/window\.ezsite\.apis\.tablePage/DatabaseService.tablePage/g' "$file"
    sed -i 's/window\.ezsite\.apis\.tableCreate/DatabaseService.tableCreate/g' "$file"
    sed -i 's/window\.ezsite\.apis\.tableUpdate/DatabaseService.tableUpdate/g' "$file"
    sed -i 's/window\.ezsite\.apis\.tableDelete/DatabaseService.tableDelete/g' "$file"
    sed -i 's/window\.ezsite\.apis\.upload/DatabaseService.upload/g' "$file"
    sed -i 's/window\.ezsite\.apis\.sendEmail/DatabaseService.sendEmail/g' "$file"
    sed -i 's/window\.ezsite\.apis\.register/DatabaseService.register/g' "$file"
    sed -i 's/window\.ezsite\.apis\.getUserInfo/DatabaseService.getUserInfo/g' "$file"
done

echo "✅ Replacement complete!"
