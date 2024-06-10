import { FormErrors, IAppState, IContacts, IDelivery, IOrder, IProductItem } from "../types";
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};

export class AppState extends Model<IAppState> {
    catalog: IProductItem[];
    basket: IProductItem[] = [];
    order: IOrder = {
        total: 0,
        items: [],
        phone: '',
        email: '',
        payment: '',
        address: ''
    };

    orderError: FormErrors = {};
    preview: string | null;

    setCatalog(products: IProductItem[]): void {
        this.catalog = products;
		this.emitChanges('items:changed', { catalog: this.catalog });
    }

    addToBasket(product: IProductItem): void {
        this.basket.push(product);
		this.updateBasket();
    }

    removeFromBasket(product: IProductItem): void {
        this.basket = this.basket.filter((item) => item.id !== product.id);
		this.updateBasket();
    }

    clearBasket(): void {
        this.basket = [];
		this.updateBasket();
    }

    updateBasket(): void {
        this.events.emit('catalog:change', {
			products: this.basket,
		});
		this.events.emit('basket:change', {
			products: this.basket,
		});
    }

    gettotal(): number {
        return this.basket.reduce((acc, item) => acc + item.price, 0);
    }

    setDeliveryField(field: keyof IDelivery, value: string): void {
        this.order[field] = value;
        
		if (this.validateDeliveryForm()) {
		}
    }

    setContactsField(field: keyof IContacts, value: string): void {
        this.order[field] = value;

		if (this.validateContactsForm()) {
		}
    }

    validateDeliveryForm() {
        const errors: typeof this.orderError = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		this.orderError = errors;
		this.events.emit('orderDeliveryFormErrors:change', this.orderError);
		return Object.keys(errors).length === 0;
    }

    validateContactsForm() {
        const errors: typeof this.orderError = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.orderError = errors;
		this.events.emit('orderContactsFormErrors:change', this.orderError);
		return Object.keys(errors).length === 0;
    }

    deliveryFormReset(): void {
        this.order.address = '';
		this.order.payment = '';
    }

    contactsFormReset(): void {
        this.order.email = '';
		this.order.phone = '';
    }

    setPreview(product: IProductItem): void {
        this.preview = product.id;
		this.emitChanges('preview:changed', product);
    }
}

