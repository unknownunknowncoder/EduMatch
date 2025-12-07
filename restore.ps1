$env:GIT_PAGER = ''
$env:LESS = ''
$env:PAGER = ''

# 尝试恢复 stash 6
Write-Host "正在恢复 stash 6..."
git checkout stash@{6} -- src/ 2>&1 | Out-String

Write-Host "`n检查恢复结果..."
git status --short 2>&1 | Out-String

