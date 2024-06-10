export type CardCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';
export type FormErrors = Partial<Record<keyof IOrder, string>>;

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

export interface IDelivery {
	address: string;
	payment: string;
}

export interface IContacts {
	phone: string;
	email: string;
}

export interface IOrder extends IDelivery, IContacts {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}