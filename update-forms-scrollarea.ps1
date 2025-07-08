#!/usr/bin/env pwsh
# Script to update all forms in modules to use ScrollArea

Write-Host "Updating forms with ScrollArea..." -ForegroundColor Green

# List of form files to update (excluding already updated ones)
$formsToUpdate = @(
    "modules\partners\components\PartnerForm.tsx",
    "modules\students\components\StudentForm.tsx", 
    "modules\thesis\components\ThesisForm.tsx",
    "modules\internship\components\InternshipForm.tsx"
)

foreach ($formFile in $formsToUpdate) {
    $fullPath = Join-Path $PSScriptRoot $formFile
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $formFile" -ForegroundColor Yellow
        
        # Read current content
        $content = Get-Content $fullPath -Raw
        
        # Check if ScrollArea is already imported
        if ($content -notmatch 'import.*ScrollArea.*from') {
            Write-Host "  Adding ScrollArea import..." -ForegroundColor Cyan
            
            # Add ScrollArea import
            $content = $content -replace '(import.*from\s+[''"]@/components/ui/[^''"]*[''"])', '$1' + "`nimport { ScrollArea } from '@/components/ui/scroll-area'"
            
            # Create backup
            $backupPath = $fullPath + ".backup"
            Copy-Item $fullPath $backupPath
            
            Write-Host "  Backup created: $backupPath" -ForegroundColor Gray
            Write-Host "  ScrollArea import added to: $formFile" -ForegroundColor Green
            
            # Write updated content
            Set-Content $fullPath $content -NoNewline
        } else {
            Write-Host "  ScrollArea already imported in: $formFile" -ForegroundColor Green
        }
    } else {
        Write-Host "File not found: $fullPath" -ForegroundColor Red
    }
}

Write-Host "`nForm update completed! Please manually update the form layout structure." -ForegroundColor Green
Write-Host "Pattern to follow:" -ForegroundColor Yellow
Write-Host "1. Wrap form content in: <div className='flex flex-col h-full'>" -ForegroundColor Cyan
Write-Host "2. Wrap form fields in: <ScrollArea className='flex-1 px-1'>" -ForegroundColor Cyan  
Write-Host "3. Move form actions outside ScrollArea with: className='p-4 border-t bg-background'" -ForegroundColor Cyan
