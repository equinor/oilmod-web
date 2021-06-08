#### StoBreadCrumbs
Breadcrumbs is the navigation scheme that reveals the user's location on the web application.
It shows both a home icon and the path that could be an url or a command/function (e.g open a drawer, popup etc).

```html
<sto-breadcrumbs [home]="{command = () => {...}" [model]="[{label: 'Home', segment: 'home'}, {label: 'Inventory', segment: 'inventory'}]"></sto-breadcrumbs>
```

#####model
A list of items which can be a url segment { segment : 'inventory'} or a command {command: () => {}} .
```javascript
[
   {label: "IM - OPS", command: () => {...}},
   {label: "Inventory overview", segment: "overview"}
]
```

#####home
An object that can contain a url segment or a command.
```javascript
{
    command: () => {
      this.store.dispatch(new SwitchNavigationMenuAction('left'));
      this.store.dispatch(new OpenNavigationAction(true));
    }
  }
```