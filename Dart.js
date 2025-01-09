class Dart {
  #isMoving;
  #dartElem;
  #svgElem;
  #timeout;
  #scale;
  #angle;

  constructor({ speed = 8, scale = 0.5, trailWidth = 2, pointSpacing = 2, points } = {}) {
    this.points = points ?? Dart.getPoints(pointSpacing)
    this.pointSpacing = pointSpacing
    this.trailWidth = trailWidth
    this.#isMoving = false
    this.speed = speed
    this.#scale = scale
    this.#angle = 0
  }

  set scale(n) {
    this.#scale = n
    this.reinit()
  }

  get scale() {
    return this.#scale
  }

  stop() {
    this.#isMoving = false
  }

  addToDOM() {
    // preventing duplicating elements
    for (let element of document.querySelectorAll(".graphCover, .dartWrapper")) {
      element.remove()
    }

    const graphCoverHtml = ' <rect class="graphCover" width="100%" height="100%" x="0" y="0" fill="white" />'
    document.querySelector(".uch-psvg").innerHTML += graphCoverHtml

    const dartHtml = `<svg class="dartWrapper" width="${30 * this.scale}" height="${15 * this.scale}"><g transform="translate(${-15 * this.scale} ${-7.5 * this.scale})"><g class="dart"><polygon points="${0 * this.scale},${1 * this.scale} ${4 * this.scale},${5 * this.scale} ${4 * this.scale},${10 * this.scale} ${0 * this.scale},${14 * this.scale} ${10 * this.scale},${10 * this.scale} ${10 * this.scale},${5 * this.scale}" style="fill:#0f9d58;stroke:#db4437;stroke-width:${2.5 * this.scale}" /><polygon points="${10 * this.scale},${5 * this.scale} ${5 * this.scale},${0 * this.scale} ${15 * this.scale},${0 * this.scale} ${30 * this.scale},${7.5 * this.scale} ${15 * this.scale},${15 * this.scale} ${5 * this.scale},${15 * this.scale} ${10 * this.scale},${10 * this.scale}" style="fill:#f4b400;stroke:#4285f4;stroke-width:${2.5 * this.scale}" /></g></g></svg>`
    document.querySelector(".uch-psvg").innerHTML += dartHtml

    this.#svgElem = document.querySelector(".dartWrapper")
    this.#dartElem = this.#svgElem.querySelector(".dart")
  }

  reinit() {
    this.addToDOM()
    this.points = Dart.getPoints(this.pointSpacing)
  }

  move(index) {
    if (index >= this.points.length) return
    
    if (index < this.points.length - 1) {
      this.#angle = Dart.getAngleBetweenPoints(this.points[index], this.points[index+1]) ?? this.#angle
    }
  
    this.#svgElem.setAttribute("x", this.points[index][0])
    this.#svgElem.setAttribute("y", this.points[index][1])
    this.#dartElem.setAttribute("transform", `rotate(${this.#angle} ${15 * this.scale} ${7.5 * this.scale})`)
    document.querySelector(".graphCover").setAttribute("x", this.points[index][0])
    if (this.#isMoving) {
      this.#timeout = setTimeout(() => this.move(index+1), 100/this.speed)
    }
  }

  start() {
    // reinitializing the dart if it's not in the DOM
    if (document.querySelectorAll(".graphCover, .dartWrapper").length < 2) {
      this.reinit()
    }

    const pathWithPoints = Dart.getPathWithPoints()
    pathWithPoints.setAttribute("stroke-width", this.trailWidth)
    this.#isMoving = true

    clearTimeout(this.#timeout)
    this.move(0)
  }

  static getPoints(pointSpacing) {
    const pathWithPoints = Dart.getPathWithPoints()
    const pointsString = pathWithPoints.getAttribute('d')
    // each point is in the format ['x y']
    const pointsArray = pointsString.match(/(?<=(L|M)\s)\d*.\d*\s\d*.\d*/g)

    const ogPts = []
    for(let i = 0; i < pointsArray.length; i++) {
      let [x, y] = pointsArray[i].split(' ')
      ogPts.push([Number(x), Number(y)])
    }

    // filling in empty spots in the points
    const pts = []
    for(let i = 0; i < ogPts.length-2; i++) {
      // if the distance between two points > 4, calculate the slope and add a bunch of points in there
      let x1 = ogPts[i][0]
      let y1 = ogPts[i][1]
      let x2 = ogPts[i+1][0]
      let y2 = ogPts[i+1][1]

      // if(x2 - x1 > 500) break // puntos se salen de la pantalla
      
      // adding points in between if the distance between is greater than the point spacing
      if (x2 - x1 > pointSpacing) {
        let slope = (y2 - y1) / (x2 - x1)
        // checking how many points have to be added
        let add = Math.floor((x2 - x1) / pointSpacing) - 1

        for (let j = 0; j < add; j++) {
          let newX = ogPts[i][0] + (1 * pointSpacing) * j
          let newY = ogPts[i][1] + (slope * pointSpacing) * j
          pts.push([newX, newY])
        }
      }

      pts.push(ogPts[i+1])
    }

    return pts
  }

  static getAngleBetweenPoints([x1, y1], [x2, y2]) {
    const adjacent = x2 - x1
    const opposite = y2 - y1
    const angle = Math.atan(opposite/adjacent) * (180/Math.PI)
    return isNaN(angle)? null : angle
  }

  static getPathWithPoints() {
    return document.querySelectorAll('.knowledge-finance-wholepage-chart__fw-uch path')[2]
  }
}

// d = new Dart()
// d = new Dart({ speed: 7, scale: 0.5, trailWidth: 1 })
// d.start()