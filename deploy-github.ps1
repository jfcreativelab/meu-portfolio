# Script de Deploy Automático para GitHub Pages
# Portfolio João Felipe - v2.0

Write-Host "`n🚀 INICIANDO DEPLOY AUTOMÁTICO PARA GITHUB PAGES`n" -ForegroundColor Cyan

# Verifica se Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não está instalado. Por favor, instale o Git primeiro." -ForegroundColor Red
    exit 1
}

# Verifica se já é um repositório Git
if (Test-Path .git) {
    Write-Host "✅ Repositório Git já inicializado" -ForegroundColor Green
} else {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repositório inicializado" -ForegroundColor Green
}

# Adiciona todos os arquivos
Write-Host "`n📝 Adicionando arquivos ao staging..." -ForegroundColor Yellow
git add .
Write-Host "✅ Arquivos adicionados" -ForegroundColor Green

# Verifica se há mudanças para commitar
$status = git status --porcelain
if ($status) {
    Write-Host "`n💾 Criando commit..." -ForegroundColor Yellow
    git commit -m "Portfolio v2.0 - Deploy completo com todas as funcionalidades"
    Write-Host "✅ Commit criado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Nenhuma mudança para commitar" -ForegroundColor Yellow
}

# Verifica se já tem remote configurado
$remote = git remote -v
if ($remote) {
    Write-Host "`n🔗 Repositório remoto configurado:" -ForegroundColor Cyan
    Write-Host $remote -ForegroundColor Gray
    Write-Host "`n❓ Deseja fazer push agora? (s/n)" -ForegroundColor Yellow
    $resposta = Read-Host
    if ($resposta -eq 's' -or $resposta -eq 'S' -or $resposta -eq 'sim') {
        Write-Host "`n📤 Fazendo push para GitHub..." -ForegroundColor Yellow
        $branch = git branch --show-current
        if (-not $branch) {
            git branch -M main
            $branch = "main"
        }
        git push -u origin $branch
        Write-Host "✅ Push concluído!" -ForegroundColor Green
        Write-Host "`n🎉 DEPLOY CONCLUÍDO!`n" -ForegroundColor Green
        Write-Host "Agora configure o GitHub Pages em:" -ForegroundColor Cyan
        Write-Host "Settings → Pages → Branch: main / (root)`n" -ForegroundColor Cyan
    }
} else {
    Write-Host "`n📋 CONFIGURAÇÃO DO REPOSITÓRIO REMOTO`n" -ForegroundColor Cyan
    Write-Host "Para conectar ao GitHub, execute os seguintes comandos:" -ForegroundColor Yellow
    Write-Host "`n1. Crie um repositório no GitHub (se ainda não criou)" -ForegroundColor White
    Write-Host "2. Execute o comando abaixo substituindo com seu usuário e nome do repo:`n" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git" -ForegroundColor Green
    Write-Host "   git branch -M main" -ForegroundColor Green
    Write-Host "   git push -u origin main`n" -ForegroundColor Green
    Write-Host "Ou se preferir usar SSH:" -ForegroundColor White
    Write-Host "   git remote add origin git@github.com:SEU-USUARIO/NOME-DO-REPO.git`n" -ForegroundColor Green
}

Write-Host "`n✨ Script concluído!`n" -ForegroundColor Cyan

