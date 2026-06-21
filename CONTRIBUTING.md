# 🌿 Repository Branching Rules & Workflow

To maintain a clean commit history and ensure our live website never crashes, all contributors must follow strict Agile/GitFlow industry standards.

### 1. Branch Naming Conventions

Always name your branch based on the work you are doing. Use lowercase and hyphens:

* **New features:** `feature/your-feature-name` (e.g., `feature/event-card`)
* **Bug fixes:** `fix/issue-description` (e.g., `fix/mobile-nav-toggle`)
* **Documentation:** `docs/update-readme`
* **Refactoring:** `refactor/gallery-components`

### 2. The Development Workflow

You must **never** work directly on `main` or `dev`. Follow these steps for every task:

1. **Sync with the staging branch:** Before creating a branch, make sure your local repository is up to date with `dev`.
```bash
git checkout dev
git pull origin dev
```

2. **Create your isolated workspace:**
```bash
git checkout -b feature/your-feature-name
```

3. **Use Atomic & Conventional Commits:** Commit your code at logical checkpoints. Write descriptive commit messages using the Conventional Commits standard so the team knows exactly what changed without reading the code:

* feat: add animated carousel to events page
* style: update neon purple hex code in global.css
* fix: resolve layout shift on mobile navbar

```bash 
    git add .
    git commit -m "feat: your descriptive message"
```

4. **Verify before pushing:** Always ensure Vite can compile your code without crashing.
```bash
    npm run build
```

5. **Push your branch to GitHub:**
```bash
    git push origin feature/your-feature-name
```

### 3. Pull Request (PR) Rules

* **Target the Right Branch:** All Pull Requests for features and bug fixes must target the `dev` branch, NOT `main`.
* **No Self-Merges:** You cannot merge your own Pull Request. At least one core maintainer or senior reviewer must review your code and approve it.
* **Keep it Clean & Optimized:** Before raising a PR, ensure your code meets our React architecture standards:
* No leftover `console.log()` statements.
* Code builds successfully (`npm run build`) with no rendering errors.
* No missing React `key` warnings in the browser console.



### 4. Direct Pushes are Blocked

The `main` and `dev` branches are protected on GitHub. Any attempt to run `git push origin main` directly from your terminal will be rejected by the server to enforce code reviews and maintain platform stability.
