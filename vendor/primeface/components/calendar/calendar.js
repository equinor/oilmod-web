"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var domhandler_1 = require("../dom/domhandler");
var forms_1 = require("@angular/forms");
exports.CALENDAR_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return Calendar; }),
    multi: true
};
exports.CALENDAR_VALIDATOR = {
    provide: forms_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return Calendar; }),
    multi: true
};
var Calendar = (function () {
    function Calendar(el, domHandler, renderer, cd) {
        this.el = el;
        this.domHandler = domHandler;
        this.renderer = renderer;
        this.cd = cd;
        this.dateFormat = 'mm/dd/yy';
        this.inline = false;
        this.showOtherMonths = true;
        this.icon = 'fa-calendar';
        this.shortYearCutoff = '+10';
        this.hourFormat = '24';
        this.stepHour = 1;
        this.stepMinute = 1;
        this.stepSecond = 1;
        this.showSeconds = false;
        this.showOnFocus = true;
        this.dataType = 'date';
        this.onFocus = new core_1.EventEmitter();
        this.onBlur = new core_1.EventEmitter();
        this.onSelect = new core_1.EventEmitter();
        this._locale = {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        };
        this.closeOverlay = true;
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
        this.inputFieldValue = null;
        this._isValid = true;
    }
    Object.defineProperty(Calendar.prototype, "minDate", {
        get: function () {
            return this._minDate;
        },
        set: function (date) {
            this._minDate = date;
            this.createMonth(this.currentMonth, this.currentYear);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Calendar.prototype, "maxDate", {
        get: function () {
            return this._maxDate;
        },
        set: function (date) {
            this._maxDate = date;
            this.createMonth(this.currentMonth, this.currentYear);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Calendar.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (newLocale) {
            this._locale = newLocale;
            this.createWeekDays();
            this.createMonth(this.currentMonth, this.currentYear);
        },
        enumerable: true,
        configurable: true
    });
    Calendar.prototype.ngOnInit = function () {
        var date = this.defaultDate || new Date();
        this.createWeekDays();
        this.currentMonth = date.getMonth();
        this.currentYear = date.getFullYear();
        this.pm = date.getHours() > 11;
        if (this.showTime) {
            this.currentMinute = date.getMinutes();
            this.currentSecond = date.getSeconds();
            if (this.hourFormat == '12')
                this.currentHour = date.getHours() == 0 ? 12 : date.getHours() % 12;
            else
                this.currentHour = date.getHours();
        }
        else if (this.timeOnly) {
            this.currentMinute = 0;
            this.currentHour = 0;
            this.currentSecond = 0;
        }
        this.createMonth(this.currentMonth, this.currentYear);
        this.ticksTo1970 = (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
            Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000);
        if (this.yearNavigator && this.yearRange) {
            this.yearOptions = [];
            var years = this.yearRange.split(':'), yearStart = parseInt(years[0]), yearEnd = parseInt(years[1]);
            for (var i = yearStart; i <= yearEnd; i++) {
                this.yearOptions.push(i);
            }
        }
    };
    Calendar.prototype.ngAfterViewInit = function () {
        this.overlay = this.overlayViewChild.nativeElement;
        if (!this.inline && this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.overlay);
            else
                this.domHandler.appendChild(this.overlay, this.appendTo);
        }
    };
    Calendar.prototype.ngAfterViewChecked = function () {
        if (this.overlayShown) {
            this.alignOverlay();
            this.overlayShown = false;
        }
    };
    Calendar.prototype.createWeekDays = function () {
        this.weekDays = [];
        var dayIndex = this.locale.firstDayOfWeek;
        for (var i = 0; i < 7; i++) {
            this.weekDays.push(this.locale.dayNamesMin[dayIndex]);
            dayIndex = (dayIndex == 6) ? 0 : ++dayIndex;
        }
    };
    Calendar.prototype.createMonth = function (month, year) {
        this.dates = [];
        this.currentMonth = month;
        this.currentYear = year;
        this.currentMonthText = this.locale.monthNames[month];
        var firstDay = this.getFirstDayOfMonthIndex(month, year);
        var daysLength = this.getDaysCountInMonth(month, year);
        var prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
        var sundayIndex = this.getSundayIndex();
        var dayNo = 1;
        var today = new Date();
        for (var i = 0; i < 6; i++) {
            var week = [];
            if (i == 0) {
                for (var j = (prevMonthDaysLength - firstDay + 1); j <= prevMonthDaysLength; j++) {
                    var prev = this.getPreviousMonthAndYear(month, year);
                    week.push({ day: j, month: prev.month, year: prev.year, otherMonth: true,
                        today: this.isToday(today, j, prev.month, prev.year), selectable: this.isSelectable(j, prev.month, prev.year) });
                }
                var remainingDaysLength = 7 - week.length;
                for (var j = 0; j < remainingDaysLength; j++) {
                    week.push({ day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year),
                        selectable: this.isSelectable(dayNo, month, year) });
                    dayNo++;
                }
            }
            else {
                for (var j = 0; j < 7; j++) {
                    if (dayNo > daysLength) {
                        var next = this.getNextMonthAndYear(month, year);
                        week.push({ day: dayNo - daysLength, month: next.month, year: next.year, otherMonth: true,
                            today: this.isToday(today, dayNo - daysLength, next.month, next.year),
                            selectable: this.isSelectable((dayNo - daysLength), next.month, next.year) });
                    }
                    else {
                        week.push({ day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year),
                            selectable: this.isSelectable(dayNo, month, year) });
                    }
                    dayNo++;
                }
            }
            this.dates.push(week);
        }
    };
    Calendar.prototype.prevMonth = function (event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        else {
            this.currentMonth--;
        }
        this.createMonth(this.currentMonth, this.currentYear);
        event.preventDefault();
    };
    Calendar.prototype.nextMonth = function (event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        else {
            this.currentMonth++;
        }
        this.createMonth(this.currentMonth, this.currentYear);
        event.preventDefault();
    };
    Calendar.prototype.onDateSelect = function (event, dateMeta) {
        if (this.disabled || !dateMeta.selectable) {
            event.preventDefault();
            return;
        }
        if (dateMeta.otherMonth) {
            if (this.selectOtherMonths)
                this.selectDate(dateMeta);
        }
        else {
            this.selectDate(dateMeta);
        }
        this.dateClick = true;
        this.updateInputfield();
        event.preventDefault();
    };
    Calendar.prototype.updateInputfield = function () {
        if (this.value) {
            var formattedValue = void 0;
            if (this.timeOnly) {
                formattedValue = this.formatTime(this.value);
            }
            else {
                formattedValue = this.formatDate(this.value, this.dateFormat);
                if (this.showTime) {
                    formattedValue += ' ' + this.formatTime(this.value);
                }
            }
            this.inputFieldValue = formattedValue;
        }
        else {
            this.inputFieldValue = '';
        }
        this.updateFilledState();
    };
    Calendar.prototype.selectDate = function (dateMeta) {
        this.value = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
        if (this.showTime) {
            if (this.hourFormat === '12' && this.pm && this.currentHour != 12)
                this.value.setHours(this.currentHour + 12);
            else
                this.value.setHours(this.currentHour);
            this.value.setMinutes(this.currentMinute);
            this.value.setSeconds(this.currentSecond);
        }
        this._isValid = true;
        this.updateModel();
        this.onSelect.emit(this.value);
    };
    Calendar.prototype.updateModel = function () {
        if (this.dataType == 'date') {
            this.onModelChange(this.value);
        }
        else if (this.dataType == 'string') {
            if (this.timeOnly)
                this.onModelChange(this.formatTime(this.value));
            else
                this.onModelChange(this.formatDate(this.value, this.dateFormat));
        }
    };
    Calendar.prototype.getFirstDayOfMonthIndex = function (month, year) {
        var day = new Date();
        day.setDate(1);
        day.setMonth(month);
        day.setFullYear(year);
        var dayIndex = day.getDay() + this.getSundayIndex();
        return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
    };
    Calendar.prototype.getDaysCountInMonth = function (month, year) {
        return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
    };
    Calendar.prototype.getDaysCountInPrevMonth = function (month, year) {
        var prev = this.getPreviousMonthAndYear(month, year);
        return this.getDaysCountInMonth(prev.month, prev.year);
    };
    Calendar.prototype.getPreviousMonthAndYear = function (month, year) {
        var m, y;
        if (month === 0) {
            m = 11;
            y = year - 1;
        }
        else {
            m = month - 1;
            y = year;
        }
        return { 'month': m, 'year': y };
    };
    Calendar.prototype.getNextMonthAndYear = function (month, year) {
        var m, y;
        if (month === 11) {
            m = 0;
            y = year + 1;
        }
        else {
            m = month + 1;
            y = year;
        }
        return { 'month': m, 'year': y };
    };
    Calendar.prototype.getSundayIndex = function () {
        return this.locale.firstDayOfWeek > 0 ? 7 - this.locale.firstDayOfWeek : 0;
    };
    Calendar.prototype.isSelected = function (dateMeta) {
        if (this.value)
            return this.value.getDate() === dateMeta.day && this.value.getMonth() === dateMeta.month && this.value.getFullYear() === dateMeta.year;
        else
            return false;
    };
    Calendar.prototype.isToday = function (today, day, month, year) {
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };
    Calendar.prototype.isSelectable = function (day, month, year) {
        var validMin = true;
        var validMax = true;
        var validDate = true;
        var validDay = true;
        if (this.minDate) {
            if (this.minDate.getFullYear() > year) {
                validMin = false;
            }
            else if (this.minDate.getFullYear() === year) {
                if (this.minDate.getMonth() > month) {
                    validMin = false;
                }
                else if (this.minDate.getMonth() === month) {
                    if (this.minDate.getDate() > day) {
                        validMin = false;
                    }
                }
            }
        }
        if (this.maxDate) {
            if (this.maxDate.getFullYear() < year) {
                validMax = false;
            }
            else if (this.maxDate.getFullYear() === year) {
                if (this.maxDate.getMonth() < month) {
                    validMax = false;
                }
                else if (this.maxDate.getMonth() === month) {
                    if (this.maxDate.getDate() < day) {
                        validMax = false;
                    }
                }
            }
        }
        if (this.disabledDates) {
            validDate = !this.isDateDisabled(day, month, year);
        }
        if (this.disabledDays) {
            validDay = !this.isDayDisabled(day, month, year);
        }
        return validMin && validMax && validDate && validDay;
    };
    Calendar.prototype.isDateDisabled = function (day, month, year) {
        if (this.disabledDates) {
            for (var _i = 0, _a = this.disabledDates; _i < _a.length; _i++) {
                var disabledDate = _a[_i];
                if (disabledDate.getFullYear() === year && disabledDate.getMonth() === month && disabledDate.getDate() === day) {
                    return true;
                }
            }
        }
        return false;
    };
    Calendar.prototype.isDayDisabled = function (day, month, year) {
        if (this.disabledDays) {
            var weekday = new Date(year, month, day);
            var weekdayNumber = weekday.getDay();
            return this.disabledDays.indexOf(weekdayNumber) !== -1;
        }
        return false;
    };
    Calendar.prototype.onInputFocus = function (inputfield, event) {
        this.focus = true;
        if (this.showOnFocus) {
            this.showOverlay(inputfield);
        }
        this.onFocus.emit(event);
    };
    Calendar.prototype.onInputBlur = function (event) {
        this.focus = false;
        this.onBlur.emit(event);
        this.updateInputfield();
        this.onModelTouched();
    };
    Calendar.prototype.onButtonClick = function (event, inputfield) {
        this.closeOverlay = false;
        if (!this.overlay.offsetParent) {
            inputfield.focus();
            this.showOverlay(inputfield);
        }
        else
            this.closeOverlay = true;
    };
    Calendar.prototype.onInputKeydown = function (event) {
        if (event.keyCode === 9) {
            this.overlayVisible = false;
        }
    };
    Calendar.prototype.onMonthDropdownChange = function (m) {
        this.currentMonth = parseInt(m);
        this.createMonth(this.currentMonth, this.currentYear);
    };
    Calendar.prototype.onYearDropdownChange = function (y) {
        this.currentYear = parseInt(y);
        this.createMonth(this.currentMonth, this.currentYear);
    };
    Calendar.prototype.incrementHour = function (event) {
        var newHour = this.currentHour + this.stepHour;
        if (this.hourFormat == '24')
            this.currentHour = (newHour >= 24) ? (newHour - 24) : newHour;
        else if (this.hourFormat == '12')
            this.currentHour = (newHour >= 13) ? (newHour - 12) : newHour;
        this.updateTime();
        event.preventDefault();
    };
    Calendar.prototype.decrementHour = function (event) {
        var newHour = this.currentHour - this.stepHour;
        if (this.hourFormat == '24')
            this.currentHour = (newHour < 0) ? (24 + newHour) : newHour;
        else if (this.hourFormat == '12')
            this.currentHour = (newHour <= 0) ? (12 + newHour) : newHour;
        this.updateTime();
        event.preventDefault();
    };
    Calendar.prototype.incrementMinute = function (event) {
        var newMinute = this.currentMinute + this.stepMinute;
        this.currentMinute = (newMinute > 59) ? newMinute - 60 : newMinute;
        this.updateTime();
        event.preventDefault();
    };
    Calendar.prototype.decrementMinute = function (event) {
        var newMinute = this.currentMinute - this.stepMinute;
        this.currentMinute = (newMinute < 0) ? 60 + newMinute : newMinute;
        this.updateTime();
        event.preventDefault();
    };
    Calendar.prototype.incrementSecond = function (event) {
        var newSecond = this.currentSecond + this.stepSecond;
        this.currentSecond = (newSecond > 59) ? newSecond - 60 : newSecond;
        this.updateTime();
        event.preventDefault();
    };
    Calendar.prototype.decrementSecond = function (event) {
        var newSecond = this.currentSecond - this.stepSecond;
        this.currentSecond = (newSecond < 0) ? 60 + newSecond : newSecond;
        this.updateTime();
        event.preventDefault();
    };
    Calendar.prototype.updateTime = function () {
        this.value = this.value || new Date();
        if (this.hourFormat === '12' && this.pm && this.currentHour != 12)
            this.value.setHours(this.currentHour + 12);
        else
            this.value.setHours(this.currentHour);
        this.value.setMinutes(this.currentMinute);
        this.value.setSeconds(this.currentSecond);
        this.updateModel();
        this.onSelect.emit(this.value);
        this.updateInputfield();
    };
    Calendar.prototype.toggleAMPM = function (event) {
        this.pm = !this.pm;
        this.updateTime();
        event.preventDefault();
    };
    Calendar.prototype.onInput = function (event) {
        var val = event.target.value;
        try {
            this.value = this.parseValueFromString(val);
            this.updateUI();
            this._isValid = true;
        }
        catch (err) {
            //invalid date
            this.value = null;
            this._isValid = false;
        }
        this.updateModel();
        this.filled = val != null && val.length;
    };
    Calendar.prototype.parseValueFromString = function (text) {
        var dateValue;
        var parts = text.split(' ');
        if (this.timeOnly) {
            dateValue = new Date();
            this.populateTime(dateValue, parts[0], parts[1]);
        }
        else {
            if (this.showTime) {
                dateValue = this.parseDate(parts[0], this.dateFormat);
                this.populateTime(dateValue, parts[1], parts[2]);
            }
            else {
                dateValue = this.parseDate(text, this.dateFormat);
            }
        }
        return dateValue;
    };
    Calendar.prototype.populateTime = function (value, timeString, ampm) {
        if (this.hourFormat == '12' && !ampm) {
            throw 'Invalid Time';
        }
        this.pm = (ampm === 'PM' || ampm === 'pm');
        var time = this.parseTime(timeString);
        value.setHours(time.hour);
        value.setMinutes(time.minute);
        value.setSeconds(time.second);
    };
    Calendar.prototype.updateUI = function () {
        var val = this.value || this.defaultDate || new Date();
        this.createMonth(val.getMonth(), val.getFullYear());
        if (this.showTime || this.timeOnly) {
            var hours = val.getHours();
            if (this.hourFormat == '12') {
                if (hours >= 12) {
                    this.currentHour = (hours == 12) ? 12 : hours - 12;
                }
                else {
                    this.currentHour = (hours == 0) ? 12 : hours;
                }
            }
            else {
                this.currentHour = val.getHours();
            }
            this.currentMinute = val.getMinutes();
            this.currentSecond = val.getSeconds();
        }
    };
    Calendar.prototype.onDatePickerClick = function (event) {
        this.closeOverlay = this.dateClick;
    };
    Calendar.prototype.showOverlay = function (inputfield) {
        this.overlayVisible = true;
        this.overlayShown = true;
        this.overlay.style.zIndex = String(++domhandler_1.DomHandler.zindex);
        this.bindDocumentClickListener();
    };
    Calendar.prototype.alignOverlay = function () {
        if (this.appendTo)
            this.domHandler.absolutePosition(this.overlay, this.inputfieldViewChild.nativeElement);
        else
            this.domHandler.relativePosition(this.overlay, this.inputfieldViewChild.nativeElement);
    };
    Calendar.prototype.writeValue = function (value) {
        this.value = value;
        if (this.value && typeof this.value === 'string') {
            this.value = this.parseValueFromString(this.value);
        }
        this.updateInputfield();
        this.updateUI();
    };
    Calendar.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    Calendar.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    Calendar.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    // Ported from jquery-ui datepicker formatDate    
    Calendar.prototype.formatDate = function (date, format) {
        if (!date) {
            return "";
        }
        var iFormat, lookAhead = function (match) {
            var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
            if (matches) {
                iFormat++;
            }
            return matches;
        }, formatNumber = function (match, value, len) {
            var num = "" + value;
            if (lookAhead(match)) {
                while (num.length < len) {
                    num = "0" + num;
                }
            }
            return num;
        }, formatName = function (match, value, shortNames, longNames) {
            return (lookAhead(match) ? longNames[value] : shortNames[value]);
        }, output = "", literal = false;
        if (date) {
            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'"))
                        literal = false;
                    else
                        output += format.charAt(iFormat);
                }
                else {
                    switch (format.charAt(iFormat)) {
                        case "d":
                            output += formatNumber("d", date.getDate(), 2);
                            break;
                        case "D":
                            output += formatName("D", date.getDay(), this.locale.dayNamesShort, this.locale.dayNames);
                            break;
                        case "o":
                            output += formatNumber("o", Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                            break;
                        case "m":
                            output += formatNumber("m", date.getMonth() + 1, 2);
                            break;
                        case "M":
                            output += formatName("M", date.getMonth(), this.locale.monthNamesShort, this.locale.monthNames);
                            break;
                        case "y":
                            output += (lookAhead("y") ? date.getFullYear() :
                                (date.getFullYear() % 100 < 10 ? "0" : "") + date.getFullYear() % 100);
                            break;
                        case "@":
                            output += date.getTime();
                            break;
                        case "!":
                            output += date.getTime() * 10000 + this.ticksTo1970;
                            break;
                        case "'":
                            if (lookAhead("'"))
                                output += "'";
                            else
                                literal = true;
                            break;
                        default:
                            output += format.charAt(iFormat);
                    }
                }
            }
        }
        return output;
    };
    Calendar.prototype.formatTime = function (date) {
        if (!date) {
            return '';
        }
        var output = '';
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        if (this.hourFormat == '12' && hours > 11 && hours != 12) {
            hours -= 12;
        }
        output += (hours < 10) ? '0' + hours : hours;
        output += ':';
        output += (minutes < 10) ? '0' + minutes : minutes;
        if (this.showSeconds) {
            output += ':';
            output += (seconds < 10) ? '0' + seconds : seconds;
        }
        if (this.hourFormat == '12') {
            output += hours > 11 ? ' PM' : ' AM';
        }
        return output;
    };
    Calendar.prototype.parseTime = function (value) {
        var tokens = value.split(':');
        var validTokenLength = this.showSeconds ? 3 : 2;
        if (tokens.length !== validTokenLength) {
            throw "Invalid time";
        }
        var h = parseInt(tokens[0]);
        var m = parseInt(tokens[1]);
        var s = this.showSeconds ? parseInt(tokens[2]) : null;
        if (isNaN(h) || isNaN(m) || h > 23 || m > 59 || (this.hourFormat == '12' && h > 12) || (this.showSeconds && (isNaN(s) || s > 59))) {
            throw "Invalid time";
        }
        else {
            if (this.hourFormat == '12' && h !== 12 && this.pm) {
                h += 12;
            }
            return { hour: h, minute: m, second: s };
        }
    };
    // Ported from jquery-ui datepicker parseDate 
    Calendar.prototype.parseDate = function (value, format) {
        if (format == null || value == null) {
            throw "Invalid arguments";
        }
        value = (typeof value === "object" ? value.toString() : value + "");
        if (value === "") {
            return null;
        }
        var iFormat, dim, extra, iValue = 0, shortYearCutoff = (typeof this.shortYearCutoff !== "string" ? this.shortYearCutoff : new Date().getFullYear() % 100 + parseInt(this.shortYearCutoff, 10)), year = -1, month = -1, day = -1, doy = -1, literal = false, date, lookAhead = function (match) {
            var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
            if (matches) {
                iFormat++;
            }
            return matches;
        }, getNumber = function (match) {
            var isDoubled = lookAhead(match), size = (match === "@" ? 14 : (match === "!" ? 20 :
                (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))), minSize = (match === "y" ? size : 1), digits = new RegExp("^\\d{" + minSize + "," + size + "}"), num = value.substring(iValue).match(digits);
            if (!num) {
                throw "Missing number at position " + iValue;
            }
            iValue += num[0].length;
            return parseInt(num[0], 10);
        }, getName = function (match, shortNames, longNames) {
            var index = -1;
            var arr = lookAhead(match) ? longNames : shortNames;
            var names = [];
            for (var i = 0; i < arr.length; i++) {
                names.push([i, arr[i]]);
            }
            names.sort(function (a, b) {
                return -(a[1].length - b[1].length);
            });
            for (var i = 0; i < names.length; i++) {
                var name_1 = names[i][1];
                if (value.substr(iValue, name_1.length).toLowerCase() === name_1.toLowerCase()) {
                    index = names[i][0];
                    iValue += name_1.length;
                    break;
                }
            }
            if (index !== -1) {
                return index + 1;
            }
            else {
                throw "Unknown name at position " + iValue;
            }
        }, checkLiteral = function () {
            if (value.charAt(iValue) !== format.charAt(iFormat)) {
                throw "Unexpected literal at position " + iValue;
            }
            iValue++;
        };
        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                    literal = false;
                }
                else {
                    checkLiteral();
                }
            }
            else {
                switch (format.charAt(iFormat)) {
                    case "d":
                        day = getNumber("d");
                        break;
                    case "D":
                        getName("D", this.locale.dayNamesShort, this.locale.dayNames);
                        break;
                    case "o":
                        doy = getNumber("o");
                        break;
                    case "m":
                        month = getNumber("m");
                        break;
                    case "M":
                        month = getName("M", this.locale.monthNamesShort, this.locale.monthNames);
                        break;
                    case "y":
                        year = getNumber("y");
                        break;
                    case "@":
                        date = new Date(getNumber("@"));
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "!":
                        date = new Date((getNumber("!") - this.ticksTo1970) / 10000);
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "'":
                        if (lookAhead("'")) {
                            checkLiteral();
                        }
                        else {
                            literal = true;
                        }
                        break;
                    default:
                        checkLiteral();
                }
            }
        }
        if (iValue < value.length) {
            extra = value.substr(iValue);
            if (!/^\s+/.test(extra)) {
                throw "Extra/unparsed characters found in date: " + extra;
            }
        }
        if (year === -1) {
            year = new Date().getFullYear();
        }
        else if (year < 100) {
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= shortYearCutoff ? 0 : -100);
        }
        if (doy > -1) {
            month = 1;
            day = doy;
            do {
                dim = this.getDaysCountInMonth(year, month - 1);
                if (day <= dim) {
                    break;
                }
                month++;
                day -= dim;
            } while (true);
        }
        date = this.daylightSavingAdjust(new Date(year, month - 1, day));
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            throw "Invalid date"; // E.g. 31/02/00
        }
        return date;
    };
    Calendar.prototype.daylightSavingAdjust = function (date) {
        if (!date) {
            return null;
        }
        date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
        return date;
    };
    Calendar.prototype.updateFilledState = function () {
        this.filled = this.inputFieldValue && this.inputFieldValue != '';
    };
    Calendar.prototype.bindDocumentClickListener = function () {
        var _this = this;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listenGlobal('document', 'click', function () {
                if (_this.closeOverlay) {
                    _this.overlayVisible = false;
                }
                _this.closeOverlay = true;
                _this.dateClick = false;
                _this.cd.detectChanges();
            });
        }
    };
    Calendar.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    };
    Calendar.prototype.ngOnDestroy = function () {
        this.unbindDocumentClickListener();
        if (!this.inline && this.appendTo) {
            this.el.nativeElement.appendChild(this.overlay);
        }
    };
    Calendar.prototype.validate = function (c) {
        if (!this._isValid) {
            return { invalidDate: true };
        }
        return null;
    };
    return Calendar;
}());
__decorate([
    core_1.Input()
], Calendar.prototype, "defaultDate", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "style", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "styleClass", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "inputStyle", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "inputId", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "inputStyleClass", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "placeholder", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "disabled", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "dateFormat", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "inline", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "showOtherMonths", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "selectOtherMonths", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "showIcon", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "icon", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "appendTo", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "readonlyInput", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "shortYearCutoff", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "monthNavigator", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "yearNavigator", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "yearRange", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "showTime", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "hourFormat", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "timeOnly", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "stepHour", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "stepMinute", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "stepSecond", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "showSeconds", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "required", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "showOnFocus", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "dataType", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "disabledDates", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "disabledDays", void 0);
__decorate([
    core_1.Output()
], Calendar.prototype, "onFocus", void 0);
__decorate([
    core_1.Output()
], Calendar.prototype, "onBlur", void 0);
__decorate([
    core_1.Output()
], Calendar.prototype, "onSelect", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "tabindex", void 0);
__decorate([
    core_1.ViewChild('datepicker')
], Calendar.prototype, "overlayViewChild", void 0);
__decorate([
    core_1.ViewChild('inputfield')
], Calendar.prototype, "inputfieldViewChild", void 0);
__decorate([
    core_1.Input()
], Calendar.prototype, "minDate", null);
__decorate([
    core_1.Input()
], Calendar.prototype, "maxDate", null);
__decorate([
    core_1.Input()
], Calendar.prototype, "locale", null);
exports.Calendar = Calendar;
var CalendarModule = (function () {
    function CalendarModule() {
    }
    return CalendarModule;
}());
exports.CalendarModule = CalendarModule;
