import './scss/styles.scss';
import { AppState, CatalogChangeEvent } from "./components/AppData";
import { Card } from "./components/Card";
import { OrderContacts, OrderDelivery } from "./components/Order";
import { Page } from "./components/Page";
import { AppApi } from "./components/WebLarekApi";
import { EventEmitter } from "./components/base/events";
import { Basket } from "./components/common/Basket";
import { Modal } from "./components/common/Modal";
import { Success } from "./components/common/Success";
import { IOrderForms, IProduct } from "./types";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Получение шаблонов
const templates = {
  cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
  basket: ensureElement<HTMLTemplateElement>('#basket'),
  cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
  orderDelivery: ensureElement<HTMLTemplateElement>('#order'),
  orderContacts: ensureElement<HTMLTemplateElement>('#contacts'),
  success: ensureElement<HTMLTemplateElement>('#success'),
};

// Создание модели данных приложения
const appData = new AppState({}, events);

// Инициализация глобальных контейнеров
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Создание переиспользуемых компонентов
const components = {
  basket: new Basket(cloneTemplate(templates.basket), events),
  orderContacts: new OrderContacts(cloneTemplate(templates.orderContacts), events),
  orderDelivery: new OrderDelivery(cloneTemplate(templates.orderDelivery), events),
  success: new Success(cloneTemplate(templates.success), {
    onClick() {
      modal.close();
    },
  }),
};

// Загрузка списка продуктов с сервера
api.getProductList()
  .then(products => appData.setCatalog(products))
  .catch(err => console.error(err));

// Управление каталогом
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(product => {
    const card = new Card(cloneTemplate(templates.cardCatalog), {
      onClick: () => events.emit('card:select', product),
    });
    return card.render({
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      category: product.category,
    });
  });
});

// Управление отображением превью карточки
events.on('card:select', (product: IProduct) => {
  appData.setPreview(product);
});

// Открытие карточки в модальном окне
events.on('card:select', (product: IProduct) => {
  page.locked = true;
  let isInBasket = appData.basket.includes(product)
  const card = new Card(cloneTemplate(templates.cardPreview), {
    onClick: () => {
      events.emit('card:toBasket', product);
      card.buttonText = appData.basket.includes(product)
        ? 'Удалить из корзины'
        : 'В корзину';
    },
  });
  modal.render({
    content: card.render({
      id: product.id,
      title: product.title,
      image: product.image,
      category: product.category,
      description: product.description,
      price: product.price,
      buttonText: isInBasket ? `Удалить из корзины` : `В корзину`,
    }),
  });
});

// Управление корзиной
events.on('card:toBasket', (product: IProduct) => {
  if (!appData.basket.includes(product)) {
    events.emit('basket:add', product);
  } else {
    events.emit('basket:remove', product);
  }
});

events.on('basket:add', (product: IProduct) => {
  appData.addToBasket(product);
});

events.on('basket:remove', (product: IProduct) => {
  appData.removeFromBasket(product);
});

events.on('basket:change', () => {
  page.counter = appData.basket.length;
});

events.on('basket:open', () => {
  components.basket.selected = appData.basket.map(item => item.id);
  modal.render({
    content: components.basket.render({ price: appData.getTotal() }),
  });
});

events.on('basket:change', () => {
  components.basket.items = appData.basket.map((item, index) => {
    const card = new Card(cloneTemplate(templates.cardBasket), {
      onClick: () => events.emit('basket:remove', item),
    });
    return card.render({
      cardIndex: (index + 1).toString(),
      title: item.title,
      price: item.price,
    });
  });
  components.basket.total = appData.getTotal();
});

// Управление оформлением заказа
events.on('orderDelivery:open', () => {
  let isValid = appData.order.payment === `` || appData.order.address  === `` ? false : true;
  modal.render({
    content: components.orderDelivery.render({
      payment: appData.order.payment,
      address: appData.order.address,
      valid: isValid,
      errors: [],
    }),
  });
});

events.on('order:submit', () => {
  let isValid = appData.order.phone === `` || appData.order.email  === `` ? false : true;
  modal.render({
    content: components.orderContacts.render({
      phone: appData.order.phone,
      email: appData.order.email,
      valid: isValid,
      errors: [],
    }),
  });
});

events.on('orderDeliveryFormErrors:change', (errors: Partial<IOrderForms>) => {
  const { address, payment } = errors;
  components.orderDelivery.valid = !(payment || address);
  components.orderDelivery.errors = [payment, address].filter(Boolean).join('; ');
});

events.on('orderContactsFormErrors:change', (errors: Partial<IOrderForms>) => {
  const { email, phone } = errors;
  components.orderContacts.valid = !(email || phone);
  components.orderContacts.errors = [email, phone].filter(Boolean).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForms; value: string }) => {
  appData.setDeliveryField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForms; value: string }) => {
  appData.setContactsField(data.field, data.value);
});

events.on('order.payment:change', (data: { field: keyof IOrderForms; value: string }) => {
  appData.setDeliveryField(data.field, data.value);
});

// Управление блокировкой скролла страницы
events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

// Отправка заказа
events.on('contacts:submit', () => {
  const orderDetails = {
    ...appData.order,
    total: appData.getTotal(),
    items: appData.basket.map(item => item.id),
  };

  api.placeOrder(orderDetails)
    .then(res => {
      appData.clearBasket();
      appData.orderReset();
      components.orderDelivery.clearInputs();
      components.orderContacts.clearInputs();
      modal.render({
        content: components.success.render({ total: res.total }),
      });
    })
    .catch(err => {
      console.error(err);
    });
});