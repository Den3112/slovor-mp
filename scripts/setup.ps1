# ===========================================
# Slovor Marketplace - Quick Setup Script
# Run this script after git clone (Windows)
# ===========================================

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║     Slovor Marketplace - Quick Setup      ║" -ForegroundColor Blue
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

Set-Location $ProjectRoot

# Step 1: Check for .env.local
Write-Host "[1/3] " -NoNewline -ForegroundColor Yellow
Write-Host "Checking environment configuration..."

if (Test-Path ".env.local") {
    Write-Host "✓ " -NoNewline -ForegroundColor Green
    Write-Host ".env.local already exists"
} else {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "✓ " -NoNewline -ForegroundColor Green
        Write-Host "Created .env.local from .env.example"
    } else {
        Write-Host "✗ " -NoNewline -ForegroundColor Red
        Write-Host "Error: .env.example not found!"
        exit 1
    }
}

# Step 2: Check Docker
Write-Host "[2/3] " -NoNewline -ForegroundColor Yellow
Write-Host "Checking Docker installation..."

try {
    $null = docker --version 2>$null
    Write-Host "✓ " -NoNewline -ForegroundColor Green
    Write-Host "Docker is installed"
} catch {
    Write-Host "✗ " -NoNewline -ForegroundColor Red
    Write-Host "Docker is not installed. Please install Docker first."
    Write-Host "   Visit: https://docs.docker.com/get-docker/"
    exit 1
}

try {
    $null = docker compose version 2>$null
    Write-Host "✓ " -NoNewline -ForegroundColor Green
    Write-Host "Docker Compose is available"
} catch {
    try {
        $null = docker-compose --version 2>$null
        Write-Host "✓ " -NoNewline -ForegroundColor Green
        Write-Host "Docker Compose is available"
    } catch {
        Write-Host "✗ " -NoNewline -ForegroundColor Red
        Write-Host "Docker Compose is not available"
        exit 1
    }
}

# Step 3: Display next steps
Write-Host "[3/3] " -NoNewline -ForegroundColor Yellow
Write-Host "Setup complete!"
Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           Ready to launch! 🚀             ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host ""
Write-Host "  Production:" -ForegroundColor Blue
Write-Host "    docker-compose up -d --build"
Write-Host ""
Write-Host "  Development (with hot-reload):" -ForegroundColor Blue
Write-Host "    docker-compose --profile dev up dev"
Write-Host ""
Write-Host "  View logs:" -ForegroundColor Blue
Write-Host "    docker-compose logs -f"
Write-Host ""
Write-Host "  Health check:" -ForegroundColor Blue
Write-Host "    curl http://localhost:3000/api/health"
Write-Host ""
