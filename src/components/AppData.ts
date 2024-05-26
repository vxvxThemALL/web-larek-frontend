import { FormErrors, IAppState, IOrder, IOrderForm, IProductItem } from "../../types";
import { Model } from "../base/Model";

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};

export class AppState extends Model<IAppState> {
    catalog: IProductItem[];
    basket: IProductItem[];
    order: IOrder = {
        totalPrice: 0,
        items: [],
        phone: '',
        email: '',
        paymentMethod: '',
        address: ''
    };

    orderError: FormErrors = {};
    preview: string | null;

    setCatalog(products: IProductItem[]): void {

    }

    addToBasket(product: IProductItem): void {
    }

    removeFromBasket(product: IProductItem): void {

    }

    clearBasket(product: IProductItem): void {

    }

    updateBasket(): void {

    }

    getTotalPrice(): number {
        return
    }

    setDeliveryField(field: keyof IOrderForm, value: string): void {

    }

    setContactField(field: keyof IOrderForm, value: string): void {

    }

    validateDeliveryForm(): void {

    }

    validateContactForm(): void {

    }

    deliveryFormReset(): void {

    }

    contactFormReset(): void {

    }

    setPreview(product: IProductItem): void {

    }
}

