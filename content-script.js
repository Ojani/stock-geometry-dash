dart1 = new Dart({ speed: 7, scale: 0.5, trailWidth: 1 })

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    const { dartSize, dartSpeed, dartTrailWidth, startDart, getDartConfig } = request
      if (dartTrailWidth) dart1.trailWidth = dartTrailWidth
      if (dartSpeed) dart1.speed = dartSpeed
      if (dartSize) dart1.scale = dartSize
      if (startDart) dart1.start()

      if (getDartConfig) sendResponse({
        trailWidth: dart1.trailWidth,
        speed: dart1.speed,
        scale: dart1.scale,
      })
  }
);