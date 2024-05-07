export interface ICard {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IUser {
    paymentMethod: string;
    deliveryAddress: string;
    email: string;
    phone: string;
}

export interface ICardsData {
    cards: ICard[];
    preview: string | null;
}

export interface IBasket {
    cards: TBasketCard[];
}


export type TBasketCard = Pick<ICard, 'id' | 'title' | 'price'>;


