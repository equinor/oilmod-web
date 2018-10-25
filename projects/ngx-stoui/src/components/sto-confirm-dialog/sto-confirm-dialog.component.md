#### StoConfirmDialog
 A confirm dialog that emits an observable.
 The ConfirmService is injected to a component and used from there.
 
 
 
 
```javascript
constructor(private confirmService: ConfirmService) }
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
 