param(
    [int]$IntervalSeconds = 5,
    [string]$Remote = "origin",
    [string]$Branch = "main"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   🚀 Se_project Auto-Push Watcher Started" -ForegroundColor Green
Write-Host "   Target: $Remote / $Branch" -ForegroundColor Yellow
Write-Host "   Polling Interval: $IntervalSeconds seconds" -ForegroundColor Gray
Write-Host "   Press Ctrl + C to stop watching." -ForegroundColor DarkGray
Write-Host "=========================================" -ForegroundColor Cyan

while ($true) {
    try {
        # Check if there are any unstaged or untracked changes
        $status = git status --porcelain 2>$null

        if ($status) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "[$timestamp] 📝 Detected changes. Staging and committing..." -ForegroundColor Yellow

            git add -A
            $commitOutput = git commit -m "Auto update: $timestamp" 2>&1
            Write-Host $commitOutput -ForegroundColor DarkGray

            Write-Host "[$timestamp] ⬆️ Pushing changes to $Remote $Branch..." -ForegroundColor Cyan
            $pushOutput = git push $Remote $Branch 2>&1
            Write-Host $pushOutput -ForegroundColor Green
            Write-Host "[$timestamp] ✅ Successfully synced with GitHub!" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️ Error during auto-push cycle: $_" -ForegroundColor Red
    }

    Start-Sleep -Seconds $IntervalSeconds
}
