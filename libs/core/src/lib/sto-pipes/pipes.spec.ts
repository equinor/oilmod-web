import { KeysPipe } from './keys.pipe';
import { NumberFormatPipe } from './number-format.pipe';
import { DateFormatPipe } from './date-format.pipe';

describe('KeysPipe', () => {
  let pipe: KeysPipe;
  beforeEach(() => {
    pipe = new KeysPipe();
  });

  it('should transform an object to an array', () => {
    const obj = {
      a: 1,
      b: 2
    };
    const transformed = pipe.transform(obj);
    expect(transformed instanceof Array).toBeTruthy();
  });

});

describe('NumberFormatPipe', () => {
  const value = 1234.32;
  const negValue = 0 - value;
  let pipe: NumberFormatPipe;
  beforeEach(() => {
    pipe = new NumberFormatPipe();
  });

  it('should format with 3 decimals by default', () => {
    const transformed = pipe.transform(value);
    expect(transformed).toEqual('1 234,320');
  });

  it('should append unit', () => {
    const transformed = pipe.transform(value, 'M3');
    expect(transformed).toEqual('1 234,320 M3');
  });

  it('should convert a negative number and format', () => {
    let transformed = pipe.transform(negValue, 'M3', true);
    expect(transformed).toEqual('1 234,320 M3');
    transformed = pipe.transform(value, 'M3', true);
    expect(transformed).toEqual('1 234,320 M3');
  });

  it('should remove decimals', () => {
    const transformed = pipe.transform(value, 'M3', false, false);
    expect(transformed).toEqual('1 234 M3');
  });

  it('should have dynamic decimals', () => {
    let transformed = pipe.transform(value, 'M3', false, true, 2);
    expect(transformed).toEqual('1 234,32 M3');
    transformed = pipe.transform(value, 'M3', false, true, 5);
    expect(transformed).toEqual('1 234,32000 M3');
  });

});

describe('DateFormatPipe', () => {
  const date = '2018-08-27 14:00:30';
  const dateSingleDay = '2018-08-07 14:00:30';
  let pipe: DateFormatPipe;
  beforeEach(() => pipe = new DateFormatPipe());

  it('should default to format MMM D, YYYY', () => {
    let transformed = pipe.transform(date);
    expect(transformed).toEqual('Aug 27, 2018');
    transformed = pipe.transform(dateSingleDay);
    expect(transformed).toEqual('Aug 7, 2018');
  });

  it('should have a long format (dddd MMM D, YYYY)', () => {
    const transformed = pipe.transform(date, 'long');
    expect(transformed).toEqual('Monday Aug 27, 2018');
  });

  it('should have a short format (YYYY-MM-DD)', () => {
    const transformed = pipe.transform(date, 'short');
    expect(transformed).toEqual('2018-08-27');
  });

  it('should have a datetime format (MMM D, YYYY, HH:mm)', () => {
    const transformed = pipe.transform(date, 'datetime');
    expect(transformed).toEqual('Aug 27, 2018, 14:00');
  });

  it('should have a datetimezone format (MMM D, YYYY, HH:mm:ss (UTC+HH:MM))', () => {
    const transformed = pipe.transform(date, 'datetimezone');
    const re = /Aug 27, 2018, 14:00:30 \(UTC\+\d{2}:\d{2}\)/;
    expect(transformed).toMatch(re);
  });

  it('should have a datetime-long format (dddd MMM DD, YYYY, HH:mm)', () => {
    const transformed = pipe.transform(date, 'datetime-long');
    expect(transformed).toEqual('Monday Aug 27, 2018, 14:00');
  });

  it('should have a datetime-short format (YYYY-MM-DD, HH:mm)', () => {
    const transformed = pipe.transform(date, 'datetime-short');
    expect(transformed).toEqual('2018-08-27, 14:00');
  });

});
