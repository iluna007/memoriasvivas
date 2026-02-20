# Ejecutar en PowerShell desde esta carpeta (memoriasvivas)
# Ejemplo: cd X:\Proyectos\2026\WebPortfolio\memoriasvivas; .\setup-git.ps1

Set-Location $PSScriptRoot

Write-Host "Eliminando .git anterior (si existe)..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

Write-Host "Inicializando repo..." -ForegroundColor Cyan
git init
git add .
git status

Write-Host "`nCreando commit inicial..." -ForegroundColor Cyan
git commit -m "Memorias Vivas - 18 esferas Three.js"

Write-Host "`nComprobando si origin existe..." -ForegroundColor Cyan
$origin = git remote get-url origin 2>$null
if ($origin) {
    Write-Host "Origin actual: $origin" -ForegroundColor Yellow
    git remote set-url origin "https://github.com/iluna007/memoriasvivas.git"
    Write-Host "Origin actualizado a memoriasvivas." -ForegroundColor Green
} else {
    git remote add origin "https://github.com/iluna007/memoriasvivas.git"
    Write-Host "Origin agregado." -ForegroundColor Green
}

git branch -M main

Write-Host "`nIntentando push..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nSi el remoto ya tiene commits, ejecuta:" -ForegroundColor Yellow
    Write-Host "  git pull origin main --allow-unrelated-histories" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
}
