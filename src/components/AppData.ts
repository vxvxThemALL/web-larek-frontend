import { FormErrors, IAppState, IOrderForms, IOrder, IProduct } from "../types";
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};

export class AppState extends Model<IAppState> {
    catalog: IProduct[];
    basket: IProduct[] = [];
    order: IOrder = {
        items: [],
        payment: '',
        address: '',
        email: '',
        phone: '',
        total: null,
    };

    orderError: FormErrors = {};
    preview: string | null;

    setCatalog(productsList: IProduct[]): void {
        this.catalog = productsList;
		this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(product: IProduct): void {
        this.preview = product.id;
		this.emitChanges('preview:changed', product);
    }

    addToBasket(product: IProduct): void {
        this.basket.push(product);
		this.updateBasket();
    }

    removeFromBasket(product: IProduct): void {
        this.basket = this.basket.filter((item) => item.id !== product.id);
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

    clearBasket(): void {
        this.basket = [];
        this.updateBasket();
    }

    getTotal(): number {
        return this.basket.reduce((acc, item) => acc + item.price, 0);
    }

    setDeliveryField(field: keyof IOrderForms, value: string): void {
        this.order[field] = value;
        
		if (this.validateDeliveryForm()) {
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

    setContactsField(field: keyof IOrderForms, value: string): void {
        this.order[field] = value;

		if (this.validateContactsForm()) {
		}
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

    orderReset(): void {
		this.order.payment = '';
        this.order.address = '';
        this.order.phone = '';
        this.order.email = '';
    }
}

