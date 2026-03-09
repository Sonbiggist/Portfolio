<<<<<<< HEAD
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
=======
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/89f33439-7cbe-4dab-bee3-6041eb23e2f9

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
>>>>>>> 44a999753a6c82037dc48636e968e0f15f85eb81
