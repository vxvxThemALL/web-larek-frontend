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
				this.payment = button.name;
				this.onInputChange(`payment`, button.name);
			});
		});
	}

	set payment(name: string) {
		this._paymentMethod.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	paymentMethodReset(): void {
		this._paymentMethod.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
	}
}

export class OrderContacts extends Form<IOrder> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
}