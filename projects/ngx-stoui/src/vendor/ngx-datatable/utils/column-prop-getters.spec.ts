import { deepValueGetter } from './column-prop-getters';

describe('deepValueGetter', () => {

  it('should get values one level deep', () => {
    const data = {
      a: {
        value: 123
      }
    };
    expect(deepValueGetter(data, 'a.value')).toEqual(123);
  });

  it('should get values two levels deep', () => {
    const data = {
      a: {
        b: {
          value: 'foo'
        }
      }
    };
    expect(deepValueGetter(data, 'a.b.value')).toEqual('foo');
  });

  it('should return empty string on missing nested field', () => {
    const data = {
      a: {}
    };
    expect(deepValueGetter(data, 'a.x.value')).toEqual('');
  });

  it('should return empty string on missing final field', () => {
    const data = {
      a: {}
    };
    expect(deepValueGetter(data, 'a.value')).toEqual('');
  });

  it('should return empty string on missing root field', () => {
    const data = {
      a: {}
    };
    expect(deepValueGetter(data, 'x.value')).toEqual('');
  });

  it('should check for root-level fields with dots in name', () => {
    const data = {
      'a.b.value': 5
    };
    expect(deepValueGetter(data, 'a.b.value')).toEqual(5);
  });

});
