(function() {
    $.Browser = function() {
        IE = !! (window.attachEvent && !window.opera);
        Opera = !! window.opera;
        WebKit = navigator.userAgent.indexOf("AppleWebKit/") > -1;
        Gecko = navigator.userAgent.indexOf("Gecko") > -1 && navigator.userAgent.indexOf("KHTML") == -1;
        MobileSafari = !! navigator.userAgent.match(/Apple.*Mobile.*Safari/)
    };
    $.bind = function(a, b) {
        return function() {
            b.apply(a, arguments)
        }
    };
    $.remove = function(a) {
        a.parentNode.removeChild(a);
        return a
    };
    $.setOpacity = function(a, b) {
        a.style.opacity = b == 1 || b === "" ? "" : b < 1.0E-5 ? 0 : b;
        return a
    };
    $.setStyle = function(a, b) {
        var c = a.style;
        if (Object.isString(b)) {
            a.style.cssText += ";" + b;
            return b.include("opacity") ? $.setOpacity(a, b.match(/opacity:\s*(\d?\.?\d*)/)[1]) : a
        }
        for (var d in b) if (d == "opacity") $.setOpacity(a, b[d]);
        else c[d == "float" || d == "cssFloat" ? Object.isUndefined(c.styleFloat) ? "cssFloat" : "styleFloat" : d] = b[d];
        return a
    };
    $.addClassName = function(a, b) {
        $.hasClassName(a, b) || (a.className += (a.className ? " " : "") + b);
        return a
    };
    $.removeClassName = function(a, b) {
        if (a) {
            a.className = a.className.replace(RegExp("(^|\\s+)" + b + "(\\s+|$)"), " ").strip();
            return a
        }
    };
    $.hasClassName = function(a, b) {
        var c = a.className;
        return c.length > 0 && (c == b || RegExp("(^|\\s)" + b + "(\\s|$)").test(c))
    };
    $.positionedOffset = function(a) {
        var b = 0,
            c = 0;
        do {
            b += a.offsetTop || 0;
            c += a.offsetLeft || 0;
            if (a = a.offsetParent) {
                if (a.tagName == "BODY") break;
                if ($.getStyle(a, "position") !== "static") break
            }
        } while (a);
        return $._returnOffset(c, b)
    };
    $._returnOffset = function(a, b) {
        var c = [a, b];
        c.left = a;
        c.top = b;
        return c
    };
    $.getStyle = function(a, b) {
        b = b == "float" ? "cssFloat" : b.camelize();
        var c = a.style[b];
        if (!c) c = (c = document.defaultView.getComputedStyle(a, null)) ? c[b] : null;
        if (b == "opacity") return c ? parseFloat(c) : 1;
        return c == "auto" ? null : c
    };
    Object.extend = function(a, b) {
        for (var c in b) a[c] = b[c];
        return a
    };
    $.getDimensions = function(a) {
        var b = $.getStyle(a, "display");
        if (b != "none" && b != null) return {
            width: a.offsetWidth,
            height: a.offsetHeight
        };
        b = a.style;
        var c = b.visibility,
            d = b.position,
            g = b.display;
        b.visibility = "hidden";
        b.position = "absolute";
        b.display = "block";
        var f = a.clientWidth;
        a = a.clientHeight;
        b.display = g;
        b.position = d;
        b.visibility = c;
        return {
            width: f,
            height: a
        }
    };
    emptyFunction = function() {};
    K = function(a) {
        return a
    }
})();
Object.extend(Object, {
    toJSON: function(a) {
        switch (typeof a) {
        case "undefined":
        case "function":
        case "unknown":
            return;
        case "boolean":
            return a.toString()
        }
        if (a === null) return "null";
        if (a.toJSON) return a.toJSON();
        if (!Object.isElement(a)) {
            var b = [],
                c;
            for (c in a) {
                var d = Object.toJSON(a[c]);
                Object.isUndefined(d) || b.push(c.toJSON() + ": " + d)
            }
            return "{" + b.join(", ") + "}"
        }
    },
    isFunction: function(a) {
        return typeof a == "function"
    },
    isString: function(a) {
        return typeof a == "string"
    },
    isNumber: function(a) {
        return typeof a == "number"
    },
    isUndefined: function(a) {
        return typeof a == "undefined"
    }
});
var $break = {},
    Enumerable = {
        each: function(a, b) {
            var c = 0;
            a = a.bind(b);
            try {
                this._each(function(g) {
                    a(g, c++)
                })
            } catch (d) {
                if (d != $break) throw d;
            }
            return this
        },
        eachSlice: function(a, b, c) {
            b = b ? b.bind(c) : $.K;
            for (var d = -a, g = [], f = this.toArray();
            (d += a) < f.length;) g.push(f.slice(d, d + a));
            return g.collect(b, c)
        },
        all: function(a, b) {
            a = a ? a.bind(b) : $.K;
            var c = true;
            this.each(function(d, g) {
                c = c && !! a(d, g);
                if (!c) throw $break;
            });
            return c
        },
        any: function(a, b) {
            a = a ? a.bind(b) : $.K;
            var c = false;
            this.each(function(d, g) {
                if (c = !! a(d, g)) throw $break;
            });
            return c
        },
        collect: function(a, b) {
            a = a ? a.bind(b) : $.K;
            var c = [];
            this.each(function(d, g) {
                c.push(a(d, g))
            });
            return c
        },
        detect: function(a, b) {
            a = a.bind(b);
            var c;
            this.each(function(d, g) {
                if (a(d, g)) {
                    c = d;
                    throw $break;
                }
            });
            return c
        },
        findAll: function(a, b) {
            a = a.bind(b);
            var c = [];
            this.each(function(d, g) {
                a(d, g) && c.push(d)
            });
            return c
        },
        grep: function(a, b, c) {
            b = b ? b.bind(c) : $.K;
            var d = [];
            if (Object.isString(a)) a = RegExp(a);
            this.each(function(g, f) {
                a.match(g) && d.push(b(g, f))
            });
            return d
        },
        include: function(a) {
            if (Object.isFunction(this.indexOf)) if (this.indexOf(a) != -1) return true;
            var b = false;
            this.each(function(c) {
                if (c == a) {
                    b = true;
                    throw $break;
                }
            });
            return b
        },
        inGroupsOf: function(a, b) {
            b = Object.isUndefined(b) ? null : b;
            return this.eachSlice(a, function(c) {
                for (; c.length < a;) c.push(b);
                return c
            })
        },
        inject: function(a, b, c) {
            b = b.bind(c);
            this.each(function(d, g) {
                a = b(a, d, g)
            });
            return a
        },
        invoke: function(a) {
            var b = $A(arguments).slice(1);
            return this.map(function(c) {
                return c[a].apply(c, b)
            })
        },
        max: function(a, b) {
            a = a ? a.bind(b) : $.K;
            var c;
            this.each(function(d, g) {
                d = a(d, g);
                if (c == null || d >= c) c = d
            });
            return c
        },
        min: function(a, b) {
            a = a ? a.bind(b) : $.K;
            var c;
            this.each(function(d, g) {
                d = a(d, g);
                if (c == null || d < c) c = d
            });
            return c
        },
        partition: function(a, b) {
            a = a ? a.bind(b) : $.K;
            var c = [],
                d = [];
            this.each(function(g, f) {
                (a(g, f) ? c : d).push(g)
            });
            return [c, d]
        },
        pluck: function(a) {
            var b = [];
            this.each(function(c) {
                b.push(c[a])
            });
            return b
        },
        reject: function(a, b) {
            a = a.bind(b);
            var c = [];
            this.each(function(d, g) {
                a(d, g) || c.push(d)
            });
            return c
        },
        toArray: function() {
            return this.map()
        },
        zip: function() {
            var a = $.K,
                b = $A(arguments);
            if (Object.isFunction(b.last())) a = b.pop();
            var c = [this].concat(b).map($A);
            return this.map(function(d, g) {
                return a(c.pluck(g))
            })
        },
        size: function() {
            return this.toArray().length
        },
        inspect: function() {
            return "#<Enumerable:" + this.toArray().inspect() + ">"
        }
    };
Object.extend(Enumerable, {
    map: Enumerable.collect,
    find: Enumerable.detect,
    select: Enumerable.findAll,
    filter: Enumerable.findAll,
    member: Enumerable.include,
    entries: Enumerable.toArray,
    every: Enumerable.all,
    some: Enumerable.any
});

function $A(a) {
    if (!a) return [];
    if (a.toArray) return a.toArray();
    for (var b = a.length || 0, c = Array(b); b--;) c[b] = a[b];
    return c
}
if ($.Browser.WebKit) $A = function(a) {
    if (!a) return [];
    if (!(Object.isFunction(a) && a == "[object NodeList]") && a.toArray) return a.toArray();
    for (var b = a.length || 0, c = Array(b); b--;) c[b] = a[b];
    return c
};
Array.from = $A;
Object.extend(Array.prototype, Enumerable);
if (!Array.prototype._reverse) Array.prototype._reverse = Array.prototype.reverse;
Object.extend(Array.prototype, {
    _each: function(a) {
        for (var b = 0, c = this.length; b < c; b++) a(this[b])
    },
    clear: function() {
        this.length = 0;
        return this
    },
    first: function() {
        return this[0]
    },
    last: function() {
        return this[this.length - 1]
    },
    compact: function() {
        return this.select(function(a) {
            return a != null
        })
    },
    flatten: function() {
        return this.inject([], function(a, b) {
            return a.concat(Object.isArray(b) ? b.flatten() : [b])
        })
    },
    without: function() {
        var a = $A(arguments);
        return this.select(function(b) {
            return !a.include(b)
        })
    },
    reverse: function(a) {
        return (a !== false ? this : this.toArray())._reverse()
    },
    reduce: function() {
        return this.length > 1 ? this : this[0]
    },
    uniq: function(a) {
        return this.inject([], function(b, c, d) {
            if (0 == d || (a ? b.last() != c : !b.include(c))) b.push(c);
            return b
        })
    },
    intersect: function(a) {
        return this.uniq().findAll(function(b) {
            return a.detect(function(c) {
                return b === c
            })
        })
    },
    clone: function() {
        return [].concat(this)
    },
    size: function() {
        return this.length
    },
    inspect: function() {
        return "[" + this.map(Object.inspect).join(", ") + "]"
    },
    toJSON: function() {
        var a = [];
        this.each(function(b) {
            b = Object.toJSON(b);
            Object.isUndefined(b) || a.push(b)
        });
        return "[" + a.join(", ") + "]"
    }
});
if (Object.isFunction(Array.prototype.forEach)) Array.prototype._each = Array.prototype.forEach;
if (!Array.prototype.indexOf) Array.prototype.indexOf = function(a, b) {
    b || (b = 0);
    var c = this.length;
    if (b < 0) b = c + b;
    for (; b < c; b++) if (this[b] === a) return b;
    return -1
};
if (!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf = function(a, b) {
    b = isNaN(b) ? this.length : (b < 0 ? this.length + b : b) + 1;
    var c = this.slice(0, b).reverse().indexOf(a);
    return c < 0 ? c : b - c - 1
};
Array.prototype.toArray = Array.prototype.clone;
function $w(a) {
    if (!Object.isString(a)) return [];
    return (a = a.strip()) ? a.split(/\s+/) : []
}
if ($.Browser.Opera) Array.prototype.concat = function() {
    for (var a = [], b = 0, c = this.length; b < c; b++) a.push(this[b]);
    b = 0;
    for (c = arguments.length; b < c; b++) if (Object.isArray(arguments[b])) for (var d = 0, g = arguments[b].length; d < g; d++) a.push(arguments[b][d]);
    else a.push(arguments[b]);
    return a
};
Object.extend(Function.prototype, {
    argumentNames: function() {
        var a = this.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",").invoke("strip");
        return a.length == 1 && !a[0] ? [] : a
    },
    bind: function() {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
        var a = this,
            b = $A(arguments),
            c = b.shift();
        return function() {
            return a.apply(c, b.concat($A(arguments)))
        }
    },
    bindAsEventListener: function() {
        var a = this,
            b = $A(arguments),
            c = b.shift();
        return function(d) {
            return a.apply(c, [d || window.event].concat(b))
        }
    },
    curry: function() {
        if (!arguments.length) return this;
        var a = this,
            b = $A(arguments);
        return function() {
            return a.apply(this, b.concat($A(arguments)))
        }
    },
    delay: function() {
        var a = this,
            b = $A(arguments),
            c = b.shift() * 1E3;
        return window.setTimeout(function() {
            return a.apply(a, b)
        }, c)
    },
    wrap: function(a) {
        var b = this;
        return function() {
            return a.apply(this, [b.bind(this)].concat($A(arguments)))
        }
    },
    methodize: function() {
        if (this._methodized) return this._methodized;
        var a = this;
        return this._methodized = function() {
            return a.apply(null, [this].concat($A(arguments)))
        }
    }
});

function $A(a) {
    if (!a) return [];
    if (a.toArray) return a.toArray();
    for (var b = a.length || 0, c = Array(b); b--;) c[b] = a[b];
    return c
}
if ($.Browser.WebKit) $A = function(a) {
    if (!a) return [];
    if (!(Object.isFunction(a) && a == "[object NodeList]") && a.toArray) return a.toArray();
    for (var b = a.length || 0, c = Array(b); b--;) c[b] = a[b];
    return c
};
Array.from = $A;
Object.extend(String.prototype, {
    strip: function() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    },
    include: function(a) {
        return this.indexOf(a) > -1
    },
    camelize: function() {
        var a = this.split("-"),
            b = a.length;
        if (b == 1) return a[0];
        for (var c = this.charAt(0) == "-" ? a[0].charAt(0).toUpperCase() + a[0].substring(1) : a[0], d = 1; d < b; d++) c += a[d].charAt(0).toUpperCase() + a[d].substring(1);
        return c
    }
});
(function() {
    DateTimePicker = function(a, b) {
        this.element = $(a);
        this.selectCallback = b;
        this.options = {
            icon: "images/calendar.png",
            timePicker: true,
            timePickerAdjacent: true,
            datePicker: true,
            dateTimeFormat: "MM-dd-yyyy HH:mm",
            dateFormat: "MM-dd-yyyy",
            firstWeekDay: 0,
            weekend: [0, 6],
            timeFormat: "HH:mm",
            language: "en"
        };
        this.handlers = {
            onClick: this.options.onClick,
            onHover: this.options.onHover,
            onSelect: this.options.onSelect
        };
        this.options = Object.extend(this.options || {}, {
            onClick: $.bind(this, this.pickerClicked),
            onHover: $.bind(this, this.dateHover),
            onSelect: $.bind(this, this.datePicked)
        });
        this.options.currentFormat = this.options.dateTimeFormat;
        this.options.date = DateFormat.parseFormat(this.element.value, this.options.currentFormat);
        this.hideTimeout = this.originalValue = this.datepicker = null;
        if (this.options.icon) {
            this.element.style.background = "url(" + this.options.icon + ") right center no-repeat transparent";
            this.element.style.paddingRight = "37px";
            this.element.style.paddingLeft = "15px";
            this.element.style.width = "220px";
            this.element.style.paddingBottom = "0"
        }
        this.element.addEventListener("click", $.bind(this, this.togglePicker), false);
        this.hidePickerListener = this.delayedHide;
        this.element.addEventListener("keydown", $.bind(this, this.keyHandler), false);
        document.addEventListener("keydown", $.bind(this, this.docKeyHandler), false);
        this.pickerActive = false
    };
    DateTimePicker.prototype = {
        _self: this,
        activePicker: null,
        tr: function(a) {
            return a
        },
        delayedHide: function() {
            this.hideTimeout = setTimeout("this.hide", 100)
        },
        pickerClicked: function() {
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null
            }
            if (this.handlers.onClick) this.handlers.onClick()
        },
        datePicked: function(a) {
            this.selectCallback(a);
            this.element.focus();
            this.hide();
            if (this.handlers.onSelect) this.handlers.onSelect(a);
            if (this.element.onchange) this.element.onchange()
        },
        dateHover: function(a) {
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null
            }
            if (this.pickerActive) {
                this.element.value = DateFormat.format(a, this.options.currentFormat);
                if (this.handlers.onHover) this.handlers.onHover(a)
            }
        },
        togglePicker: function() {
            if (this.pickerActive) {
                this.element.value = this.originalValue;
                this.hide()
            } else this.show();
            return false
        },
        docKeyHandler: function(a) {
            if (a.keyCode == Event.KEY_ESC) if (this.pickerActive) {
                this.element.value = this.originalValue;
                this.hide()
            }
        },
        keyHandler: function(a) {
            switch (a.keyCode) {
            case Event.KEY_ESC:
                if (this.pickerActive) this.element.value = this.originalValue;
            case Event.KEY_TAB:
                this.hide();
                return;
            case Event.KEY_DOWN:
                if (!this.pickerActive) {
                    this.show();
                    Event.stop(a)
                }
            }
            if (this.pickerActive) return false
        },
        hide: function() {
            if (this.pickerActive && !this.element.disabled) {
                this.datepicker.releaseKeys();
                $.remove(this.datepicker.element);
                document.removeEventListener("click", $.bind(this, this.delayedHide), false);
                this.pickerActive = false;
                DateTimePicker.activePicker = null
            }
        },
        scrollOffset: function(a) {
            var b = 0,
                c = 0;
            do {
                if (a.tagName == "BODY") break;
                b += a.scrollTop || 0;
                c += a.scrollLeft || 0;
                a = a.parentNode
            } while (a);
            return $._returnOffset(c, b)
        },
        show: function() {
            if (!this.pickerActive) {
                DateTimePicker.activePicker && DateTimePicker.activePicker.hide();
                this.element.focus();
                if (!this.datepicker) this.datepicker = new DateTimePickerPanel(this.options);
                this.originalValue = this.element.value;
                $.positionedOffset(this.element);
                $.getDimensions(this.element);
                /MSIE/.test(navigator.userAgent);
                this.datepicker.element.style.position = "absolute";
                this.datepicker.element.style.bottom = "90px";
                this.datepicker.element.style.left = "23px";
                this.datepicker.element.style.right = "0";
                this.datepicker.element.style.zIndex = "99";
                this.datepicker.selectDate(DateFormat.parseFormat(this.element.value, this.options.currentFormat));
                this.datepicker.captureKeys();
                this.element.parentNode.appendChild(this.datepicker.element);
                document.addEventListener("click", $.bind(this, this.delayedHide), false);
                this.pickerActive = true;
                DateTimePicker.activePicker = this;
                this.pickerClicked()
            }
        }
    }
})();
DateTimePicker.Locale = {};
with(DateTimePicker) Locale.en = {
    dateTimeFormat: "MM-dd-yyyy HH:mm",
    dateFormat: "MM-dd-yyyy",
    firstWeekDay: 0,
    weekend: [0, 6],
    timeFormat: "HH:mm",
    language: "en"
};
(function() {
    DateTimePickerPanel = function(a) {
        this.options = Object.extend({
            className: "datepickerControl",
            closeOnToday: true,
            selectToday: true,
            showOnFocus: false,
            datePicker: true,
            timePicker: false,
            use24hrs: false,
            firstWeekDay: 0,
            weekend: [0, 6],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
        }, a || {});
        with(this.options) if (isNaN(firstWeekDay * 1)) firstWeekDay = 0;
        else firstWeekDay %= 7;
        this.keysCaptured = false;
        this.calendarCont = null;
        this.currentDate = this.options.date ? this.options.date : new Date;
        this.dayOfWeek = 0;
        this.minInterval = 5;
        this.selectedAmPm = this.selectedMinute = this.selectedHour = this.selectedDay = null;
        this.currentDays = [];
        this.hourCells = [];
        this.minuteCells = [];
        this.pmCell = this.amCell = this.otherMinutes = null;
        this.element = this.createPicker();
        this.selectDate(this.currentDate);
        this.scope = this
    };
    DateTimePickerPanel.prototype = {
        createPicker: function() {
            var a = document.createElement("div");
            a.style.position = "absolute";
            a.className = this.options.className;
            this.calendarCont = this.drawCalendar(a, this.currentDate);
            a.addEventListener("click", $.bind(this, this.clickHandler), false);
            a.ondblclick = this.dblClickHandler;
            this.documentKeyListener = this.keyHandler;
            this.options.captureKeys && this.captureKeys();
            return a
        },
        tr: function(a) {
            return a
        },
        captureKeys: function() {
            document.keydown = this.documentKeyListener;
            this.keysCaptured = true
        },
        releaseKeys: function() {
            document.removeEventListener("keydown", $.bind(this, this.documentKeyListener), true);
            this.keysCaptured = false
        },
        setDate: function(a) {
            if (a) {
                for (; this.element.firstChild;) this.element.removeChild(this.element.firstChild);
                this.calendarCont = this.drawCalendar(this.element, a)
            }
        },
        drawCalendar: function(a, b) {
            var c = a;
            if (this.options.datePicker) d = this.createCalendar(b);
            else {
                var d = document.createElement("table");
                d.cellSpacing = 0;
                d.cellPadding = 0;
                d.border = 0
            }
            var g = this.options.use24hrs ? 6 : 7;
            if (this.options.timePicker) {
                var f;
                if (this.options.timePickerAdjacent && this.options.datePicker) {
                    var i = 0,
                        e = document.createElement("table");
                    e.cellSpacing = 0;
                    e.cellPadding = 0;
                    e.border = 0;
                    row = e.insertRow(0);
                    cell = row.insertCell(0);
                    cell.vAlign = "top";
                    cell.appendChild(d);
                    c = cell;
                    cell = row.insertCell(1);
                    cell.style.width = "5px";
                    cell = row.insertCell(2);
                    cell.vAlign = "top";
                    f = document.createElement("table");
                    f.cellSpacing = 0;
                    f.cellPadding = 0;
                    f.border = 0;
                    cell.appendChild(f);
                    a.appendChild(e);
                    row = f.insertRow(i++);
                    row.className = "monthLabel";
                    cell = row.insertCell(0);
                    cell.colSpan = g;
                    cell.innerHTML = this.tr("Time");
                    row = f.insertRow(i++);
                    cell = row.insertCell(0);
                    cell.colSpan = g;
                    cell.style.height = "1px"
                } else {
                    a.appendChild(d);
                    f = d;
                    i = d.rows.length;
                    if (this.options.datePicker) {
                        row = f.insertRow(i++);
                        cell = row.insertCell(0);
                        cell.colSpan = g;
                        d = document.createElement("hr");
                        $.setStyle(d, {
                            color: "gray",
                            backgroundColor: "gray",
                            height: "1px",
                            border: "0",
                            marginTop: "3px",
                            marginBottom: "3px",
                            padding: "0"
                        });
                        cell.appendChild(d)
                    }
                }
                var k = this.options.use24hrs ? 4 : 2;
                for (d = 0; d < k; ++d) {
                    row = f.insertRow(i++);
                    for (e = 0; e < 6; ++e) {
                        cell = row.insertCell(e);
                        cell.className = "hour";
                        cell.width = "14%";
                        cell.innerHTML = d * 6 + e + (this.options.use24hrs ? 0 : 1);
                        cell.onclick = this.hourClickedListener(d * 6 + e + (this.options.use24hrs ? 0 : 1));
                        this.hourCells[d * 6 + e] = cell
                    }
                    if (!this.options.use24hrs) {
                        cell = row.insertCell(e);
                        cell.className = "ampm";
                        cell.width = "14%";
                        if (d) {
                            cell.innerHTML = this.tr("PM");
                            cell.onclick = this.pmClickedListener();
                            this.pmCell = cell
                        } else {
                            cell.innerHTML = this.tr("AM");
                            cell.onclick = this.amClickedListener();
                            this.amCell = cell
                        }
                    }
                }
                row = f.insertRow(i++);
                cell = row.insertCell(0);
                cell.colSpan = 6;
                d = document.createElement("hr");
                $.setStyle(d, {
                    color: "#CCCCCC",
                    backgroundColor: "#CCCCCC",
                    height: "1px",
                    border: "0",
                    marginTop: "2px",
                    marginBottom: "2px",
                    padding: "0"
                });
                cell.appendChild(d);
                cell = row.insertCell(1);
                for (d = 0; d < 10 / this.minInterval; ++d) {
                    row = f.insertRow(i++);
                    for (e = 0; e < 6; ++e) {
                        cell = row.insertCell(e);
                        cell.className = "minute";
                        cell.width = "14%";
                        k = (d * 6 + e) * this.minInterval;
                        if (k < 10) k = "0" + k;
                        cell.innerHTML = ":" + k;
                        cell.onclick = this.minuteClickedListener(k);
                        this.minuteCells[d * 6 + e] = cell
                    }
                    if (!this.options.use24hrs) {
                        cell = row.insertCell(e);
                        cell.width = "14%"
                    }
                }
                cell = row.insertCell(6);
                cell.className = "otherminute";
                var j = document.createElement("input");
                j.type = "text";
                j.maxLength = 2;
                j.style.width = "2em";
                var l = null;
                j.onkeyup = function() {
                    isNaN(j.value) || (l = setTimeout(function() {
                        this.currentDate.setMinutes(j.value);
                        this.dateChanged(this.currentDate)
                    }.bind(this), 500))
                }.bindAsEventListener(this);
                j.onkeydown = function(h) {
                    if (h.keyCode == Event.KEY_RETURN) if (this.options.onSelect) this.options.onSelect(this.currentDate);
                    l && clearTimeout(l)
                }.bindAsEventListener(this);
                j.onclick = j.select;
                j.onfocus = this.releaseKeys.bindAsEventListener(this);
                j.onblur = this.captureKeys.bindAsEventListener(this);
                this.otherMinutes = j;
                cell.appendChild(j);
                row = f.insertRow(i++);
                cell = row.insertCell(0);
                cell.colSpan = g;
                d = document.createElement("hr");
                $.setStyle(d, {
                    color: "gray",
                    backgroundColor: "gray",
                    height: "1px",
                    border: "0",
                    marginTop: "3px",
                    marginBottom: "3px",
                    padding: "0"
                });
                cell.appendChild(d);
                row = f.insertRow(i++);
                cell = row.insertCell(0);
                cell.colSpan = g;
                selectButton = document.createElement("input");
                selectButton.type = "button";
                selectButton.value = this.tr("OK");
                selectButton.onclick = $.bind(this, function() {
                    this.options.onSelect && this.options.onSelect(this.currentDate)
                });
                cell.appendChild(selectButton)
            } else c.appendChild(d);
            return c
        },
        createCalendar: function(a) {
            this.currentDate = a;
            this.currentDays = [];
            var b = new Date,
                c = new Date(a.getFullYear() - 1, a.getMonth(), 1),
                d = new Date(a.getFullYear(), a.getMonth() - 1, 1),
                g = new Date(a.getFullYear(), a.getMonth() + 1, 1),
                f = new Date(a.getFullYear() + 1, a.getMonth(), 1),
                i, e, k = 0,
                j = document.createElement("table");
            j.cellSpacing = 0;
            j.cellPadding = 0;
            j.border = 0;
            i = j.insertRow(k++);
            i.className = "monthLabel";
            e = i.insertCell(0);
            e.colSpan = 7;
            e.innerHTML = this.monthName(a.getMonth()) + " " + a.getFullYear();
            i = j.insertRow(k++);
            i.className = "navigation";
            e = i.insertCell(0);
            e.className = "navbutton";
            e.title = this.monthName(c.getMonth()) + " " + c.getFullYear();
            e.onclick = this.movePreviousYearListener();
            e.innerHTML = "&lt;&lt;";
            e = i.insertCell(1);
            e.className = "navbutton";
            e.title = this.monthName(d.getMonth()) + " " + d.getFullYear();
            e.onclick = this.movePreviousMonthListener();
            e.innerHTML = "&lt;";
            e = i.insertCell(2);
            e.colSpan = 3;
            e.className = "navbutton";
            e.title = b.getDate() + " " + this.monthName(b.getMonth()) + " " + b.getFullYear();
            e.onclick = this.dateClickedListener(b, true);
            e.innerHTML = this.options.timePicker ? this.tr("Now") : this.tr("Today");
            e = i.insertCell(3);
            e.className = "navbutton";
            e.title = this.monthName(g.getMonth()) + " " + g.getFullYear();
            e.onclick = this.moveNextMonthListener();
            e.innerHTML = "&gt;";
            e = i.insertCell(4);
            e.className = "navbutton";
            e.title = this.monthName(f.getMonth()) + " " + f.getFullYear();
            e.onclick = this.moveNextYearListener();
            e.innerHTML = "&gt;&gt;";
            i = j.insertRow(k++);
            i.className = "dayLabel";
            for (b = 0; b < 7; ++b) {
                e = i.insertCell(b);
                e.width = "14%";
                e.innerHTML = this.dayName((this.options.firstWeekDay + b) % 7)
            }
            i = null;
            b = new Date(a.getFullYear(), a.getMonth(), 1);
            e = b.getDay();
            if (e != this.options.firstWeekDay) {
                i = j.insertRow(k++);
                i.className = "calendarRow";
                b.setDate(b.getDate() - (e - this.options.firstWeekDay + 7) % 7);
                for (e = b.getDay(); b.getMonth() != a.getMonth();) {
                    e = i.insertCell(i.cells.length);
                    this.assignDayClasses(e, "dayothermonth", b);
                    e.innerHTML = b.getDate();
                    e.onclick = this.dateClickedListener(b);
                    b.setDate(b.getDate() + 1);
                    e = b.getDay()
                }
            }
            for (; b.getMonth() == a.getMonth();) {
                if (e == this.options.firstWeekDay) {
                    i = j.insertRow(k++);
                    i.className = "calendarRow"
                }
                e = i.insertCell(i.cells.length);
                this.assignDayClasses(e, "day", b);
                e.innerHTML = b.getDate();
                e.onclick = this.dateClickedListener(b);
                this.currentDays[b.getDate()] = e;
                b.setDate(b.getDate() + 1);
                e = b.getDay()
            }
            if (e != this.options.firstWeekDay) {
                do {
                    e = i.insertCell(i.cells.length);
                    this.assignDayClasses(e, "dayothermonth", b);
                    e.innerHTML = b.getDate();
                    b.getTime();
                    e.onclick = this.dateClickedListener(b);
                    b.setDate(b.getDate() + 1);
                    b.getDay()
                } while (b.getDay() != this.options.firstWeekDay)
            }
            return j
        },
        movePreviousMonthListener: function() {
            return $.bind(this, function() {
                var a = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, this.currentDate.getDate(), this.currentDate.getHours(), this.currentDate.getMinutes());
                a.getMonth() != (this.currentDate.getMonth() + 11) % 12 && a.setDate(0);
                this.selectDate(a)
            })
        },
        moveNextMonthListener: function() {
            return $.bind(this, function() {
                var a = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate(), this.currentDate.getHours(), this.currentDate.getMinutes());
                a.getMonth() != (this.currentDate.getMonth() + 1) % 12 && a.setDate(0);
                this.selectDate(a)
            })
        },
        moveNextYearListener: function() {
            return $.bind(this, function() {
                var a = new Date(this.currentDate.getFullYear() + 1, this.currentDate.getMonth(), this.currentDate.getDate(), this.currentDate.getHours(), this.currentDate.getMinutes());
                a.getMonth() != this.currentDate.getMonth() && a.setDate(0);
                this.selectDate(a)
            })
        },
        movePreviousYearListener: function() {
            return $.bind(this, function() {
                var a = new Date(this.currentDate.getFullYear() - 1, this.currentDate.getMonth(), this.currentDate.getDate(), this.currentDate.getHours(), this.currentDate.getMinutes());
                a.getMonth() != this.currentDate.getMonth() && a.setDate(0);
                this.selectDate(a)
            })
        },
        dateClickedListener: function(a, b) {
            var c = new Date(a.getTime());
            return $.bind(this, function() {
                if (!b) {
                    c.setHours(this.currentDate.getHours());
                    c.setMinutes(this.currentDate.getMinutes())
                }
                this.dateClicked(c)
            })
        },
        hourClickedListener: function(a) {
            return $.bind(this, function() {
                this.hourClicked(a)
            })
        },
        minuteClickedListener: function(a) {
            return $.bind(this, function() {
                this.currentDate.setMinutes(a);
                this.dateClicked(this.currentDate)
            })
        },
        amClickedListener: function() {
            return $.bind(this, function() {
                if (this.selectedAmPm == this.pmCell) {
                    this.currentDate.setHours(this.currentDate.getHours() - 12);
                    this.dateClicked(this.currentDate)
                }
            })
        },
        pmClickedListener: function() {
            return $.bind(this, function() {
                if (this.selectedAmPm == this.amCell) {
                    this.currentDate.setHours(this.currentDate.getHours() + 12);
                    this.dateClicked(this.currentDate)
                }
            })
        },
        assignDayClasses: function(a, b, c) {
            var d = new Date;
            $.addClassName(a, b);
            c.getFullYear() == d.getFullYear() && c.getMonth() == d.getMonth() && c.getDate() == d.getDate() && $.addClassName(a, "today");
            this.options.weekend.include(c.getDay()) && $.addClassName(a, "weekend")
        },
        monthName: function(a) {
            return this.options.months[a]
        },
        dayName: function(a) {
            return this.options.days[a]
        },
        dblClickHandler: function() {
            if (this.options.onSelect) this.options.onSelect(this.currentDate)
        },
        clickHandler: function() {
            if (this.options.onClick) this.options.onClick()
        },
        hoverHandler: function() {
            if (this.options.onHover) this.options.onHover(date)
        },
        keyHandler: function(a) {
            var b = 0;
            switch (a.keyCode) {
            case Event.KEY_RETURN:
                if (this.options.onSelect) this.options.onSelect(this.currentDate);
                break;
            case Event.KEY_LEFT:
                b = -1;
                break;
            case Event.KEY_UP:
                b = -7;
                break;
            case Event.KEY_RIGHT:
                b = 1;
                break;
            case Event.KEY_DOWN:
                b = 7;
                break;
            case 33:
                b = -this.getDaysOfMonth(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, this.currentDate.getDate()));
                break;
            case 34:
                b = this.getDaysOfMonth(this.currentDate);
                break;
            case 13:
                this.dateClicked(this.currentDate);
                break;
            default:
                return
            }
            if (b != 0) {
                b = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + b);
                b.setHours(this.currentDate.getHours());
                b.setMinutes(this.currentDate.getMinutes());
                this.selectDate(b)
            }
            Event.stop(a);
            return false
        },
        getDaysOfMonth: function(a) {
            return (new Date(a.getFullYear(), a.getMonth() + 1, 0)).getDate()
        },
        getNextMonth: function(a, b) {
            return p_Month == 11 ? [0, b + 1] : [a + 1, b]
        },
        getPrevMonth: function(a, b) {
            return p_Month == 0 ? [11, b - 1] : [a - 1, b]
        },
        dateClicked: function(a) {
            if (a) {
                if (!this.options.timePicker && this.options.onSelect) this.options.onSelect(a);
                this.selectDate(a)
            }
        },
        dateChanged: function(a) {
            if (a) {
                if ((!this.options.timePicker || !this.options.datePicker) && this.options.onHover) this.options.onHover(a);
                this.selectDate(a)
            }
        },
        hourClicked: function(a) {
            if (!this.options.use24hrs) if (a == 12) {
                if (this.selectedAmPm == this.amCell) a = 0
            } else if (this.selectedAmPm == this.pmCell) a += 12;
            this.currentDate.setHours(a);
            this.dateClicked(this.currentDate)
        },
        selectDate: function(a) {
            if (a) {
                if (this.options.datePicker) {
                    if (a.getMonth() != this.currentDate.getMonth() || a.getFullYear() != this.currentDate.getFullYear()) this.setDate(a);
                    else this.currentDate = a;
                    if (a.getDate() < this.currentDays.length) {
                        this.selectedDay && $.removeClassName(this.selectedDay, "current");
                        this.selectedDay = this.currentDays[a.getDate()];
                        $.addClassName(this.selectedDay, "current")
                    }
                }
                if (this.options.timePicker) {
                    var b = a.getHours();
                    this.selectedHour && $.removeClassName(this.selectedHour, "current");
                    this.selectedHour = this.options.use24hrs ? this.hourCells[b] : this.hourCells[b % 12 ? b % 12 - 1 : 11];
                    $.addClassName(this.selectedHour, "current");
                    this.selectedAmPm && $.removeClassName(this.selectedAmPm, "current");
                    this.selectedAmPm = b < 12 ? this.amCell : this.pmCell;
                    $.addClassName(this.selectedAmPm, "current");
                    b = a.getMinutes();
                    this.selectedMinute && $.removeClassName(this.selectedMinute, "current");
                    $.removeClassName(this.otherMinutes, "current");
                    if (b % this.minInterval == 0) {
                        this.otherMinutes.value = "";
                        this.selectedMinute = this.minuteCells[b / this.minInterval];
                        $.addClassName(this.selectedMinute, "current")
                    } else {
                        this.otherMinutes.value = b;
                        $.addClassName(this.otherMinutes, "current")
                    }
                }
                if (this.options.onHover) this.options.onHover(a)
            }
        }
    }
})();
DateFormat = {
    MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    DAY_NAMES: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    LZ: function(a) {
        return (a < 0 || a > 9 ? "" : "0") + a
    },
    compareDates: function(a, b, c, d) {
        a = DateFormat.parseFormat(a, b);
        c = DateFormat.parseFormat(c, d);
        if (a == 0 || c == 0) return -1;
        else if (a > c) return 1;
        return 0
    },
    format: function(a, b) {
        b += "";
        var c = "",
            d = 0,
            g = "",
            f = "";
        g = a.getYear() + "";
        f = a.getMonth() + 1;
        var i = a.getDate(),
            e = a.getDay(),
            k = a.getHours(),
            j = a.getMinutes(),
            l = a.getSeconds(),
            h = {};
        if (g.length < 4) g = "" + (g - 0 + 1900);
        h.y = "" + g;
        h.yyyy = g;
        h.yy = g.substring(2, 4);
        h.M = f;
        h.MM = DateFormat.LZ(f);
        h.MMM = DateFormat.MONTH_NAMES[f - 1];
        h.NNN = DateFormat.MONTH_NAMES[f + 11];
        h.d = i;
        h.dd = DateFormat.LZ(i);
        h.E = DateFormat.DAY_NAMES[e + 7];
        h.EE = DateFormat.DAY_NAMES[e];
        h.H = k;
        h.HH = DateFormat.LZ(k);
        h.h = k == 0 ? 12 : k > 12 ? k - 12 : k;
        h.hh = DateFormat.LZ(h.h);
        h.K = k > 11 ? k - 12 : k;
        h.k = k + 1;
        h.KK = DateFormat.LZ(h.K);
        h.kk = DateFormat.LZ(h.k);
        h.a = k > 11 ? "PM" : "AM";
        h.m = j;
        h.mm = DateFormat.LZ(j);
        h.s = l;
        for (h.ss = DateFormat.LZ(l); d < b.length;) {
            g = b.charAt(d);
            for (f = ""; b.charAt(d) == g && d < b.length;) f += b.charAt(d++);
            c += h[f] != null ? h[f] : f
        }
        return c
    },
    _isInteger: function(a) {
        for (var b = 0; b < a.length; b++) if ("1234567890".indexOf(a.charAt(b)) == -1) return false;
        return true
    },
    _getInt: function(a, b, c, d) {
        for (; d >= c; d--) {
            var g = a.substring(b, b + d);
            if (g.length < c) break;
            if (DateFormat._isInteger(g)) return g
        }
        return null
    },
    parseFormat: function(a, b) {
        a += "";
        b += "";
        var c = 0,
            d = 0,
            g = "",
            f = "",
            i, e = new Date,
            k = e.getYear(),
            j = e.getMonth() + 1,
            l = 1,
            h = e.getHours(),
            m = e.getMinutes();
        e = e.getSeconds();
        for (var n = ""; d < b.length;) {
            g = b.charAt(d);
            for (f = ""; b.charAt(d) == g && d < b.length;) f += b.charAt(d++);
            if (f == "yyyy" || f == "yy" || f == "y") {
                if (f == "yyyy") i = 4;
                if (f == "yy") i = 2;
                if (f == "y") i = 2;
                k = DateFormat._getInt(a, c, i, 4);
                if (k == null) return 0;
                c += k.length;
                if (k.length == 2) k = k > 70 ? 1900 + (k - 0) : 2E3 + (k - 0)
            } else if (f == "MMM" || f == "NNN") {
                for (g = j = 0; g < DateFormat.MONTH_NAMES.length; g++) {
                    var o = DateFormat.MONTH_NAMES[g];
                    if (a.substring(c, c + o.length).toLowerCase() == o.toLowerCase()) if (f == "MMM" || f == "NNN" && g > 11) {
                        j = g + 1;
                        if (j > 12) j -= 12;
                        c += o.length;
                        break
                    }
                }
                if (j < 1 || j > 12) return 0
            } else if (f == "EE" || f == "E") for (g = 0; g < DateFormat.DAY_NAMES.length; g++) {
                f = DateFormat.DAY_NAMES[g];
                if (a.substring(c, c + f.length).toLowerCase() == f.toLowerCase()) {
                    c += f.length;
                    break
                }
            } else if (f == "MM" || f == "M") {
                j = DateFormat._getInt(a, c, f.length, 2);
                if (j == null || j < 1 || j > 12) return 0;
                c += j.length
            } else if (f == "dd" || f == "d") {
                l = DateFormat._getInt(a, c, f.length, 2);
                if (l == null || l < 1 || l > 31) return 0;
                c += l.length
            } else if (f == "hh" || f == "h") {
                h = DateFormat._getInt(a, c, f.length, 2);
                if (h == null || h < 1 || h > 12) return 0;
                c += h.length
            } else if (f == "HH" || f == "H") {
                h = DateFormat._getInt(a, c, f.length, 2);
                if (h == null || h < 0 || h > 23) return 0;
                c += h.length
            } else if (f == "KK" || f == "K") {
                h = DateFormat._getInt(a, c, f.length, 2);
                if (h == null || h < 0 || h > 11) return 0;
                c += h.length
            } else if (f == "kk" || f == "k") {
                h = DateFormat._getInt(a, c, f.length, 2);
                if (h == null || h < 1 || h > 24) return 0;
                c += h.length;
                h--
            } else if (f == "mm" || f == "m") {
                m = DateFormat._getInt(a, c, f.length, 2);
                if (m == null || m < 0 || m > 59) return 0;
                c += m.length
            } else if (f == "ss" || f == "s") {
                e = DateFormat._getInt(a, c, f.length, 2);
                if (e == null || e < 0 || e > 59) return 0;
                c += e.length
            } else if (f == "a") {
                if (a.substring(c, c + 2).toLowerCase() == "am") n = "AM";
                else if (a.substring(c, c + 2).toLowerCase() == "pm") n = "PM";
                else return 0;
                c += 2
            } else if (a.substring(c, c + f.length) != f) return 0;
            else c += f.length
        }
        if (c != a.length) return 0;
        if (j == 2) if (k % 4 == 0 && k % 100 != 0 || k % 400 == 0) {
            if (l > 29) return 0
        } else if (l > 28) return 0;
        if (j == 4 || j == 6 || j == 9 || j == 11) if (l > 30) return 0;
        if (h < 12 && n == "PM") h = h - 0 + 12;
        else if (h > 11 && n == "AM") h -= 12;
        return new Date(k, j - 1, l, h, m, e)
    },
    parse: function(a, b) {
        if (b) return DateFormat.parseFormat(a, b);
        else {
            var c = arguments.length == 2 ? arguments[1] : false,
                d = ["M/d/y", "M-d-y", "M.d.y", "MMM-d", "M/d", "M-d"],
                g = ["d/M/y", "d-M-y", "d.M.y", "d-MMM", "d/M", "d-M"];
            c = [
                ["y-M-d", "MMM d, y", "MMM d,y", "y-MMM-d", "d-MMM-y", "MMM d"], c ? g : d, c ? d : g];
            d = null;
            for (g = 0; g < c.length; g++) for (var f = c[g], i = 0; i < f.length; i++) {
                d = DateFormat.parseFormat(a, f[i]);
                if (d != 0) return new Date(d)
            }
            return null
        }
    }
};
DateFormat.prototype = {
    initialize: function(a) {
        this.format = a
    },
    parse: function(a) {
        return DateFormat.parseFormat(a, this.format)
    },
    format: function(a) {
        return DateFormat.format(a, this.format)
    }
};
Date.prototype.format = function(a) {
    return DateFormat.format(this, a)
};
