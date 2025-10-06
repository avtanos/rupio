# 🚀 Деплой на GitHub Pages

## Автоматический деплой (Рекомендуется)

### Настройка GitHub Actions

1. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в Settings → Pages
   - Source: GitHub Actions
   - Сохраните настройки

2. **При каждом push в ветку `master` проект автоматически задеплоится**

### Ручной деплой

#### Вариант 1: Через npm скрипты

```bash
# Установка зависимостей
npm install

# Деплой
npm run deploy
```

#### Вариант 2: Через batch файл (Windows)

```bash
deploy_github_pages.bat
```

#### Вариант 3: Через PowerShell

```powershell
# Сборка и деплой
npm run build
npx gh-pages -d build
```

## 🔧 Настройка

### Требования

- Node.js 18+
- npm или yarn
- Git
- GitHub аккаунт

### Первоначальная настройка

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/avtanos/rupio.git
   cd rupio
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте remote (если нужно):**
   ```bash
   git remote add origin https://github.com/avtanos/rupio.git
   ```

## 📁 Структура деплоя

```
.github/
└── workflows/
    └── deploy.yml          # GitHub Actions workflow

build/                      # Собранное приложение
├── index.html
├── static/
│   ├── css/
│   └── js/
└── ...

deploy_github_pages.bat     # Скрипт для Windows
```

## 🌐 Результат

После успешного деплоя ваш сайт будет доступен по адресу:
**https://avtanos.github.io/rupio**

## 🔍 Проверка деплоя

1. Перейдите на https://avtanos.github.io/rupio
2. Убедитесь, что все страницы загружаются корректно
3. Проверьте, что все функции работают

## 🛠️ Устранение проблем

### Проблема: Сайт не обновляется

**Решение:**
- Подождите 5-10 минут (GitHub Pages кэширует изменения)
- Очистите кэш браузера (Ctrl+F5)
- Проверьте логи в Actions tab

### Проблема: Ошибка сборки

**Решение:**
```bash
# Очистите кэш
npm run build

# Или полная переустановка
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Проблема: 404 ошибки

**Решение:**
- Убедитесь, что `homepage` в package.json правильный
- Проверьте, что все файлы в build/ папке
- Используйте HashRouter вместо BrowserRouter

## 📝 Полезные команды

```bash
# Проверка статуса
git status

# Добавление изменений
git add .

# Коммит
git commit -m "Update for deployment"

# Пуш
git push origin master

# Деплой
npm run deploy
```

## 🔗 Ссылки

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [gh-pages package](https://www.npmjs.com/package/gh-pages)