import { ExecPipe } from './exec.pipe';

describe('ExecPipe', () => {
  let pipe: ExecPipe;
  beforeEach(() => pipe = new ExecPipe());

  it('should transform a value', () => {
    const fn = (value: number) => value * 2;
    const transformed = pipe.transform(fn, 10);
    expect(transformed).toEqual(20);
  });

  it('should work if function is null', () => {
    const transformed = pipe.transform(null);
    expect(transformed).toBeNull();
  });

});
