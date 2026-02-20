# Por qué falla el push y cómo arreglarlo

## Qué está pasando

- Cursor/VS Code está usando el repositorio de la **carpeta padre** (`WebPortfolio`), no uno propio de `memoriasvivas`.
- Ese repo tiene `origin` apuntando a **I-U** (`https://github.com/iluna007/I-U.git`).
- Tus commits de memoriasvivas se hacen dentro de ese repo y al hacer push intentas subir a I-U, donde la historia es distinta → **rejected (non-fast-forward)**.
- Si haces pull, Git dice **"refusing to merge unrelated histories"** porque tu rama y la de I-U no comparten ancestro.

Por eso no puedes hacer push desde la interfaz de Git de Cursor en este proyecto.

## Solución: repo solo para memoriasvivas

Hay que crear un repositorio git **dentro** de la carpeta `memoriasvivas` y usarlo como proyecto independiente.

### Paso 1 – En PowerShell (fuera de Cursor)

Abre **PowerShell** y ejecuta:

```powershell
cd X:\Proyectos\2026\WebPortfolio\memoriasvivas

# Borrar .git roto si existe
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Crear repo nuevo
git init
git add .
git commit -m "Memorias Vivas - 18 esferas Three.js"
git remote add origin https://github.com/iluna007/memoriasvivas.git
git branch -M main
git push -u origin main
```

Si el repo en GitHub ya tiene commits (p. ej. README creado ahí), usa:

```powershell
git pull origin main --allow-unrelated-histories
# Si pide mensaje de merge, guarda y cierra el editor
git push -u origin main
```

### Paso 2 – Abrir solo memoriasvivas en Cursor

Para que Cursor use el repo de memoriasvivas y no el de WebPortfolio:

1. **Archivo → Abrir carpeta** (o **File → Open Folder**).
2. Elige **solo** esta carpeta: `X:\Proyectos\2026\WebPortfolio\memoriasvivas`.
3. No abras la carpeta `WebPortfolio` como raíz del workspace.

Así el control de código fuente usará el `.git` de memoriasvivas y podrás hacer **commit** y **push** sin el error de "pull first" y hacia el repo correcto (memoriasvivas).

### Resumen

| Antes (mal) | Después (bien) |
|-------------|----------------|
| Repo = WebPortfolio, origin = I-U | Repo = memoriasvivas, origin = memoriasvivas |
| Push intenta subir a I-U → rechazado | Push sube a memoriasvivas → correcto |
| Cursor con workspace que incluye padre | Cursor abriendo **solo** la carpeta memoriasvivas |
