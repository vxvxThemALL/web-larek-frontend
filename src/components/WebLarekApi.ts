import { IOrder, IOrderResult, IProductItem } from "../types";
import { Api, ApiListResponse } from "./base/api";


export interface IAppAPI {
	getProductList: () => Promise<IProductItem[]>;
	order: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi extends Api implements IAppAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);

		this.cdn = cdn;
	}

	getProductList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	order(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}