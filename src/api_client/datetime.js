/* Helper functions for datetimes, to configure which time to show,
   convert them to formats, etc.
  */

export class DateTime {
  /*
  Our DateTime class.

  The format for configuring a datetime to show is as follows:

  For absolute times:

  {
    type: "absolute",
    date: new Date()  // For a single time
  }

  An argument that is a Date or a timestamp gets converted to an absolute time.

  For relative times:

  {
    type: "relative",
    to: "now",  // or "start" or "end" (of a timeseries)
    offset: // Number of seconds for a single time
    modulo: // Optional, for relative to now only.
      // Current time is rounded down to a multiple of this many seconds.
  }

  If "to" isn't given, it's to now; if offset isn't given, it's 0.

  If only a string "absolute" is given, it's absolute now (doesn't change after). If
  "relative" is given, it's relative now (keeps moving).

  If a DateTime instance is given, create a copy.
  */

  constructor(date = 'absolute') {
    if (date === 'absolute') {
      date = {type: 'absolute'};
    } else if (date === 'relative') {
      date = {type: 'relative'};
    } else if (date instanceof Date) {
      date = {type: 'absolute', date: date};
    } else if (typeof date === DateTime) {
      date = date.asObject();
    } else if (typeof date === 'number' || typeof date === 'string') {
      date = {type: 'absolute', date: new Date(date)};
    }

    this.type = date.type;
    this.date = null;
    this.to = null;
    this.offset = null;
    this.modulo = date.modulo || null;

    if (this.type === 'absolute') {
      this.date = date.date || new Date();
    } else {
      // Relative
      this.to = date.to || 'now';
      this.offset = date.offset || 0;
    }
  }

  makeAbsolute(now) {
    // Make sure that the returned datetime is absolute. Only works
    // for already absolute times, and times relative to 'now'.

    if (this.type === 'absolute') {
      return this;
    }

    if (this.type === 'relative' && this.to === 'now') {
      let base = new Date(now);

      if (this.modulo) {
        let ms = base.getTime();

        ms -= (ms % (this.modulo * 1000));
        base = new Date(ms);
      }

      return {
        type: 'absolute',
        date: new Date(base.getTime() + (this.offset || 0) * 1000)
      };
    }

    throw new Error(
      'makeAbsolute() only works with datetimes relative to now.');
  }

  asDate(start, end) {
    // Needs to be passed the start and end of a timeseries, in case
    // time can be relative to that.
    if (this.type === 'absolute') {
      return this.date;
    }
    if (this.type === 'relative') {
      let base;

      if (this.to === 'now') {
        base = new Date();
        if (this.modulo) {
          let ms = base.getTime();

          ms -= (ms % (this.modulo * 1000));
          base = new Date(ms);
        }
      } else if (this.to === 'start') {
        base = new DateTime(start).asDate();
      } else if (this.to === 'end') {
        base = new DateTime(end).asDate();
      } else {
        return null;
      }
      return new Date(base.getTime() + (this.offset || 0) * 1000);
    }
    return null;
  }

  // Convert to various formats
  asObject() {
    // To make copies
    return {
      type: this.type,
      date: this.date,
      to: this.to,
      offset: this.offset
    };
  }

  asWmsTimeParam(start, end) {
    const d = this.asDate(start, end);
    let utcTime = d.toISOString();

    // String now has '.000Z' at the end, not sure if that is OK -- but it seems to work
    // after removing my hacks that removed it.
    return utcTime;
  }

  asTimestamp(start, end) {
    return this.asDate(start, end).getTime();
  }

  needsStartEnd() {
    // If this datetime is relative to a start or end, then they need to be passed. If not,
    // then it's OK to not compute them and just pass in null.
    return this.type === 'relative' && (
      this.to === 'start' || this.to === 'end');
  }
}
