### Sto autocomplete
StoAutocomplete is a wrapper for angular material's autocomplete. It takes care of a lot of the grunt work required by the original one, and simplifies usage by automatically
ensuring the value set exists in the list.

#### Input
##### unfiltered
Unfiltered list of items to search for

```html
<sto-autocomplete [unfiltered]="[{id: 1, name: 'Bakken'}, {id: 2, name: 'AG123'}]">
```
##### placeholder
Text in the input field when no value.

```html
<sto-autocomplete placeholder="Choose quality">
```
##### label
Label above the input field.

```html
<sto-autocomplete label="Quality *">
```
##### displayFn
 Display function. Takes in the item, and returns a key. Example:  
 
```typescript
public displayQualityName(quality: Quality) {
  return quality ? quality.material : 'No Regrade';
}
```

```html
<sto-autocomplete [displayFn]="displayQualityName">
```
##### valueKey
ValueKey is the key that gets emitted (often the elements id).

```html
<sto-autocomplete valueKey="name">
```
##### searchForKey
SearchForKey is the key used in searches. Default: 'id', but could be 'qualityName'. 

```html
<sto-autocomplete searchForKey="name">
```
##### validationMessage
Desired validation message (optional). Default: "Invalid option selected".

```html
<sto-autocomplete validationMessage="Please choose a quality from the list">
```
##### ignoreValidation
IgnoreValidation set to true to disable validation handling. Default: false

```html
<sto-autocomplete [ignoreValidation]="true">
```
##### ignoredIds
IgnoredIds is a list of Ids that should be ignored in filter. Example is the ids that is already used.

```html
<sto-autocomplete [ignoredIds]="[1,2]">
```
##### helpText
Help/hint text below the input

```html
<sto-autocomplete helpText="E.g. UG95DK1, BAKKEN or EAGLE">
```
