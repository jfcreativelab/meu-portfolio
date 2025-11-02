# 🚀 Deploy Rápido - GitHub Pages

## Opção 1: Script Automático (Recomendado)

### No Windows (PowerShell):
```powershell
.\deploy-github.ps1
```

### No Windows (CMD):
```cmd
deploy-github.bat
```

## Opção 2: Comandos Manuais

### 1. Inicializar Git (se ainda não foi feito):
```bash
git init
```

### 2. Adicionar todos os arquivos:
```bash
git add .
```

### 3. Criar commit:
```bash
git commit -m "Portfolio v2.0 - Deploy completo"
```

### 4. Conectar ao GitHub (substitua com seus dados):
```bash
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
git branch -M main
git push -u origin main
```

### 5. Configurar GitHub Pages:
1. Vá para o repositório no GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `main` / Folder: `/ (root)`
5. Save

## ✅ Verificação

Seu site estará disponível em:
```
https://SEU-USUARIO.github.io/NOME-DO-REPO/
```

---

**Dica:** Se você ainda não criou o repositório no GitHub:
1. Acesse https://github.com/new
2. Crie um novo repositório (pode ser público ou privado)
3. NÃO marque "Initialize with README"
4. Use os comandos acima para conectar

