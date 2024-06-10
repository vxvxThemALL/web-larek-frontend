
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface ApiResponse {
    items: IProductItem[];
}

export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
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
	paymentMethod: string;
}

export interface IContacts {
	phone: string;
	email: string;
}

export interface IOrder extends IDelivery, IContacts {
    items: string[];
    totalPrice: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}