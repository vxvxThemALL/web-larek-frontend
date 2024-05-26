export type CardCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface ApiResponse {
    items: IProductItem[];
}

export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: CardCategory;
    price: number | null;
}

export interface IAppState {
    catalog: IProductItem[];
    basket: IProductItem[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IOrderForm {
    paymentMethod: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    totalPrice: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}