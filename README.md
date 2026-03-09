# Portfolio

Project Vite + React + Tailwind, đã chỉnh sẵn để deploy lên GitHub Pages cho repo `Sonbiggist/Portfolio`.

## Chạy local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy tự động bằng GitHub Actions

1. Push code lên nhánh `main`
2. Vào **Repo → Settings → Pages**
3. Ở **Build and deployment**, chọn **Source = GitHub Actions**

Workflow nằm ở:

```text
.github/workflows/deploy.yml
```

Sau khi workflow chạy xong, site sẽ lên tại:

```text
https://sonbiggist.github.io/Portfolio/
```

## Deploy thủ công

```bash
npm run deploy
```

Lưu ý: script này dùng package `gh-pages` và sẽ publish thư mục `dist`.
