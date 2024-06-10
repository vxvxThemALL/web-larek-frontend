import { AppState, CatalogChangeEvent } from './components/AppData';
import { Card } from './components/Card';
import { OrderContacts, OrderDelivery } from './components/Order';
import { Page } from './components/Page';
import { AppApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import './scss/styles.scss';
import { IContacts, IDelivery, IOrder, IProductItem } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//Шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//Модель данных
const appData = new AppState({}, events);


//Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//Переиспользуемые компоненты
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderDelivery = new OrderDelivery(cloneTemplate(orderTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(contactsTemplate), events);

// Каталог
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

//Получение карточек с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

//Отображение превью карточки
events.on('card:select', (item: IProductItem) => {
	appData.setPreview(item);
});	

//Открытие карточки
events.on('card:select', (item: IProductItem) => {
	page.locked = true;
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toBasket', item);
			card.button =
				appData.basket.indexOf(item) !== -1
					? 'Удалить из корзины'
					: 'Добавить в корзину';
		},
	});
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			buttonText: 'Добавить в корзину',
		}),
	});
});


//Переключение кнопок
events.on('card:toBasket', (item: IProductItem) => {
	if (appData.basket.indexOf(item) === -1) {
		events.emit('basket:add', item);
	} else {
		events.emit('basket:remove', item);
	}
});

//Добавление карточки в корзину
events.on('basket:add', (item: IProductItem) => {
	appData.addToBasket(item);
});

//Удаление карточки из корзины
events.on('basket:remove', (item: IProductItem) => {
	appData.removeFromBasket(item);
});

//Кол-во карточек в корзине
events.on('basket:change', () => {
	page.counter = appData.basket.length;
});

// Открытие корзины
events.on('basket:open', () => {
	basket.selected = appData.basket.map((item) => item.id);
	modal.render({
		content: basket.render({
			price: appData.getTotalPrice(),
		}),
	});
});

//Изменения в корзине
events.on('basket:change', () => {
	basket.items = appData.basket.map((item, identifierCard) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:remove', item);
			},
		});
		return card.render({
			cardIndex: (identifierCard + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});

	basket.totalPrice = appData.getTotalPrice();
});

//Открытие модального окна с информацией о доставке
events.on('orderDelivery:open', () => {
	modal.render({
		content: orderDelivery.render({
			paymentMethod: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открытие модального окна с контактной информацией
events.on('order:submit', () => {
	modal.render({
		content: orderContacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//Изменение состояния валидации формы заказа с информацией о доставке
events.on('orderDeliveryFormErrors:change', (errors: Partial<IDelivery>) => {
	const { address, paymentMethod } = errors;
	orderDelivery.valid = !paymentMethod && !address;
	orderDelivery.errors = Object.values({ paymentMethod, address })
		.filter((i) => !!i)
		.join('; ');
});

//Изменение состояния валидации формы заказа с контактной информацией
events.on('orderContactsFormErrors:change', (errors: Partial<IContacts>) => {
	const { email, phone } = errors;
	orderContacts.valid = !email && !phone;
	orderContacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

//Изменение одного из полей
events.on(/^order\..*:change/, (data: { field: keyof IDelivery, value: string }) => {
    appData.setDeliveryField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContacts, value: string }) => {
    appData.setContactsField(data.field, data.value);
});

//Изменение способа оплаты
events.on(
	`order.paymentMethod:change`,
	(data: { field: keyof IDelivery; value: string }) => {
		appData.setDeliveryField(data.field, data.value);
	}
);

//Блокировка скролла страницы при открытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

//Разблокировка скролла страницы при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
});

//Отправка формы
events.on('order:submit', () => {
	api
		.order(
			{
				...appData.order,
				totalPrice: appData.getTotalPrice(),
				items: appData.basket.map((item) => item.id),
			}
		)
		.then((res) => {
			appData.clearBasket();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick() {
					modal.close();
					appData.deliveryFormReset();
					appData.contactsFormReset();
				},
			});
			modal.render({
				content: success.render({
					totalPrice: res.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

//Получение карточек с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});