interface Activity {
  startTime: number;
  endTime?: number;
  url: string;
  title: string;
}

interface TabInfo {
  activities: Array<Activity>;
}

let extensionStartTime = Date.now();

let currentActivity: Activity = null;
let currentTabId: number = null;

let tabMap:Map<string, TabInfo> = new Map();

const CHECK_INTERVAL = 2000;
const DEBUG = true;
const RECORD_THRESHOLD = 0;

let startActivity = (tabObj: chrome.tabs.Tab) => {
  if (currentActivity !== null) return;
  currentActivity = {
    startTime: Date.now(),
    url: tabObj.url,
    title: tabObj.title
  }
  if (DEBUG) console.log(currentActivity);
}

let endActivity = () => {
  if (currentActivity === null) return;
  currentActivity.endTime = Date.now();
  if (currentActivity.endTime - currentActivity.startTime > RECORD_THRESHOLD) { 
    let tabInfo: TabInfo = {
      activities: []
    };
    if (tabMap.get(currentActivity.url) === undefined) {
      tabMap.set(currentActivity.url, tabInfo);
    } else {
      tabInfo = tabMap.get(currentActivity.url);
    }
    tabInfo.activities.push(currentActivity);
  }
  if (DEBUG) console.log(currentActivity);
  currentActivity = null;
}

chrome.windows.getCurrent((windowObj) => {
  console.log(windowObj.id);
});

window.setInterval(() => {
  chrome.windows.getCurrent((windowObj) => {
    if (windowObj.focused) {
      if (currentTabId !== null) {
        chrome.tabs.get(currentTabId, (tab) => {
          if (tab !== undefined) {
            startActivity(tab);
          }
        });
      }
    } else {
      endActivity();
    }
  });
}, CHECK_INTERVAL);

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    currentTabId = tab.id;
    if (currentActivity !== null) {
      endActivity();
    }
    startActivity(tab);
  })
})