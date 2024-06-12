import { CardCategory, IProduct } from "../types";
import { categorySelection } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

interface ICard extends IProduct {
    cardIndex?: string;
	buttonText?: string;
}

export class Card extends Component<ICard> {
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _button?: HTMLButtonElement;
    protected _price: HTMLElement;
    protected _cardIndex?: HTMLElement;
    
    constructor(container: HTMLElement, actions: ICardActions) {
        super(container)

		this._category = container.querySelector('.card__category');
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._button = container.querySelector('.card__button');
		this._price = ensureElement<HTMLElement>('.card__price', container);
        this._cardIndex = container.querySelector('.basket__item-index');

        if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
    }

	set category(value: CardCategory) {
		this.setText(this._category, value);
		this._category.classList.add(categorySelection[value]);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set button(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		this.disableButton(value);
	}

	get price(): number {
		return +this._price.textContent || 0;
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}
	
    get id(): string {
		return this.container.dataset.id || '';
		}
		
    set cardIndex(value: string) {
		this._cardIndex.textContent = value;
	}

	get cardIndex(): string {
		return this._cardIndex.textContent || '';
	}

    disableButton(value: number | null): void {
		if (!value) {
			if (this._button) {
				this._button.disabled = true;
			}
		}
	}
}