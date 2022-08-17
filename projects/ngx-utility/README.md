# ngx-utility

- [ngx-utility](#ngx-utility)
	- [DOM](#dom)
		- [renderMarkup](#rendermarkup)
	- [Forms](#forms)
		- [FormConnector](#formconnector)
		- [connectControlWithParent](#connectcontrolwithparent)
		- [Form types](#form-types)
	- [Schedulers](#schedulers)
		- [Enter NgZone](#enter-ngzone)
		- [Leave NgZone](#leave-ngzone)
	- [Wcag](#wcag)
		- [forRoot](#forroot)
		- [Announce](#announce)

## DOM

### renderMarkup

Render html markup, if html contains large text nodes they will be splitted to separate spans based on maxChunkLength value

```typescript
const markup = `1234567`;
const parent = document.createElement("div");
const maxChunkLength = 2;

const callback = () => {
	console.log("done");
};

renderMarkup({ markup, parent, maxChunkLength }, callback); // will render <span>12</span><span>34</span><span>56</span><span>7</span>
```

## Forms

### FormConnector

### connectControlWithParent

Set control as child of other form group

```typescript
@Component()
export class ChildFormComponent {
	constructor(
		private controlContainer: ControlContainer,
		private registerUserDetailsFormService: RegisterUserDetailsFormService
	) {
		this.childForm = new FormGroup({});
		FormConnector.connectControlWithParent(
			controlContainer,
			"childName",
			this.childForm
		);
	}
}
```

### Form types

```typescript
interface CustomValue {
	name: string;
}

const typedFormControl: TypedFormControl<CustomValue> =
	this.formBuilder.control({ name: "test" });
const typedFormGroup: TypedFormGroup<CustomValue> = this.formBuilder.group({
	name: "test",
});
const typedFormArray: TypedFormArray<CustomValue> = this.formBuilder.array([
	typedFormGroup,
]);
```

## Schedulers

### Enter NgZone

Enter NgZone inside observable

```typescript
of(1)
	.pipe(observeOn(enterNgZone(this.ngZone)))
	.subscribe();
```

### Leave NgZone

Leave NgZone inside observable

```typescript
of(1)
	.pipe(observeOn(leaveNgZone(this.ngZone)))
	.subscribe();
```

## Wcag

### forRoot

Detectects focus source and add class to body (https://material.angular.io/cdk/a11y/overview#cdkmonitorelementfocus-and-cdkmonitorsubtreefocus)

Detectects high contrast mode and add 'hc-active' to body

```typescript
@NgModule({
  ...
	imports: [
    ...
		WcagModule.forRoot(),
	],
})
export class AppModule {}
```

### Announce

Add message in aria live region

```typescript
constructor(private wcag: Wcag){}

async showMessage(message: string): Promise<void> {
  await this.wcag.announce(message)
}
```
