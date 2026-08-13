# 🔧 Git Commands Helper

Panduan git commands untuk push project ke GitHub.

---

## 📦 Initial Setup (Jika Belum Ada Repo)

### 1. Buat Repository di GitHub

1. Buka https://github.com/new
2. Repository name: `sistem-inventaris`
3. Description: `Aplikasi CRUD Sistem Inventaris Barang dengan POS`
4. Public/Private: **Public** (recommended untuk portfolio)
5. **JANGAN** add README, .gitignore, atau license (sudah ada di project)
6. Klik "Create repository"

### 2. Connect Local ke GitHub

```bash
# Di folder root project (sistem-inventaris/)

# 1. Check current remote (jika ada)
git remote -v

# 2. Jika belum ada remote, tambahkan
git remote add origin https://github.com/IanSapury/sistem-inventaris.git

# 3. Jika sudah ada tapi salah, ganti
git remote set-url origin https://github.com/IanSapury/sistem-inventaris.git
```

---

## 📤 Push ke GitHub

### First Time Push

```bash
# 1. Check status file
git status

# 2. Add semua file yang sudah direstrukturisasi
git add .

# 3. Commit dengan message yang jelas
git commit -m "Restructure project for cloud deployment

- Separate frontend and backend into monorepo structure
- Configure backend for Render deployment
- Configure frontend for Vercel deployment
- Add comprehensive deployment guides
- Update CORS and environment configuration"

# 4. Push ke GitHub (pertama kali)
git branch -M main
git push -u origin main
```

### Jika Ada Error "Updates were rejected"

```bash
# Option 1: Pull dulu (jika ada conflict)
git pull origin main --rebase

# Resolve conflicts (jika ada), lalu:
git add .
git rebase --continue

# Push
git push origin main

# Option 2: Force push (HATI-HATI! Hanya jika yakin)
git push -u origin main --force
```

---

## 🔄 Update Code (Setelah Edit)

### Push Changes

```bash
# 1. Check apa yang berubah
git status

# 2. Add file yang diubah
git add .

# Atau add specific files
git add backend/server.js
git add frontend/public/js/config.js

# 3. Commit dengan message yang descriptive
git commit -m "Update API configuration for production"

# 4. Push ke GitHub
git push origin main
```

### Common Commit Messages

```bash
# Update backend
git commit -m "Fix CORS configuration"
git commit -m "Add new API endpoint for reports"
git commit -m "Update database schema"

# Update frontend
git commit -m "Update API base URL for production"
git commit -m "Fix UI bug in POS page"
git commit -m "Add loading state to dashboard"

# Documentation
git commit -m "Update deployment guide"
git commit -m "Add troubleshooting section to README"
```

---

## 📋 Useful Git Commands

### Check Status

```bash
# Lihat file yang berubah
git status

# Lihat diff/perubahan detail
git diff

# Lihat history commit
git log --oneline
```

### Undo Changes

```bash
# Undo perubahan file yang belum di-add
git checkout -- filename.js

# Undo semua perubahan yang belum di-add
git checkout -- .

# Undo git add (unstage)
git reset HEAD filename.js

# Undo commit terakhir (tapi keep changes)
git reset --soft HEAD~1

# Undo commit terakhir (discard changes - HATI-HATI!)
git reset --hard HEAD~1
```

### Branches (Optional)

```bash
# Buat branch baru untuk feature
git checkout -b feature/new-report

# Switch branch
git checkout main

# Merge branch ke main
git checkout main
git merge feature/new-report

# Delete branch
git branch -d feature/new-report
```

---

## 🔍 Check Remote Repository

```bash
# Lihat remote URL
git remote -v

# Should show:
# origin  https://github.com/IanSapury/sistem-inventaris.git (fetch)
# origin  https://github.com/IanSapury/sistem-inventaris.git (push)
```

---

## 🚨 Common Issues

### Issue: "fatal: not a git repository"

```bash
# Initialize git
git init
git remote add origin https://github.com/IanSapury/sistem-inventaris.git
```

### Issue: "Permission denied (publickey)"

**Solusi 1: Gunakan HTTPS (Recommended)**
```bash
git remote set-url origin https://github.com/IanSapury/sistem-inventaris.git
git push origin main
# Masukkan username & password (atau Personal Access Token)
```

**Solusi 2: Setup SSH Key**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
# Windows:
cat ~/.ssh/id_ed25519.pub | clip

# Add to GitHub: Settings → SSH Keys → New SSH Key → Paste

# Test connection
ssh -T git@github.com
```

### Issue: "Updates were rejected"

```bash
# Pull changes first
git pull origin main --rebase

# Jika ada conflict, resolve dulu
git add .
git rebase --continue

# Push
git push origin main
```

### Issue: "Your branch is behind 'origin/main'"

```bash
# Pull latest changes
git pull origin main

# Atau dengan rebase
git pull origin main --rebase
```

---

## 📝 Git Workflow Recommendation

### Development Workflow

```bash
# 1. Mulai coding
# ... edit files ...

# 2. Test locally
cd backend
npm run dev

# 3. Commit & push
git add .
git commit -m "Descriptive message"
git push origin main

# 4. Vercel & Render akan auto-deploy dari GitHub
```

### Best Practices

✅ **DO**:
- Commit sering dengan message yang jelas
- Test locally sebelum push
- Baca output dari git command
- Pull sebelum push jika ada collaborator

❌ **DON'T**:
- Push file `.env` (sudah di .gitignore)
- Force push kecuali benar-benar perlu
- Commit `node_modules/` (sudah di .gitignore)
- Commit file temporary atau log

---

## 🔗 Helpful Links

- **GitHub Docs**: https://docs.github.com/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **Learn Git**: https://learngitbranching.js.org/

---

## 📞 Need Help?

Jika ada masalah dengan git:
1. Copy error message lengkap
2. Google: "git [error message]"
3. Atau buat issue di GitHub

---

**Happy Git-ing! 🎉**
