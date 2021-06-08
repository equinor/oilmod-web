### StoAppHeader

StoAppHeader is used as a header navigation bar, and in combination with StoBreadCrumbs, also allows you to have a trail of your navigation. 

The breadcrumb trail can be limitless in length, but current practice dictates that it only be 2 segments (Application name / Application section)

##### Usage

```html
<sto-app-header [homeBreadCrumbConfig]="homeInfo"
[breadCrumbs]="[...]"
[testEnvironment]="true|false"
environmentName="Acceptance">
Other content can be placed here via projection
</sto-app-header>
```

##### Inputs
```javascript
@Input()
homeBreadCrumbConfig: {command: () => void};
```

```javascript
@Input()
breadCrumbs: Breadcrumb[];
```

```javascript
@Input()
testEnvironment: boolean; // Should the navbar display as testenvironment
```

```javascript
@Input()
environmentName: string; // Name to be displayed as the active env (e.g acceptance, Systemtest etc)
```

##### Additional values
```javascript
interface Breadcrumb {
    label: string;
    command?: Function;
    segment?: string;
}
```
