---
name: component-development
description: 'Create new Angular components in the oilmod-web library. USE WHEN generating components, writing Storybook stories, or adding exports. Trigger words: new component, create component, add component, storybook story, export component.'
---

# Component Development — oilmod-web

## When to Use

- Creating a new component in any `libs/` library
- Adding a Storybook story for an existing component
- Wiring up a component's public API export

## Procedure

### 1. Generate the Component

```bash
nx generate @nx/angular:component my-component --project=<lib> --export
```

Replace `<lib>` with the target library (`core`, `common`, `datatable`, `drawer`, `form`, `popover`).

### 2. Implement with Signal-Based API

```typescript
@Component({
  selector: 'sto-my-component',
  standalone: true,
  imports: [
    /* Angular Material or other deps */
  ],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoMyComponent {
  // Required inputs
  readonly data = input.required<MyData>();

  // Optional inputs with defaults
  readonly config = input<MyConfig>({});

  // Outputs
  readonly action = output<MyEvent>();

  // Computed state
  readonly derived = computed(() => transform(this.data()));
}
```

### 3. Accessibility Checklist

All components MUST meet WCAG 2.1 AA:

- Add appropriate `role` attributes via `host`
- Bind `aria-label`, `aria-disabled` as needed
- Support keyboard navigation (`Enter`, `Space`, `Escape`)
- Ensure sufficient color contrast in styles

```typescript
@Component({
  host: {
    'role': 'button',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-disabled]': 'disabled()',
    '(keydown.enter)': 'handleKeydown($event)',
    '(keydown.space)': 'handleKeydown($event)'
  }
})
```

### 4. Create a Storybook Story

Follow the actual project pattern — `const meta` + `export default meta` + `moduleMetadata`:

```typescript
// libs/<lib>/src/lib/my-component/my-component.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { StoMyComponent } from './my-component.component';

const meta: Meta<StoMyComponent> = {
  title: '<Lib>/MyComponent',
  component: StoMyComponent,
  decorators: [
    moduleMetadata({
      imports: [StoMyComponent],
    }),
  ],
  argTypes: {
    data: { control: 'object', description: 'The data to display' },
  },
  args: {
    data: {
      /* default mock data */
    },
  },
};
export default meta;

type StoryType = StoryObj<StoMyComponent>;

export const Default: StoryType = {
  render: (args) => ({
    props: args,
    template: `<sto-my-component [data]="data" />`,
  }),
};
```

### 5. Export from Library

Add the component to the library's public API:

```typescript
// libs/<lib>/src/index.ts
export * from './lib/my-component/my-component.component';
```

### 6. Write Tests

```typescript
describe('StoMyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoMyComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StoMyComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```
