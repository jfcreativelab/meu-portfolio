@echo off
echo.
echo 🚀 INICIANDO DEPLOY AUTOMATICO PARA GITHUB PAGES
echo.

REM Verifica se Git esta instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git nao esta instalado. Por favor, instale o Git primeiro.
    pause
    exit /b 1
)

echo ✅ Git encontrado
echo.

REM Verifica se ja e um repositorio Git
if exist .git (
    echo ✅ Repositorio Git ja inicializado
) else (
    echo 📦 Inicializando repositorio Git...
    git init
    echo ✅ Repositorio inicializado
)

echo.
echo 📝 Adicionando arquivos ao staging...
git add .
echo ✅ Arquivos adicionados

echo.
echo 💾 Criando commit...
git commit -m "Portfolio v2.0 - Deploy completo com todas as funcionalidades"
if errorlevel 1 (
    echo ⚠️  Nenhuma mudanca para commitar ou commit ja existe
) else (
    echo ✅ Commit criado com sucesso!
)

echo.
git remote -v >nul 2>&1
if errorlevel 1 (
    echo 📋 CONFIGURACAO DO REPOSITORIO REMOTO
    echo.
    echo Para conectar ao GitHub, execute os seguintes comandos:
    echo.
    echo 1. Crie um repositorio no GitHub (se ainda nao criou)
    echo 2. Execute:
    echo.
    echo    git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
    echo    git branch -M main
    echo    git push -u origin main
    echo.
) else (
    echo 🔗 Repositorio remoto configurado:
    git remote -v
    echo.
    set /p resposta="❓ Deseja fazer push agora? (s/n): "
    if /i "%resposta%"=="s" (
        echo.
        echo 📤 Fazendo push para GitHub...
        git branch --show-current >nul 2>&1
        if errorlevel 1 (
            git branch -M main
        )
        git push -u origin main
        echo ✅ Push concluido!
        echo.
        echo 🎉 DEPLOY CONCLUIDO!
        echo.
        echo Agora configure o GitHub Pages em:
        echo Settings → Pages → Branch: main / (root)
        echo.
    )
)

echo.
echo ✨ Script concluido!
echo.
pause

