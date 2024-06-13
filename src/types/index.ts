export type CardCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';
export type CategorySelection = {
    [Key in CardCategory]: string;
  };

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface ApiResponse {
    items: IProduct[];
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: CardCategory;
    price: number | null;
}

export interface IAppState {
    catalog: IProduct[];
    basket: IProduct[];
    preview: string | null;
    order: IOrder | null;
    cardState: { [productId: string]: boolean};
}

export interface IOrderForms {
	address: string;
	payment: string;
	phone: string;
	email: string;
}

export interface IOrder extends IOrderForms {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}