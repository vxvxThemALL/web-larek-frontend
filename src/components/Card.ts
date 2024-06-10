import { IProductItem } from "../types";
import { categorySettings } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

interface ICard extends IProductItem {
    cardIndex?: string;
	buttonText?: string;
}

export class Card extends Component<ICard> {
    protected _cardIndex?: HTMLElement;
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    
    constructor(container: HTMLElement, actions: ICardActions) {
        super(container)

        this._cardIndex = container.querySelector('.basket__item-index');
        this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
        this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
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

    set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(categorySettings[value]);
	}

	get category(): string {
		return this._category.textContent || '';
	}

    disableButton(value: number | null): void {
		if (!value) {
			if (this._button) {
				this._button.disabled = true;
			}
		}
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		this.disableButton(value);
	}

	get price(): number {
		return +this._price.textContent || 0;
	}

	set button(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}


}