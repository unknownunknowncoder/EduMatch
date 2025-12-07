@echo off
set GIT_PAGER=
set LESS=
git checkout stash@{6} -- src/
if %errorlevel% equ 0 (
    echo Stash 6 restored successfully!
    git status --short
) else (
    echo Failed to restore stash 6
)

