import { ActivePreferencePipe } from './active-preference.pipe';
import { Preference } from './preference';

describe('ActivePreferencePipe', () => {
  let prefs: Preference[];

  beforeEach(() => {
    const first = new Preference('ident');
    const second = new Preference('ident');
    first.id = '1';
    second.id = '2';
    second.default = true;
    prefs = [ first, second ];
  });

  it('create an instance', () => {
    const pipe = new ActivePreferencePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the selected preference', () => {
    const pipe = new ActivePreferencePipe();
    const activeId = '1';
    expect(pipe.transform(prefs, activeId)).toBe(prefs[ 0 ]);
  });

  it('should return the default preference', () => {
    const pipe = new ActivePreferencePipe();
    expect(pipe.transform(prefs, null)).toBe(prefs[ 1 ]);
  });

  it('should return null if no id & no default preference', () => {
    const pipe = new ActivePreferencePipe();
    prefs[ 1 ].default = false;
    expect(pipe.transform(prefs, null)).toBeNull();
  });
});
