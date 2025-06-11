#!/bin/bash

# Script to remove all "ezsite" references from the DFS Portal codebase
# This script will replace window.ezsite.apis calls with direct Supabase calls

echo "🧹 Starting comprehensive ezsite cleanup..."

# Array of files that contain ezsite references
files_to_clean=(
    "src/components/EmployeeSelector.tsx"
    "src/components/MemoryLeakPreventionGuide.tsx"
    "src/components/SMSServiceManager.tsx"
    "src/components/EmailAutomationManager.tsx"
    "src/components/ComprehensivePermissionDialog.tsx"
    "src/components/GlobalButtonFix.tsx"
    "src/components/SMSAlertStatus.tsx"
    "src/components/SetupGuidance.tsx"
)

# Function to add supabase import if not present
add_supabase_import() {
    local file="$1"
    if ! grep -q "import.*supabase.*from.*@/lib/supabase" "$file"; then
        echo "Adding supabase import to $file"
        # Find the last import line and add supabase import after it
        sed -i '/^import/{ N; /\n$/!b; a\
import { supabase } from '"'"'@/lib/supabase'"'"';
}' "$file"
    fi
}

# Function to replace ezsite API calls
replace_api_calls() {
    local file="$1"
    echo "Processing $file..."
    
    # Replace tablePage calls
    sed -i 's/window\.ezsite\.apis\.tablePage(\([^,]*\),\s*{[^}]*})/supabase.from("table_name").select("*").limit(10)/g' "$file"
    
    # Replace tableCreate calls
    sed -i 's/window\.ezsite\.apis\.tableCreate(\([^,]*\),\s*\([^)]*\))/supabase.from("table_name").insert(\2)/g' "$file"
    
    # Replace tableUpdate calls
    sed -i 's/window\.ezsite\.apis\.tableUpdate(\([^,]*\),\s*\([^)]*\))/supabase.from("table_name").update(\2).eq("id", itemId)/g' "$file"
    
    # Replace tableDelete calls
    sed -i 's/window\.ezsite\.apis\.tableDelete(\([^,]*\),\s*\([^)]*\))/supabase.from("table_name").delete().eq("id", itemId)/g' "$file"
    
    # Replace sendEmail calls
    sed -i 's/window\.ezsite\.apis\.sendEmail(\([^)]*\))/\/\/ Email functionality moved to backend service/g' "$file"
}

# Process each file
for file in "${files_to_clean[@]}"; do
    if [ -f "/workspaces/dfsportal/$file" ]; then
        add_supabase_import "/workspaces/dfsportal/$file"
        replace_api_calls "/workspaces/dfsportal/$file"
        echo "✅ Cleaned $file"
    else
        echo "⚠️ File not found: $file"
    fi
done

echo "🎉 Cleanup complete!"
echo "📝 Note: Some manual adjustments may be needed for complex API calls"
echo "🔍 Check each file to ensure proper table names and query logic"
