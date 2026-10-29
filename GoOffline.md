You can temporarily make a browser **offline** either for one tab or for the whole browser.

## 1. Chrome / Edge: take one tab offline

Useful for testing how a web app behaves without a connection:

1. Open the tab you want to disconnect.
2. Open Developer Tools with `F12` or `Ctrl+Shift+I` (`Cmd+Option+I` on macOS).
3. Select the Network panel.
4. In the network-throttling dropdown—usually showing “No throttling”—select Offline.
5. Keep Developer Tools open while testing. To reconnect, select No throttling again.

This simulates an offline connection for the inspected tab, rather than disconnecting your entire computer. [stackoverflow](https://stackoverflow.com/questions/16091243/does-chrome-have-a-work-offline-option)

## 2. Firefox: switch the browser to offline mode

In the menu bar, choose File → Work Offline. On Windows/Linux, press `Alt` if the menu bar is hidden. Select the same option again to reconnect. Firefox may still display previously cached pages while offline. [howtogeek](https://www.howtogeek.com/263854/how-to-enable-offline-browsing-in-firefox/)

## 3. Chrome / Edge: use a toolbar toggle

An extension such as Work Offline provides a button to toggle offline mode. Its listing describes both all-tabs and individual-tab modes. This is convenient for repeated use, but requires installing a third-party extension. [chromewebstore.google](https://chromewebstore.google.com/detail/work-offline/gcjdagaoojgeilcobhibkgbodajcojda?hl=en)

For a quick web-development test, the Network → Offline setting is the simplest starting point. [stackoverflow](https://stackoverflow.com/questions/16091243/does-chrome-have-a-work-offline-option)