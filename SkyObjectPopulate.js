$_GLOBALS = {
    clat: 0,
    slat: 0,
    tlat: 0,
    latitude: 0,
    longitude: 0,
    alt: 0,
    azi: 0,
    lst: 0,
    date: 0,
    init: function() {
        this.latitude = $.latitude;
        this.longitude = $.longitude;
        this.alt = 17.67399267;
        this.azi = 270;
        this.date = $.dateTime
    },
    computeInitParams: function() {
        this.clat = Math.cos(this.latitude * 3.141592653589793 / 180);
        this.slat = Math.sin(this.latitude * 3.141592653589793 / 180);
        this.tlat = Math.tan(this.latitude * 3.141592653589793 / 180);
        this.lst = $_GLOBALS.computeSideRealTime(this.date, this.longitude, true)
    },
    computeSideRealTime: function(a, b, c) {
        a = $_GLOBALS.getJulianDay(a, c);
        b = (15 * $_GLOBALS.getGMSR(a) - b) * 3.141592653589793 / 180;
        if (b < 0) b += 6.283185307179586;
        return b
    },
    getGMSR: function(a) {
        a -= 2451545;
        a = 0.7790572732639 + a * (1.002737909350795 + a * (8.07745E-16 + a * 1.47E-24));
        return 24 * (a - Math.round(a))
    },
    getJulianDay: function(a, b) {
        var c = a.getFullYear(),
            d = a.getMonth() + 1,
            e = a.getDate() + a.getHours() / 24 + a.getMinutes() / 1440;
        if (b) e += a.getTimezoneOffset() / 1440;
        return $_GLOBALS.calcJulianDay(c, d, e)
    },
    calcJulianDay: function(a, b, c) {
        if (b < 2.5) {
            a--;
            b += 12
        }
        var d = 0;
        if (a > 1582) {
            d = parseInt(a / 100);
            d = parseInt(2 - d + d / 4)
        }
        return Math.round(365.25 * (a + 4716)) + Math.round(30.6001 * (b + 1)) + c + d - 1524.5
    }
};
bubnick = {
    sun: null,
    moon: null,
    init: function() {
        $_GLOBALS.init();
        $_GLOBALS.computeInitParams();
        $.showConstellations = false;
        $.showBrightStars = true;
        $.showRegularStars = true;
        $.showObject = false;
        this.jd = $_GLOBALS.getJulianDay($_GLOBALS.date, true);
        this.sun = new Planet(0, this.jd);
        this.mercury = new Planet(1, this.jd);
        this.venus = new Planet(2, this.jd);
        this.moon = new Planet(3, this.jd);
        this.mars = new Planet(4, this.jd);
        this.jupiter = new Planet(5, this.jd);
        this.saturn = new Planet(6, this.jd)
    },
    initWithObjects: function() {
        $_GLOBALS.init();
        $_GLOBALS.computeInitParams();
        $.showConstellations = false;	//objects to be drawn at page load
        $.showBrightStars = true;
        $.showRegularStars = true;
        $.showObject = false;
        this.jd = $_GLOBALS.getJulianDay($_GLOBALS.date, true);
        this.sun = new Planet(0, this.jd);
        this.mercury = new Planet(1, this.jd);
        this.venus = new Planet(2, this.jd);
        this.moon = new Planet(3, this.jd);
        this.mars = new Planet(4, this.jd);
        this.jupiter = new Planet(5, this.jd);
        this.saturn = new Planet(6, this.jd);
        RegularStars.init();
        BrightStars.init();
        OtherObjects.init();
        Constellations.init()
    },
    drawSky: function(a, b) {
        this.cr2 = this.cr * 1.1;
        this.cx = b.w / 2;
        this.cy = b.h / 2;
        a.beginPath();
        a.moveTo(b.x, b.y);
        a.lineTo(b.x + b.w, b.y);
        a.lineTo(b.x + b.w, b.y + b.h);
        a.lineTo(b.x, b.y + b.h);
        a.lineTo(b.x, b.y);
        a.closePath();
        a.fillStyle = "#101010";
        a.fillRect(b.x, b.y, b.x + b.w, b.y + b.h);
        a.strokeStyle = "black";
        a.stroke();
        a.beginPath();
        a.arc(this.cx, this.cy, this.cr2, 0, 360, false);
        a.closePath();
        a.fillStyle = "#050505";
        a.fill();
        a.beginPath();
        a.arc(this.cx, this.cy, this.cr * 1.05, 0, 360, false);
        a.closePath();
        a.fillStyle = "#000";
        a.fill();
        a.fillStyle = "#f00";
        a.font = "16px sans-serif";
        a.fillText("E", this.cx - this.cr2 - 10, this.cy);
        a.fillText("N", this.cx, this.cy - this.cr2);
        a.fillText("W", this.cx + this.cr2, this.cy);
        a.fillText("S", this.cx, this.cy + this.cr2 + 15);
        this.sund = this.sun.getAltitude($_GLOBALS.slat, $_GLOBALS.clat, $_GLOBALS.lst);
        this.drawPlanets(a, this.sund, b);
        this.drawConstellations(a, b);
        this.drawBrightStars(a, b);
        this.drawRegularStars(a, b);
        this.drawOtherObj(a, b)
    },
    refreshSky: function(a, b) {
        this.cr2 = this.cr * 1.1;
        a.beginPath();
        a.moveTo(b.x, b.y);
        a.lineTo(b.x + b.w, b.y);
        a.lineTo(b.x + b.w, b.y + b.h);
        a.lineTo(b.x, b.y + b.h);
        a.lineTo(b.x, b.y);
        a.closePath();
        a.fillStyle = "#101010";
        a.fillRect(b.x, b.y, b.x + b.w, b.y + b.h);
        a.strokeStyle = "black";
        a.stroke();
        a.beginPath();
        a.arc(this.cx, this.cy, this.cr2, 0, 360, false);
        a.closePath();
        a.fillStyle = "#050505";
        a.fill();
        a.beginPath();
        a.arc(b.w / 2, b.h / 2, this.cr * 1.05, 0, 360, false);
        a.closePath();
        a.fillStyle = "#000";
        a.fill();
        a.fillStyle = "#f00";
        a.font = "16px sans-serif";
        a.fillText("E", this.cx - this.cr2 - 10, this.cy);
        a.fillText("N", this.cx, this.cy - this.cr2);
        a.fillText("W", this.cx + this.cr2, this.cy);
        a.fillText("S", this.cx, this.cy + this.cr2 + 15);
        this.drawPlanets(a, this.sund, b);
        this.drawConstellations(a, b);
        this.drawBrightStars(a, b);
        this.drawRegularStars(a, b);
        this.drawOtherObj(a, b)
    },
    drawPlanets: function(a, b, c) {
        b = new Point;
        this.project(this.sun.ra, this.sun.dec, false, b, c) && this.sun.paint(a, b, true);
        this.project(this.venus.ra, this.venus.dec, false, b, c) && this.venus.paint(a, b, true);
        this.project(this.moon.ra, this.moon.dec, false, b, c) && this.moon.paint(a, b, true);
        this.project(this.mercury.ra, this.mercury.dec, false, b, c) && this.mercury.paint(a, b, true);
        this.project(this.mars.ra, this.mars.dec, false, b, c) && this.mars.paint(a, b, true);
        this.project(this.jupiter.ra, this.jupiter.dec, false, b, c) && this.jupiter.paint(a, b, true);
        this.project(this.saturn.ra, this.saturn.dec, false, b, c) && this.saturn.paint(a, b, true)
    },
    completePlanetDrawing: function(a, b) {
        var c = new Point;
        this.project(this.moon.ra, this.moon.dec, false, c, b) && this.moon.completepaint(a, c, true)
    },
    drawPlanets1: function(a) {
        this.sun.paintFaster(a, true);
        this.venus.paintFaster(a, true);
        this.moon.paintFaster(a, true);
        this.mercury.paintFaster(a, true);
        this.mars.paintFaster(a, true);
        this.jupiter.paintFaster(a, true);
        this.saturn.paintFaster(a, true)
    },
    projectAllPlanets: function(a, b) {
        this.projectPlanet(this.sun, a, b);
        this.projectPlanet(this.venus, a, b);
        this.projectPlanet(this.moon, a, b);
        this.projectPlanet(this.mercury, a, b);
        this.projectPlanet(this.mars, a, b);
        this.projectPlanet(this.jupiter, a, b);
        this.projectPlanet(this.saturn, a, b)
    },
    projectPlanet: function(a, b, c) {
        var d = $_GLOBALS,
            e = a.ra,
            f = a.dec;
        b = d.slat * Math.sin(f) + d.clat * Math.cos(f) * Math.cos(d.lst - e);
        var g = -Math.cos(f) * Math.sin(d.lst - e);
        d = d.clat * Math.sin(f) - d.slat * Math.cos(f) * Math.cos(d.lst - e);
        e = this.cr * (Math.sqrt(1 - b * b) / (1 + b)) / Math.sqrt(g * g + d * d);
        a.projPoint.x = c.x + Math.round(this.cx + e * g);
        a.projPoint.y = c.y + Math.round(this.cy + e * -d);
        a.projPoint.x = 2 * c.x + c.w - a.projPoint.x;
        a.projVisible = b >= 0
    },
    project: function(a, b, c, d, e) {
        var f = $_GLOBALS;
        c = f.slat * Math.sin(b) + f.clat * Math.cos(b) * Math.cos(f.lst - a);
        var g = -Math.cos(b) * Math.sin(f.lst - a);
        a = f.clat * Math.sin(b) - f.slat * Math.cos(b) * Math.cos(f.lst - a);
        b = this.cr * (Math.sqrt(1 - c * c) / (1 + c)) / Math.sqrt(g * g + a * a);
        d.x = e.x + Math.round(this.cx + b * g);
        d.y = e.y + Math.round(this.cy + b * -a);
        d.x = 2 * e.x + e.w - d.x;
        return c >= 0
    },
    drawConstellations: function(a, b) {
        if ($.showConstellations) {
            var c = Constellations.arr.length;
            for (i = 0; i < c; i++) this.drawThisConstellation(i, a, b, false)
        }
    },
    drawThisConstellation: function(a, b, c) {
        b.beginPath();
        var d = new Point(0, 0),
            e = new Point(0, 0),
            f = new Point(0, 0),
            g = new Point(0, 0);
        new Point(c.w, c.h);
        new Point(0, 0);
        var j = 0;
        a = Constellations.arr[a];
        e = a.points[0];
        var k = e.brightness,
            n = a.name,
            l = this.project(e.ra, e.dec, false, d, c);
        e = d;
        d = l;
        l = a.points.length;
        var m, h;
        for (i1 = 1; i1 < l; i1++) {
            h = a.points[i1];
            m = h.brightness;
            h = this.project(h.ra, h.dec, false, f, c);
            if (d && h) {
                if (k == m) {
                    b.moveTo(e.x, e.y);
                    b.lineTo(f.x, f.y)
                }
                g.x += e.x;
                g.y += e.y;
                g.x += f.x;
                g.y += f.y;
                j += 2
            }
            e.x = f.x;
            e.y = f.y;
            d = h;
            k = m
        }
        b.strokeStyle = "rgba(255,255,255," + (k - 1) * 0.3 + ")";
        if (j > 0) if (n) {
            g.x /= j;
            g.y /= j;
            b.fillStyle = "#f2f2f2";
            b.font = "12px sans-serif";
            b.fillText(n, g.x, g.y + 10)
        }
        b.stroke()
    },
    adjust: function(a, b, c) {
        if (c.x < a.x) a.x = c.x;
        if (c.y < a.y) a.y = c.y;
        if (c.x > b.x) b.x = c.x;
        if (c.y > b.y) b.y = c.y
    },
    drawBrightStars: function(a, b) {
        if ($.showBrightStars) for (var c = new Point(0, 0), d = BrightStars.arr.length, e = 0; e < d; e++) {
            var f = BrightStars.arr[e];
            if (f != null) if (this.project(f.ra, f.dec, false, c, b)) {
                this.drawDot(a, f.magnitude, c.x, c.y);
                a.fillStyle = "rgb(132,132,132)";
                a.font = "14px sans-serif";
                a.fillText(f.label, c.x + 5, c.y + 5)
            }
        }
    },
    drawOtherObj: function(a, b) {
        if ($.showObject) {
            var c = new Point(0, 0),
                d = OtherObjects.arr.length;
            for (i = 0; i < d; i++) {
                var e = OtherObjects.arr[i];
                e != null && e.isVisible() && this.project(e.ra, e.dec, false, c, b) && e.paint(a, c)
            }
        }
    },
    drawRegularStars: function(a, b) {
        if ($.showRegularStars) {
            var c = new Point(0, 0),
                d = RegularStars.magnitudes.length;
            for (i = 0; i < d; i++) {
                var e = RegularStars.magnitudes[i];
                this.project(RegularStars.ras[i], RegularStars.decs[i], false, c, b) && this.drawDot(a, e, c.x, c.y)
            }
        }
    },
    drawDot: function(a, b, c, d) {
        a.beginPath();
        if (b >= 4.5) {
            a.arc(c, d, 0.5, 0, 360, false);
            a.closePath();
            a.fillStyle = "rgba(255,255,255,0)";
            a.fill()
        } else if (b >= 3.5) {
            a.arc(c, d, 0.75, 0, 360, false);
            a.closePath();
            a.fillStyle = "rgba(255,255,255,1)";
            a.fill()
        } else if (b >= 2.5) {
            a.arc(c, d, 1, 0, 360, false);
            a.closePath();
            a.fillStyle = "rgba(255,255,255,1)";
            a.fill()
        } else if (b >= 1.5) {
            a.arc(c, d, 1.5, 0, 360, false);
            a.closePath();
            a.fillStyle = "rgba(255,255,255,1)";
            a.fill()
        } else if (b > 0.5) bubnickImages.drawStarImages(2, a, c, d);
        else b > -0.5 ? bubnickImages.drawStarImages(1, a, c - 5, d - 5) : bubnickImages.drawStarImages(0, a, c - 8, d - 8)
    }
};
BrightStars = {
    brightStars: "",
    arr: [],
    init: function() {
        var a = 0;
        do {
            var b;
            if ((b = this.brightStars.indexOf("\n", a)) == -1) break;
            a = this.brightStars.substring(a, b);
            if (a.indexOf("xxx") == 0) break;
            this.arr.push(new BrightStar(a));
            a = b + 1
        } while (1);
        this.isInit = true
    }
};
RegularStars = {
    magnitudes: [],
    ras: [],
    decs: [],
    init: function() {
        for (i = 0; i < this.magnitudes.length; i++) {
            this.ras[i] = this.ras[i] * 15 / 57.29578;
            this.decs[i] = (90 - this.decs[i]) * 0.01745329
        }
    }
};
Constellations = {
    data: "",
    names: [],
    abbr: [],
    arr: [],
    init: function() {
        var a = 0,
            b = new Constellation;
        do {
            var c;
            if ((c = this.data.indexOf("\n", a)) == -1) break;
            a = this.data.substring(a, c);
            if (a.indexOf("xxx") == 0) break;
            if (!b.addConstellationPoint(a)) {
                this.arr.push(b);
                b = new Constellation;
                b.addConstellationPoint(a)
            }
            a = c + 1
        } while (1);
        b.points.length > 0 && this.arr.push(b);
        this.isInit = true
    }
};
OtherObjects = {
    data: "",
    arr: [],
    init: function() {
        var a = 0;
        do {
            var b;
            if ((b = this.data.indexOf("\n", a)) == -1) break;
            a = this.data.substring(a, b);
            if (a.indexOf("xxx") == 0) break;
            this.arr.push(new AstroObject(a));
            a = b + 1
        } while (1);
        this.isInit = true
    }
};
(function() {
    Planet = function(a, b) {
        this.type = a;
        this.moon_Phase = 0;
        this.initPlanetVar(b);
        this.sunPosition();
        this.normalize();
        this.slong = this.lng;
        this.sdist = this.rv;
        this.rv = this.lat = this.lng = 0;
        this.eql2equ();
        this.visualize(b);
        this.projPoint = new Point;
        this.projVisible = false
    };
    Planet.prototype = {
        visualize: function(a) {
            switch (this.type) {
            case 0:
                this.sunPosition();
                this.planet_color = "yellow";
                this.label = "Sun";
                this.imgSrc = "planets/sun.gif";
                break;
            case 1:
                this.mercuryPosition();
                this.planet_color = "#FFCC66";
                this.label = "Mercury";
                this.imgSrc = "planets/mercury.gif";
                break;
            case 2:
                this.venusPosition();
                this.planet_color = "#CCFFFF";
                this.label = "Venus";
                this.imgSrc = "planets/venus.gif";
                break;
            case 3:
                this.sdist = this.slong = 0;
                this.moonPosition();
                this.moon_Phase = this.moonPhase(a);
                this.planet_color = "#CCFFFF";
                this.label = "Moon";
                this.imgSrc = "planets/moon.gif";
                break;
            case 4:
                this.marsPosition();
                this.planet_color = "#FF9966";
                this.label = "Mars";
                this.imgSrc = "planets/mars.gif";
                break;
            case 5:
                this.jupiterPosition();
                this.planet_color = "#FFCCCC";
                this.label = "Jupiter";
                this.imgSrc = "planets/jupiter.gif";
                break;
            case 6:
                this.saturnPosition();
                this.planet_color = "#FFFF66";
                this.label = "Saturn";
                this.imgSrc = "planets/saturn.gif"
            }
            if (this.type != 0) {
                this.normalize();
                this.eql2equ()
            }
        },
        moonPhase: function(a) {
            a = (a - 2415020.7594) / 29.53058868;
            a -= parseInt(a);
            a = Math.abs(parseInt(16 * a + 0.5));
            if (a == 16) a = 0;
            return a
        },
        sunPosition: function() {
            var a = this.a8;
            this.x2 = this.a7;
            this.p = 6910 * Math.sin(a) + 72 * Math.sin(2 * a);
            this.b1 = 0;
            this.r = 1.00014 - 0.01675 * Math.cos(a)
        },
        moonPosition: function() {
            var a = this.a2,
                b = this.a3,
                c = this.a4,
                d = this.a8;
            this.x2 = this.a1;
            this.p = 22640 * Math.sin(a);
            this.p -= 4586 * Math.sin(a - 2 * c);
            this.p += 2370 * Math.sin(2 * c);
            this.p += 769 * Math.sin(2 * a);
            this.p -= 668 * Math.sin(d);
            this.p -= 412 * Math.sin(2 * b);
            this.p -= 212 * Math.sin(2 * a - 2 * c);
            this.p -= 206 * Math.sin(a - 2 * c + d);
            this.p += 192 * Math.sin(a + 2 * c);
            this.p += 165 * Math.sin(2 * c - d);
            this.p += 148 * Math.sin(a - d);
            this.p -= 125 * Math.sin(c);
            this.p -= 110 * Math.sin(a + d);
            this.b1 = 18461 * Math.sin(b);
            this.b1 += 1010 * Math.sin(a + b);
            this.b1 += 1E3 * Math.sin(a - b);
            this.b1 -= 624 * Math.sin(b - 2 * c);
            this.b1 -= 199 * Math.sin(a - b - 2 * c);
            this.b1 -= 167 * Math.sin(a + b - 2 * c);
            this.b1 += 117 * Math.sin(b + 2 * c);
            this.r = 60.36298;
            this.r -= 3.27746 * Math.cos(a);
            this.r -= 0.57994 * Math.cos(a - 2 * c);
            this.r -= 0.46357 * Math.cos(2 * c);
            this.r -= 0.08904 * Math.cos(2 * a);
            this.r += 0.03865 * Math.cos(2 * a - 2 * c);
            this.r -= 0.03237 * Math.cos(2 * c - d);
            this.r -= 0.02688 * Math.cos(a + 2 * c);
            this.r -= 0.02358 * Math.cos(a - 2 * c + d);
            this.r -= 0.0203 * Math.cos(a - d);
            this.r += 0.01719 * Math.cos(c);
            this.r += 0.01671 * Math.cos(a + d);
            this.r += 0.01247 * Math.cos(a - 2 * b);
            this.r = this.r * 6378.14 / 149597870
        },
        mercuryPosition: function() {
            var a = this.a10,
                b = this.a11;
            this.x2 = this.a9;
            this.p = 84378 * Math.sin(a) + 10733 * Math.sin(2 * a) + 1892 * Math.sin(3 * a) - 646 * Math.sin(2 * b);
            this.p += 381 * Math.sin(4 * a) - 306 * Math.sin(a - 2 * b) - 274 * Math.sin(a + 2 * b);
            this.p -= 92 * Math.sin(2 * a + 2 * b) + 83 * Math.sin(5 * a);
            this.b1 = 24134 * Math.sin(b) + 5180 * Math.sin(a - b) + 4910 * Math.sin(a + b) + 1124 * Math.sin(2 * a + b);
            this.b1 += 271 * Math.sin(3 * a + b) + 132 * Math.sin(2 * a - b);
            this.r = 0.39528 - 0.07834 * Math.cos(a) - 0.00795 * Math.cos(2 * a) - 0.00121 * Math.cos(3 * a)
        },
        venusPosition: function() {
            var a = this.a13,
                b = this.a14;
            this.x2 = this.a12;
            this.p = 2814 * Math.sin(a);
            this.p -= 181 * Math.sin(2 * b);
            this.b1 = 12215 * Math.sin(b);
            this.r = 0.72335;
            this.r -= 0.00493 * Math.cos(a)
        },
        marsPosition: function() {
            var a = this.a16,
                b = this.a17;
            this.x2 = this.a15;
            this.p = 38451 * Math.sin(a);
            this.p += 2238 * Math.sin(2 * a);
            this.b1 = 6603 * Math.sin(b);
            this.b1 += 622 * Math.sin(a - b);
            this.b1 += 615 * Math.sin(a + b);
            this.r = 1.53031;
            this.r -= 0.1417 * Math.cos(a);
            this.r -= 0.0066 * Math.cos(2 * a)
        },
        jupiterPosition: function() {
            var a = this.a19,
                b = this.a22;
            this.x2 = this.a18;
            this.z = this.t0;
            this.p = 19934 * Math.sin(a);
            this.p += 5023 * this.z;
            this.p += 2511;
            this.p += 1093 * Math.cos(2 * a - 5 * b);
            this.p += 601 * Math.sin(2 * a);
            this.p -= 479 * Math.sin(2 * a - 5 * b);
            this.b1 = -4692 * Math.cos(a);
            this.r = 5.20883;
            this.r -= 0.25122 * Math.cos(a);
            this.r -= 0.00604 * Math.cos(2 * a)
        },
        saturnPosition: function() {
            var a = this.a19,
                b = this.a22;
            this.x2 = this.a21;
            this.z = this.t0;
            this.p = 23045 * Math.sin(b);
            this.p += 5014 * this.z * Math.cos(0);
            this.p -= 2689 * Math.cos(2 * a - 5 * b);
            this.p += 2507 * Math.cos(0);
            this.p += 1177 * Math.sin(2 * a - 5 * b);
            this.p -= 826 * Math.cos(2 * a - 4 * b);
            this.p += 802 * Math.sin(2 * b);
            this.p += 425 * Math.sin(a - 2 * b);
            this.p -= 229 * this.z * Math.cos(b);
            this.p -= 153 * Math.cos(2 * a - 6 * b);
            this.p -= 142 * this.z * Math.sin(b);
            this.p -= 114 * Math.cos(b);
            this.p += 101 * this.z * Math.sin(2 * a - 5 * b);
            this.b1 = 8297 * Math.sin(b);
            this.b1 -= 3346 * Math.cos(b);
            this.b1 += 462 * Math.sin(2 * b);
            this.b1 -= 189 * Math.cos(2 * b);
            this.b1 += 189;
            this.r = 9.55774;
            this.r -= 0.53252 * Math.cos(b);
            this.r -= 0.01878 * Math.sin(2 * a - 4 * b);
            this.r -= 0.01482 * Math.cos(2 * b);
            this.r += 0.00817 * Math.sin(a - b);
            this.r -= 0.00539 * Math.cos(a - 2 * b);
            this.r -= 0.00524 * this.z * Math.sin(b)
        },
        initPlanetVar: function(a) {
            this.p2 = 6.283185307179586;
            this.dr = 0.017453292519943295;
            this.d = a - 2451545;
            this.t0 = this.d / 36525 + 1;
            this.obl = 23.452294 * this.dr;
            a = 0.606434 + 0.03660110129 * this.d;
            this.a1 = (a - Math.floor(a)) * this.p2;
            a = 0.374897 + 0.03629164709 * this.d;
            this.a2 = (a - Math.floor(a)) * this.p2;
            a = 0.259091 + 0.0367481952 * this.d;
            this.a3 = (a - Math.floor(a)) * this.p2;
            a = 0.827362 + 0.03386319198 * this.d;
            this.a4 = (a - Math.floor(a)) * this.p2;
            a = 0.347343 - 1.4709391E-4 * this.d;
            this.a5 = (a - Math.floor(a)) * this.p2;
            a = 0.779072 + 0.00273790931 * this.d;
            this.a7 = (a - Math.floor(a)) * this.p2;
            a = 0.993126 + 0.0027377785 * this.d;
            this.a8 = (a - Math.floor(a)) * this.p2;
            a = 0.700695 + 0.011367714 * this.d;
            this.a9 = (a - Math.floor(a)) * this.p2;
            a = 0.485541 + 0.01136759566 * this.d;
            this.a10 = (a - Math.floor(a)) * this.p2;
            a = 0.566441 + 0.01136762384 * this.d;
            this.a11 = (a - Math.floor(a)) * this.p2;
            a = 0.505498 + 0.00445046867 * this.d;
            this.a12 = (a - Math.floor(a)) * this.p2;
            a = 0.140023 + 0.00445036173 * this.d;
            this.a13 = (a - Math.floor(a)) * this.p2;
            a = 0.292498 + 0.00445040017 * this.d;
            this.a14 = (a - Math.floor(a)) * this.p2;
            a = 0.987353 + 0.00145575328 * this.d;
            this.a15 = (a - Math.floor(a)) * this.p2;
            a = 0.053856 + 0.00145561327 * this.d;
            this.a16 = (a - Math.floor(a)) * this.p2;
            a = 0.849694 + 0.00145569465 * this.d;
            this.a17 = (a - Math.floor(a)) * this.p2;
            a = 0.089608 + 2.3080893E-4 * this.d;
            this.a18 = (a - Math.floor(a)) * this.p2;
            a = 0.056531 + 2.3080893E-4 * this.d;
            this.a19 = (a - Math.floor(a)) * this.p2;
            a = 0.133295 + 9.294371E-5 * this.d;
            this.a21 = (a - Math.floor(a)) * this.p2;
            a = 0.882987 + 9.294371E-5 * this.d;
            this.a22 = (a - Math.floor(a)) * this.p2
        },
        normalize: function() {
            this.p = (this.p + this.x2 * 206264.8) / 3600;
            this.p -= 360 * parseInt(this.p / 360);
            if (this.p < 0) this.p += 360;
            this.b1 = this.b1 / 3600 * this.dr;
            this.p *= this.dr;
            this.lng = this.p;
            this.lat = this.b1;
            this.rv = this.r
        },
        eql2equ: function() {
            this.nv = this.rv * Math.cos(this.lat) * Math.sin(this.lng - this.slong);
            this.dv = this.rv * Math.cos(this.lat) * Math.cos(this.lng - this.slong) + this.sdist;
            this.glong = Math.atan2(this.nv, this.dv) + this.slong;
            this.delta = Math.sqrt(this.nv * this.nv + this.dv * this.dv + this.rv * this.rv * Math.sin(this.lat) * Math.sin(this.lat));
            this.sv = Math.sin(this.lat) * this.rv / this.delta;
            this.glat = Math.atan2(this.sv, Math.sqrt(1 - this.sv * this.sv));
            this.sdec = Math.sin(this.glat) * Math.cos(this.obl) + Math.cos(this.glat) * Math.sin(this.obl) * Math.sin(this.glong);
            this.nra = Math.sin(this.glong) * Math.cos(this.obl) - Math.tan(this.glat) * Math.sin(this.obl);
            this.dra = Math.cos(this.glong);
            this.ra = Math.atan2(this.nra, this.dra);
            if (this.ra < 0) this.ra += this.p2;
            if (this.ra > this.p2) this.ra -= this.p2;
            this.dec = Math.atan2(this.sdec, Math.sqrt(1 - this.sdec * this.sdec))
        },
        getAltitude: function(a, b, c) {
            return (a * Math.sin(this.dec) + b * Math.cos(this.dec) * Math.cos(c - this.ra)) * 180 / 3.141592653589793
        },
        drawPlanet: function(a, b, c, d) {
            a.beginPath();
            a.moveTo(c - 3, d - 1);
            a.lineTo(c + 3, d - 1);
            a.moveTo(c - 3, d);
            a.lineTo(c + 3, d);
            a.moveTo(c - 3, d + 1);
            a.lineTo(c + 3, d + 1);
            a.moveTo(c - 1, d - 3);
            a.lineTo(c + 1, d - 3);
            a.moveTo(c - 2, d - 2);
            a.lineTo(c + 2, d - 2);
            a.moveTo(c - 1, d + 3);
            a.lineTo(c + 1, d + 3);
            a.moveTo(c - 2, d + 2);
            a.lineTo(c + 2, d + 2);
            a.closePath();
            a.strokeStyle = b;
            a.stroke()
        },
        paint: function(a, b, c) {
            this.lastPos = b;
            if (c) {
                a.fillStyle = this.planet_color;
                a.font = "14px sans-serif";
                a.fillText(this.label, b.x + 5, b.y + 10)
            }
            if (this.type == 3) {
                c = this.moon_Phase;
                if (c < 0) c = 8;
                bubnickImages.drawMoonPhase(a, c, b.x - 4, b.y - 4)
            } else this.drawPlanet(a, this.planet_color, b.x, b.y);
            this.type != 3 && this.drawPlanet(a, this.planet_color, b.x, b.y)
        },
        completepaint: function(a, b) {
            this.lastPos = b;
            if (this.type == 3) {
                var c = this.moon_Phase;
                if (c < 0) c = 8;
                bubnickImages.drawMoonPhase(a, c, b.x - 4, b.y - 4)
            }
        },
        paintFaster: function(a, b) {
            if (this.projVisible) {
                var c = this.projPoint;
                if (b) {
                    a.fillStyle = this.planet_color;
                    a.font = "12px sans-serif";
                    a.fillText(this.label, c.x + 5, c.y + 10)
                }
                if (this.type == 3) {
                    var d = this.moon_Phase;
                    if (d < 0) d = 8;
                    bubnickImages.drawMoonPhase(a, d, c.x - 4, c.y - 4)
                } else this.drawPlanet(a, this.planet_color, c.x, c.y)
            }
        },
        toString: function() {
            return this.label
        }
    }
})();
(function() {
    BrightStar = function(a) {
        this.magnitude = parseFloat(a.substring(0, 4));
        this.ra = parseFloat(a.substring(6, 14)) * 15 / 57.2957795;
        this.dec = (90 - parseFloat(a.substring(15, 23))) * 3.141592653589793 / 180;
        this.label = new String(a.substring(37))
    }
})();
(function() {
    AstroObject = function(a) {
        this.magnitude = parseFloat(a.substring(1, 4));
        this.ra = parseFloat(a.substring(6, 14)) * 15 / 57.2957795;
        this.dec = (90 - parseFloat(a.substring(15, 23))) * 3.141592653589793 / 180;
        this.decode(a.substring(28, 29));
        if (a.substring(30, 36) != "      ") {
            var b = parseInt(a.substring(30, 32));
            b += 100;
            var c = parseInt(a.substring(32, 34));
            c--;
            var d = parseInt(a.substring(34, 36));
            this.visibleDate = new Date(b, c, d)
        }
        this.label = a.substring(37);
        this.color = "rgb(153, 204, 255)"
    };
    AstroObject.prototype = {
        decode: function(a) {
            switch (a) {
            case "S":
                this.image = "/dso-galaxy.gif";
                this.type = 0;
                break;
            case "O":
                this.image = "/dso-ocluster.gif";
                this.type = 1;
                break;
            case "G":
                this.image = "/dso-gcluster.gif";
                this.type = 2;
                break;
            case "D":
                this.image = "/dso-dnebula.gif";
                this.type = 3;
                break;
            case "P":
                this.image = "/dso-pnebula.gif";
                this.type = 4;
                break;
            case "m":
                this.image = "/meteorshower.gif";
                this.type = 5;
                break;
            case "c":
                this.image = "/comet.gif";
                this.type = 6;
                break;
            case 7:
                this.image = "/dso-nova.gif";
                this.type = 7
            }
        },
        isVisible: function() {
            if (this.visibleDate > $_GLOBALS.date || this.visibleDate < $_GLOBALS.date) return false;
            return true
        },
        paint: function(a, b) {
            a.fillStyle = this.color;
            a.font = "12px sans-serif";
            a.fillText(this.label, b.x + 6, b.y + 10)
        }
    }
})();
(function() {
    Constellation = function() {
        this.points = [];
        this.name = this.abbr = ""
    };
    Constellation.prototype = {
        addConstellationPoint: function(a) {
            var b = 0,
                c = a.substring(29, 32);
            if (this.abbr == "") for (b = 0; b < 88; b++) {
                if (c == Constellations.abbr[b]) {
                    this.abbr = c;
                    this.name = Constellations.names[b];
                    break
                }
            } else if (this.abbr != c) return false;
            this.points.push(new ConstellationPoint(a));
            return true
        }
    }
})();
(function() {
    ConstellationPoint = function(a) {
        this.ra = parseFloat(a.substring(6, 14)) * 15 / 57.2957795;
        this.dec = (90 - parseFloat(a.substring(15, 23))) * 3.141592653589793 / 180;
        this.symbol = a.substring(24, 27);
        this.brightness = parseInt(a.substring(28, 29))
    }
})();
bubnickImages = {
    starImages: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAABKklEQVR42mNgQAKhoaE8ubm5c9LS0swZ8IHY2FjumTNnXu7r6zuQkJDAgS7PCGNkZWUZrF279se5c+d+lZWVmaGoCg8PT4yIiEjNz8+f09DQcPnYsWP/7969+x/Ejo+PX5yenm4HdA4fQ3Jyct2ECRN+LViw4P/Jkyf/379////t27fBik+cOPEfKP4nOzt7CoObmxt3ZmbmpK1bt366c+fOfxC+cePG/5s3b/4HOuM30NSDAQEBCjAXMLW3t58GKbh27RoY37t37//ChQs3q6iosMPdmZGRodDV1fXrypUr/3fu3Amy8t+jR4/+r1+//gKKh5KSktR7enr+An37u6ioaGlNTc2jzZs3/wG67xADWkBzAn25FRgkfiA3BwYGCgM9kAQMiXKYGgBL06Sn16Y09QAAAABJRU5ErkJggg==", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA0UlEQVR42mNgQAI5OTmFqampVgw4AOP06dOvLFiw4AyKqI+PD1dSUpJlQUFB2pYtW/7duHHjX2xsbF5gYKAOWEF8fPyczs7Of2vWrPn/4MGD//fu3fsPVPR/9erV/4qKitYwhIaG8rS0tCy5cOHC/9u3b/+/efPm/1OnTv2rrKw8Hx4ergY2JSMjI3Pv3r3/r1+/DtYNsgZosh3cHUA3TDl8+PD/WbNmPVm0aNGvixcv/gdq8oErqK6uzpk0adKSgIAABaCVunV1dRs8PDwUQHIAkOFrKLD5wzwAAAAASUVORK5CYII=", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAmklEQVR42mNgAAIHBweWjo6OmZMmTXJhgIHo6GitpKQk9aVLl57ctWvX8eDgYNXQ0FBmhsrKymXTpk17cPHixZ", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAASUlEQVR42mNgAILu7u7EyZMnO4DYDKWlpZ3bt2+/cerUqVu9vb2lIAGv8+fP/7969eq//Px8H4acnBynJUuWrFy6dOnWuLg4aQDn9iBUguOG8gAAAABJRU5ErkJggg=="],
    planetImages: [],
    moonPhases: ["data:image/gif;base64,R0lGODlhCgAKAID/AMDAwGZmZiH5BAEAAAAALAAAAAAKAAoAAAIQhINhl82NAJy0Wijpw8uZAgA7", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwISEhIODg3V1dXFxcW1tbWlpaWZmZl5eXltbW1lZWUpKSgAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAKAAoAAAQdEMhDk5w0m4UzJYAnDqInlFmAUkNYFp2nXO6BXBEAOw==", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwP///+Pj49XV1cHBwaqqqoeHh4ODg3Z2dnV1dW5ubmZmZgAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAKAAoAAAQgEMhFlZw0o4EzJYDnHYGYJaW5IKlpBKFZdJkiXPFiSREAOw==", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwP////b29uzs7Ojo6OTk5MTExMHBwb29vbe3t7Ozs3V1dXFxcWdnZ2ZmZgAAACH5BAEAAAAALAAAAAAKAAoAAAQkEEjnGpKT0hVI1s4QAKBmBEFJJajqKK16oGRZjLXGBAKWJ5gIADs=", "data:image/gif;base64,R0lGODlhCgAKAJH/AMDAwP///9XV1WZmZiH5BAEAAAAALAAAAAAKAAoAAAIYhDcSdpgBG1LRTQjtw5pm6y0gJm0LczEFADs=", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwP////r6+vHx8ejo6KioqJ+fn5aWlpKSkoCAgHx8fGpqamZmZmRkZFJSUgAAACH5BAEAAAAALAAAAAAKAAoAAAQnEEh3gpCSNTaCJxmjeCTAnAhJnoyheqz7sulrMol9LwJ5YY6CBxMBADs=", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwP////b29uzs7OTk5OHh4bCwsKCgoG5ubmlpaWdnZ2ZmZgAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAKAAoAAAQfEMgSqpRr1B3k4RuwEOCWlJuCVguFAsYLIEJ5AZolRQA7", "data:image/gif;base64,R0lGODlhCgAKAID/AMDAwP///yH5BAEAAAAALAAAAAAKAAoAAAIQhINhl82NAJy0Wijpw8uZAgA7", "data:image/gif;base64,R0lGODlhCgAKAID/AMDAwP///yH5BAEAAAAALAAAAAAKAAoAAAIQhINhl82NAJy0Wijpw8uZAgA7", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwP////r6+vHx8enp6ejo6NLS0rOzs7CwsI+Pj4eHh4CAgGZmZgAAAAAAAAAAACH5BAEAAAAALAAAAAAKAAoAAAQdEMhAjZw0C4YzJYAnKqKHlNmBUklYDp23XG5QXBEAOw==", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwP////b29uzs7OTk5OHh4bCwsKCgoG5ubmlpaWdnZ2ZmZgAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAKAAoAAAQfEMhAi5w0j4UzPYDnEYvoJWampEHBpUaXCcgVUsMVAQA7", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwP////r6+vHx8aioqKCgoJ2dnZaWlpKSkoCAgHx8fGpqamdnZ2ZmZmRkZAAAACH5BAEAAAAALAAAAAAKAAoAAAQiEMhAj5yUDuZwDkoDfBnSNCRlnGlQsKkppok4fsJie8QVAQA7", "data:image/gif;base64,R0lGODlhCgAKAKL/AMDAwP////Hx8ezs7NXV1WZmZgAAAAAAACH5BAEAAAAALAAAAAAKAAoAAAMcCCpUpYqE0NwDk9qX9e6VBW7FuGFTeA3pCXlQAgA7", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwP////b29uzs7Ojo6OTk5MTExMHBwb29vbe3t7Ozs3V1dXFxcWdnZ2ZmZgAAACH5BAEAAAAALAAAAAAKAAoAAAQkEEjUnJOShGW7DEPnBYEhdmRyWqSyOuTxAkGxSkLAnBigWpgIADs=", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwP///+Pj49XV1cHBwaqqqoeHh4ODg3Z2dnV1dW9vb25ubmZmZgAAAAAAAAAAACH5BAEAAAAALAAAAAAKAAoAAAQgEMjFqpQD1c0k4RsQHOAWJGUVaGlgpF2RSgIFXoASShEAOw==", "data:image/gif;base64,R0lGODlhCgAKALP/AMDAwISEhIODg3V1dXR0dHFxcW1tbWlpaWdnZ2ZmZl5eXltbW1lZWUpKSgAAAAAAACH5BAEAAAAALAAAAAAKAAoAAAQeEMiVqpTt1J1k4RtAgJxAbsFZDWpnnBKDkBeghFIEADs="],
    otherObjImages: ["data:image/gif;base64,R0lGODlhCAALAMQUAG2VzGySx1l5poe2/FBrkUtliEVbeE5oi0BUcVh2oVJwlnqm5VJvllRxmmeLvUZdfHei31p6p1JulWqQxf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABQALAAAAAAIAAsAAAUfICWO5PiUhyCRxQQQI+IMkzEq0NKQSRCVjFVpSCyKQgA7", "data:image/gif;base64,R0lGODlhBwAHAIABAP///////yH5BAEAAAEALAAAAAAHAAcAAAILTGB5htm8lFNPmgIAOw==", "data:image/gif;base64,R0lGODlhCQAJAMQdAE90pUlsmkBkjmCMwVuEuFqCtliCtHiq6SxJa0htmjVUe2OPxTJReDRSeD5giitIanuw72SQxj5giHWn5UFjj050pC1KbixJbX6w8TVVe1uFujhYfzxehv///wAAAAAAACH5BAEAAB0ALAAAAAAJAAkAAAUmYCeOZGdxTkMiAaFVyrgZE7RQcnFgkTA+Cc0AkCFdOBJGackchQAAOw==", "data:image/gif;base64,R0lGODlhCQAJALMMAGS0AFmgAHDKAJD/BV6oAI//A3XSAIv6AGzCAI7/AGW2AJL/Cf///wAAAAAAAAAAACH5BAEAAAwALAAAAAAJAAkAAAQakMlJJRCVqTQM3ctSeBJxhIlCmQWSBW4mzxEAOw==", "data:image/gif;base64,R0lGODlhBwAHAIABAJL6C////yH5BAEAAAEALAAAAAAHAAcAAAIMTABmeavNXJsrPlUAADs=", "data:image/gif;base64,R0lGODlhCAAIAKIFAPv9/vf7/W94e6a0ud3v9v///wAAAAAAACH5BAEAAAUALAAAAAAIAAgAAAMYWLoUBUQNEuko4kqxOtbFwE0VoTVFEHkJADs=", "data:image/gif;base64,R0lGODlhCQAJAIABAP///////yH5BAEAAAEALAAAAAAJAAkAAAINjI+AC7rR2otTvotxAQA7", "data:image/gif;base64,R0lGODlhBwAHAJECABt39wAAAP///wAAACH5BAEAAAIALAAAAAAHAAcAAAIOlI8QKHoA4QpB0bfQFQUAOw=="],
    drawPlanetImages: function() {},
    drawStarImages: function(a, b, c, d) {
        var e = new Image;
        e.onload = function() {
            b.drawImage(e, c, d)
        };
        e.src = this.starImages[a]
    },
    drawMoonPhase: function(a, b, c, d) {
        var e = new Image;
        e.onload = function() {
            a.drawImage(e, c, d)
        };
        e.src = this.moonPhases[b]
    }
};
(function() {
    Point = function(a, b) {
        this.x = a ? a : 0;
        this.y = b ? b : 0
    };
    Rectangle = function() {
        this.h = this.w = this.y = this.x = 0
    };
    Date.prototype.getJulian = function() {
        return Math.floor(this / 864E5 - this.getTimezoneOffset() / 1440 + 2440587.5)
    }
})();
(function() {
    Array.prototype.forEach2 = function(a, b) {
        var c = this.length;
        if (typeof a != "function") throw new TypeError;
        for (var d = 1; d < c; d++) d in this && a.call(b, this[d], d, this)
    }
})();
