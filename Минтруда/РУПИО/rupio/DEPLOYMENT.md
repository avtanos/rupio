# Инструкции по деплою на GitHub Pages

## Подготовка проекта

Проект уже настроен для деплоя на GitHub Pages. В `package.json` указан правильный `homepage` и добавлены скрипты для деплоя.

## Способы деплоя

### 1. Автоматический деплой через GitHub Actions (Рекомендуется)

1. Загрузите код в GitHub репозиторий
2. В настройках репозитория включите GitHub Pages:
   - Settings → Pages
   - Source: GitHub Actions
3. При каждом push в ветку `master` или `main` проект автоматически соберется и задеплоится

### 2. Ручной деплой через gh-pages

```bash
# Установите gh-pages глобально
npm install -g gh-pages

# Соберите проект
npm run build

# Задеплойте на GitHub Pages
npm run deploy
```

### 3. Деплой через командную строку

```bash
# Сборка проекта
npm run build

# Инициализация git (если еще не сделано)
git init
git add .
git commit -m "Initial commit"

# Добавление удаленного репозитория
git remote add origin https://github.com/avtanos/rupio.git

# Загрузка кода
git push -u origin master

# Деплой на GitHub Pages
npm run deploy
```

## Проверка деплоя

После деплоя проект будет доступен по адресу:
https://avtanos.github.io/rupio

## Устранение проблем

### Проблема с PowerShell профилем

Если возникают ошибки с PowerShell, используйте:

```bash
# Вместо npm start используйте:
cmd /c "npm start"

# Или:
powershell -NoProfile -Command "npm start"
```

### Проблемы с путями

Убедитесь, что в `package.json` правильно указан `homepage`:
```json
{
  "homepage": "https://avtanos.github.io/rupio"
}
```

### Проблемы с роутингом

Для SPA приложений на GitHub Pages может потребоваться настройка 404.html для корректной работы роутинга.

## Структура проекта

- `src/` - исходный код React приложения
- `public/` - статические файлы
- `build/` - собранная версия для продакшена (создается при `npm run build`)
- `.github/workflows/` - GitHub Actions для автоматического деплоя
