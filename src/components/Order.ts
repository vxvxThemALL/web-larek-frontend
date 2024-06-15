import { IOrder } from "../types";
import { ensureAllElements } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class OrderDelivery extends Form<IOrder> {
	protected _payment: HTMLButtonElement[];
	protected _address: HTMLInputElement[]

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._payment = ensureAllElements(`.button_alt`, this.container);

		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				this.onInputChange(`payment`, button.name);
			});
		});
	}

	set payment(name: string) {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	paymentReset(): void {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
	}
}

export class OrderContacts extends Form<IOrder> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
}