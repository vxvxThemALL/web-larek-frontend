import { IOrder } from "../types";
import { ensureAllElements } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";


export class OrderDelivery extends Form<IOrder> {
	protected _paymentMethod: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentMethod = ensureAllElements(`.button_alt`, this.container);

		this._paymentMethod.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentMethod = button.name;
				this.onInputChange(`paymentMethod`, button.name);
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set paymentMethod(name: string) {
		this._paymentMethod.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	paymentMethodReset(): void {
		this._paymentMethod.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}
}

export class OrderContacts extends Form<IOrder> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}
}