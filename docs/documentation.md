# Документация по запуску проекта `coursee`

## 1. Что это за проект

Это Django-проект с приложением `trading`, в котором есть:

- авторизация и регистрация пользователей;
- дашборд с рынком и сделками;
- профиль пользователя;
- получение рыночных данных через `yfinance`;
- WebSocket-канал для обновления цен;
- SQLite-база данных по умолчанию.

Основной модуль настроек: `exchange.settings`.

Точка входа для Django-команд: `manage.py`.

## 2. Стек проекта

- Python
- Django
- Channels
- Daphne
- SQLite
- yfinance

Файл зависимостей: `requirements.txt`

## 3. Что нужно перед запуском

Убедитесь, что на компьютере установлены:

- Python 3.12+ или другая версия, совместимая с Django 6;
- `pip`;
- доступ в интернет для загрузки зависимостей и получения котировок через `yfinance`.

Для Windows удобно проверить так:

```powershell
python --version
pip --version
```

Если команда `python` не найдена, попробуйте:

```powershell
py --version
```

## 4. Структура проекта

Ключевые файлы и папки:

- `manage.py` — запуск Django-команд;
- `exchange/settings.py` — настройки проекта;
- `exchange/urls.py` — корневые маршруты;
- `exchange/asgi.py` — ASGI-конфигурация для Daphne/Channels;
- `trading/` — основная бизнес-логика;
- `templates/` — HTML-шаблоны;
- `static/` — CSS/JS/статические файлы;
- `media/` — пользовательские медиафайлы;
- `db.sqlite3` — текущая локальная база данных.

## 5. Быстрый запуск на Windows

Откройте PowerShell в папке проекта:

```powershell
cd путь_к_проекту
```

Обновите `pip`:

```powershell
python -m pip install --upgrade pip
```

Установите зависимости:

```powershell
pip install -r requirements.txt
```

Примените миграции:

```powershell
python manage.py makemigrations
python manage.py migrate
```

Запустите сервер разработки:

```powershell
python manage.py runserver
```

После этого проект будет доступен по адресу:

```text
http://127.0.0.1:8000/
```

## 6. Что делать, если база уже есть

В проекте уже присутствует файл `db.sqlite3`.

Это означает:

- можно запускать проект на существующей локальной базе;
- команда `migrate` всё равно рекомендуется, чтобы схема точно соответствовала коду;
- удалять `db.sqlite3` не нужно, если вы хотите сохранить текущие данные.

Если нужен полностью чистый старт:

1. Остановите сервер.
2. Удалите `db.sqlite3`.
3. Выполните `python manage.py migrate`.
4. При необходимости создайте администратора.

## 7. Создание администратора

Если нужен вход в Django Admin:

```powershell
python manage.py createsuperuser
```

Админка доступна по адресу:

```text
http://127.0.0.1:8000/admin/
```

## 8. Основные маршруты приложения

- `/` — дашборд;
- `/login/` — вход;
- `/register/` — регистрация;
- `/logout/` — выход;
- `/admin/` — Django Admin;
- `/api/top10-market/` — API рыночных данных;
- `/api/chart/<ticker>/` — API графика;
- `/api/profile/` — API профиля.

## 9. Статика и медиа

В режиме разработки Django раздаёт:

- статику из папки `static/`;
- медиа из папки `media/`.

Для локального запуска отдельный `collectstatic` не требуется.

## 10. Рыночные данные и обновление цен

Проект использует `yfinance` для получения цен.

Если интернет недоступен, приложение всё равно сможет работать с резервными рыночными данными, заложенными в коде.

Дополнительно в проекте есть management-команда для фонового обновления цен:

```powershell
python manage.py update_prices
```

Полезные варианты запуска:

Один цикл обновления:

```powershell
python manage.py update_prices --once
```

Свои интервалы:

```powershell
python manage.py update_prices --interval 15 --history-interval 60 --retention-hours 72
```

Что делает команда:

- получает свежие цены;
- отправляет обновления в WebSocket-группу `crypto_prices`;
- пишет историю цен в таблицу `PriceHistory`;
- очищает старые записи истории.

## 11. WebSocket и запуск через ASGI

В проекте настроен Channels и WebSocket endpoint:

```text
/ws/prices/
```

Если нужен запуск через ASGI/Daphne вместо стандартного `runserver`, используйте:

```powershell
daphne exchange.asgi:application
```

Или с указанием порта:

```powershell
daphne -p 8000 exchange.asgi:application
```

Когда использовать какой режим:

- `python manage.py runserver` — обычная локальная разработка;
- `daphne exchange.asgi:application` — если вы хотите явно использовать ASGI-стек и WebSocket-сценарий.

## 12. Тесты

Запуск тестов приложения `trading`:

```powershell
python manage.py test trading
```

Запуск всех тестов проекта:

```powershell
python manage.py test
```

## 13. Типовой сценарий первого запуска

Рекомендуемая последовательность:

1. Перейти в папку проекта.
2. Установить зависимости из `requirements.txt`.
3. Выполнить миграции.
4. Создать суперпользователя при необходимости.
5. Запустить `python manage.py runserver`.
6. Открыть `http://127.0.0.1:8000/register/` или `http://127.0.0.1:8000/login/`.

## 14. Частые проблемы

### `python` не найден

Используйте:

```powershell
py -m pip install -r requirements.txt
py manage.py runserver
```

### Не установились зависимости

Обновите `pip` и повторите:

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Ошибка базы данных

Проверьте, что были выполнены миграции:

```powershell
python manage.py migrate
```

### Не открываются актуальные цены

Проверьте:

- есть ли интернет;
- установился ли пакет `yfinance`;
- не блокирует ли сеть запросы к внешним источникам.

### Не работают WebSocket-обновления

Проверьте:

- что сервер запущен;
- что WebSocket-клиент подключается к `/ws/prices/`;
- что отдельно запущена команда `python manage.py update_prices`, если вам нужны живые пуш-обновления.

## 15. Команды в одном месте

Установка зависимостей:

```powershell
pip install -r requirements.txt
```

Миграции:

```powershell
python manage.py migrate
```

Создание администратора:

```powershell
python manage.py createsuperuser
```

Обычный запуск:

```powershell
python manage.py runserver
```

Запуск обновления цен:

```powershell
python manage.py update_prices
```

Тесты:

```powershell
python manage.py test trading
```
