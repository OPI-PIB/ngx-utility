# ngx-utility

-   [ngx-utility](#ngx-utility)
    -   [DOM](#dom)
        -   [renderMarkup](#rendermarkup)
        -   [window](#window)
    -   [Forms](#forms)
        -   [FormConnector](#formconnector)
        -   [FormControlsOf](#formcontrolsof)
    -   [Http](#http)
        -   [RestQuery](#restquery)
    -   [Schedulers](#schedulers)
        -   [Enter NgZone](#enter-ngzone)
        -   [Leave NgZone](#leave-ngzone)
    -   [Wcag](#wcag)
        -   [forRoot](#forroot)
        -   [Announce](#announce)

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

### window

InjectionToken which is an abstraction over global window object

```typescript
@Injectable({
	providedIn: "root",
})
export class MyService {
	constructor(@Inject(WINDOW) private window: Window) {}
}
```

## Forms

### FormConnector

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

### FormControlsOf

Transform type into FormControls

```typescript
type User = {
	name: string;
};

type UserFormControls = FormControlsOf<User>;
```

## Http

### RestQuery

```typescript
@Injectable({
	providedIn: "root",
})
export class RestUserGetService extends RestQuery {
	constructor(private httpClient: HttpClient) {
		super();
	}

	getUser$(userId: UserId): Observable<User> {
		return this.query$(
			this.httpClient.get<UserDto>(
				`${environment.restUri}/user/${userId.id}`
			)
		).pipe(map((userDto) => User.fromDto(userDto)));
	}
}

@Component({
	selector: "app-user-page",
	template: `
		<ng-container *ngIf="user$ | async as user">
			{{ user.name }}
		</ng-container>

		<mat-progress-spinner
			*ngIf="isProcessing$ | async"
			mode="indeterminate"
			color="primary"
		></mat-progress-spinner>
	`,
	styleUrls: ["./user-page.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent {
	user$: Observable<User>;

	isProcessing$: Observable<boolean> = RestQuery.isProcessingAny$([
		this.restUserGetService.isProcessing$(),
	]);

	constructor(private restUserGetService: RestUserGetService) {
		this.user$ = this.restUserGetService.getUser$(
			UserId.create({
				id: "00000000-aaaa-dddd-ffff-000000000000",
			})
		);
	}
}
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
