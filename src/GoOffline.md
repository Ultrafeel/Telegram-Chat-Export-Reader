# Open a Telegram Export Offline

The app processes your export locally in the browser; chat files are not uploaded to a server. To use it without an internet connection, load the app first, take its tab offline, then choose your export folder.

## Chrome, Edge, or Firefox

1. Open the app and wait for it to finish loading.
2. Open Developer Tools with `F12` or `Ctrl+Shift+I`.
3. Open the **Network** panel and select **Offline** from the network throttling menu. If the menu shows **No throttling**, open it and choose **Offline**. Keep Developer Tools open.
4. In the app, click the button to load an export and select your Telegram export folder. Confirm the folder selection if the browser asks.
5. Wait for the export to finish processing. To reconnect, select **No throttling**.

The **Offline** setting in Developer Tools applies only to the inspected tab. Do not refresh the page after going offline: the app is already loaded and can continue running, but the browser may not be able to reload it.

## Choose the right folder

Select the folder containing one of these export files:

- `result.json` for a JSON export;
- `messages.html` or `messages1.html` for an HTML export.

Keep the media files in the original export folder structure so photos, videos, and other attachments can be found. If the folder contains both JSON and HTML, the app loads the JSON export.

## Important

This works as long as the app page is already open and loaded. If you close the tab or refresh while offline, reconnect and open the app again. You can still select and process the Telegram export while offline.

## Firefox: switch the WHOLE browser to offline mode

In the menu bar, choose File → Work Offline. On Windows/Linux, press `Alt` if the menu bar is hidden. Select the same option again to reconnect. Firefox may still display previously cached pages while offline. [howtogeek](https://www.howtogeek.com/263854/how-to-enable-offline-browsing-in-firefox/)

# Как открыть Telegram-экспорт офлайн

Приложение обрабатывает экспорт прямо в браузере: файлы чата не отправляются на сервер. Чтобы открыть экспорт без подключения к интернету, сначала загрузите приложение, затем отключите сеть для его вкладки и выберите папку экспорта.

## Chrome, Edge или Firefox

1. Откройте приложение и дождитесь, пока оно полностью загрузится.
2. Откройте инструменты разработчика клавишей `F12` или `Ctrl+Shift+I`.
3. Перейдите на вкладку **Network** (в Firefox — **Сеть**) и в списке ограничения скорости выберите **Offline**. Если список показывает **No throttling**, откройте его и выберите **Offline**. Оставьте инструменты разработчика открытыми.
4. В приложении нажмите кнопку загрузки экспорта и выберите папку Telegram-экспорта. Браузер попросит подтвердить выбор папки.
5. Дождитесь окончания обработки. Для подключения выберите **No throttling**.

Режим **Offline** в DevTools действует только на проверяемую вкладку. Не обновляйте ее после отключения сети: приложение уже загружено и продолжит работать, но браузер может не суметь загрузить страницу заново.

## Какая папка нужна

Выберите папку, в которой лежит один из файлов экспорта:

- `result.json` для экспорта в формате JSON;
- `messages.html` или `messages1.html` для экспорта в формате HTML.

Не перемещайте медиафайлы из экспорта: фотографии, видео и другие вложения должны оставаться в исходной структуре папок. Если в папке есть и JSON, и HTML, приложение загрузит JSON.

## Важно

Этот способ подходит, если страница приложения уже открыта и загружена в браузере. Если вы закрыли вкладку или обновили страницу без подключения к сети, сначала восстановите подключение и откройте приложение снова. Сам Telegram-экспорт при этом можно выбрать и обработать офлайн.
