const startBtn = document.querySelector(".startBtn");
const speedInput = document.querySelector("#speed");
const sizeInput = document.querySelector("#size");
const twInput = document.querySelector("#tw");

chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  const activeTab = tabs[0];

  // getting the initial config values for the dart
  chrome.tabs.sendMessage(activeTab.id, {getDartConfig: true})
  .then(({ trailWidth, speed, scale }) => {
    twInput.value = trailWidth
    speedInput.value = speed
    sizeInput.value = scale
  })
  
  // Setting up event listeners of inputs to configure the dart
  startBtn.addEventListener('click', (e) => chrome.tabs.sendMessage(activeTab.id, {startDart: true}))
  sizeInput.addEventListener('change', (e) => chrome.tabs.sendMessage(activeTab.id, {dartSize: e.target.value}))
  speedInput.addEventListener('change', (e) => chrome.tabs.sendMessage(activeTab.id, {dartSpeed: e.target.value}))
  twInput.addEventListener('change', (e) => chrome.tabs.sendMessage(activeTab.id, {dartTrailWidth: e.target.value}))
})