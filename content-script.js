dart1 = new Dart({ speed: 7, scale: 0.5, trailWidth: 1 })

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    const { dartSize, dartSpeed, dartTrailWidth, dartFlyOff, dartLoop, dartLoopDelay, startDart, getDartConfig } = request
      if (dartTrailWidth != undefined) dart1.trailWidth = dartTrailWidth
      if (dartLoopDelay != undefined) dart1.loopDelay = dartLoopDelay
      if (dartFlyOff != undefined) dart1.flyOff = dartFlyOff
      if (dartSpeed != undefined) dart1.speed = dartSpeed
      if (dartSize != undefined) dart1.scale = dartSize
      if (dartLoop != undefined) dart1.loop = dartLoop
      if (startDart != undefined) dart1.start()

      if (getDartConfig) sendResponse({
        trailWidth: dart1.trailWidth,
        loopDelay: dart1.loopDelay,
        flyOff: dart1.flyOff,
        speed: dart1.speed,
        scale: dart1.scale,
        loop: dart1.loop,
      })
  }
);