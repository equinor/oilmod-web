#### StoConfirmDialog
 A confirm dialog that emits an observable.
 The ConfirmService is injected to a component and used from there.
 
 
 
 
```javascript
class MyComp {
  constructor(private confirmService: ConfirmService) {}
  // component logic
}
```
Here the ConfirmService is injected to a component through the constructor.

#####confirm
The confirm method takes three arguments, the message in the dialog, a title and the text for the confirm or "OK" utton. 
 ```javascript
 this.confirmSvc.confirm(message, title, confirmText)
      .subscribe(isConfirmed => {
        if (isConfirmed) {
            //Do stuff
        }
        else {
          // Ignore
        }
      }); 
```
 
