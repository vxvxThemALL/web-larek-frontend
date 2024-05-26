# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемых в приложении

Тип, описывающий возможные категории карточки

```
export type CardCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';
}
```

Тип, описывающий приходящий массив данных от сервера (карточек)

```
export interface ApiResponse {
    items: IProductItem[];
}

```

Тип, описывающий ошибки валидации форм

```
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
```

Карточка товара

```
export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: CardCategory;
    price: number | null;
}
```

Интерфейс, описывающий состояние приложения

```
export interface IAppState {
    catalog: IProductItem[];
    basket: IProductItem[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}
```

Интерфейс для заполнения данных форм для заказа продуктов.

```
export interface IOrderForm {
    paymentMethod: string;
    address: string;
    email: string;
    phone: string;
}
```

Интерфейс заказа продуктов.

```
export interface IOrder extends IOrderForm {
    items: string[];
    totalPrice: number;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления - отвечает за отображение данных на странице;
- слой данных -  отвечает за хранение и изменение данных;
- презентер - отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер;
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт, переданный как параметр при вызове метода. По умолчанию выполняет `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на события;
- `emit` - инициализация события;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

#### Класс Component
Позволяет создавать компоненты и включает в себя инструментарий для манипуляции над ними: 
- `toggleClass` - переключить класс;
- `setText` - установить текстовое содержимое;
- `setDisabled` - сменить статус блокировки;
- `setVisible` - показать;
- `setImage` - установить изображение с алтернативным текстом;
- `render` - вернуть корневой DOM-элемент;

#### Класс Model
Абстрактный класс для создания моделей данных, включает в себя следующий инструментарий:
- `emitChanges` - сообщает всем, что модель поменялась.

#### Класс Form
Класс для создания новых форм, включает в себя следующий инструментарий:
- `onInputChange` - обработчик событий, реагирующий на изменение полей ввода;
- `valid` - валидация формы;
- `errors` - генерация ошибок;
- `render` - отображение элементов;

### Слой данных

#### Класс AppState
Класс, отвечающий за полный функционал приложения.
В полях класса хранятся следующие данные:
- catalog: IProductItem[]; - коллекция товаров на странице;
- basket: IProductItem[]; - коллекция товаров в корзине;
- order: IOrder = {
    totalPrice: 0,
    items: [],
    phone: '',
    email: '',
    paymentMethod: '',
    address: ''
}; - данные пользователя для оформления заказа;
- orderError: FormErrors = {} - ошибки валидации форм;
- preview: string | null; - отображение товара по id.

Методы класса:
- setCatalog(products: IProductItem[]): void - установка коллекции товаров на странице;
- addToBasket(product: IProductItem): void - добавление товара в корзину;
- removeFromBasket(product: IProductItem): void - удаление товара из корзины;
- clearBasket(product: IProductItem): void - опустошение корзины;
- updateBasket(): void - обновление корзины;
- getTotalPrice(): number - получение общей суммы заказа;
- setDeliveryField(field: keyof IOrderForm, value: string): void - установка данных формы доставки;
- setContactField(field: keyof IOrderForm, value: string): void - установка данных формы контактной информации;
- validateDeliveryForm(): void - валидация полей формы доставки;
- deliveryFormReset(): void - валидация полей формы контактной информации;
- deliveryFormReset(): void - сброс полей формы доставки;
- contactFormReset(): void - сброс полей формы контактной информации;
- setPreview(product: IProductItem): void - превью товара.

### Слой отображения

#### Класс Card
Класс, реализующий отображение карточки и ее методы.

В полях класса хранятся следующие данные:
- protected _cardIndex?: HTMLElement; - индекс карточки;
- protected _description?: HTMLElement; - описание карточки;
- protected _image?: HTMLImageElement; - изображение карточки;
- protected _title: HTMLElement; - заголовок карточки;
- protected _category?: HTMLElement; - категория карточки;
- protected _price: HTMLElement; - стоимость карточки;
- protected _button?: HTMLButtonElement; - кнопка карточки.

Методы класса:
- disableButton(value: number | null): void - отключает кнопку, если товар бесценный.

Сеттеры класса:
- set id(value: string) - установка индивидуального идентификатора карточки;
- set cardIndex(value: string) - установка индекса карточки;
- set title(value: string) - установка заголовка карточки;
- set image(value: string) - установка изображения карточки;
- set description(value: string) - установка описания карточки;
- set category(value: CardCategory) - установка категории карточки;
- set price(value: number) - установка стоимости карточки;
- set button(value: string) - установка кнопки карточки.

Геттеры класса:
- get id(): string - получение индивидуального идентификатора карточки;
- get cardIndex(): string - получение индекса карточки;
- get title(): string - получение заголовка карточки;
- get category(): string - получение категории карточки;
- get price(): number - получение стоимости карточки.

#### Класс Basket
Класс, реализующий отображение корзины с товарами и ее методы.

В полях класса хранятся следующие данные:
- protected _list: HTMLElement; - коллекция карточек в корзине;
- protected _total: HTMLElement; - общая стоимость карточек в корзине;
- protected _button: HTMLButtonElement; - кнопка подтверждения корзины.

Сеттеры класса:
- set items(items: HTMLElement[]) - установка списка товаров;
- set selected(items: string[]) - управление статусом кнопки подтверждения;
- set totalPrice(price: number) - установка общей стоимости карточек.

#### Класс OrderDelivery
Класс, реализующий форму со способом доставки.

В полях класса хранятся следующие данные:
- protected _paymentMethod: HTMLButtonElement[]; - кнопка выбора способа оплаты.

Методы класса:
- paymentMethodReset(): void - сброс кнопок выбора способа оплаты.

Сеттеры класса:
- set address(value: string) - установка адреса;
- set paymentMethod(name: string) - установка способа оплаты;
- set valid(value: boolean) - управление статусом кнопки подтверждения.

#### Класс OrderContacts
Класс, реализующий форму с контактной информацией пользователя.

Сеттеры класса:
- set phone(value: string) - установка номера телефона;
- set email(value: string) - установка электронной почты;
- set valid(value: boolean) - управление статусом кнопки подтверждения.

#### Класс Page
Класс, реализующий главную страницу приложения.

В полях класса хранятся следующие данные:
- protected _counter: HTMLElement; - счетчик карточек в корзине;
- protected _catalog: HTMLElement; - каталог карточек;
- protected _wrapper: HTMLElement; - отображение страницы;
- protected _basket: HTMLElement; - корзина карточек.

Сеттеры класса:
- set counter(value: number) - установка значения счетчика карточек в корзине;
- set catalog(items: HTMLElement[]) - установка каталога карточек;
- set locked(value: boolean) - блокировка прокрутки страницы.

#### Класс Modal
Класс реализующий модальное окно, его открытие и закрытие.

В полях класса хранятся следующие данные:
- protected _closeButton: HTMLButtonElement; - кнопка закрытия модального окна;
- protected _content: HTMLElement; - контент модального окна;

Методы класса:
- open(): void - открытие модального окна;
- close(): void - закрытие модального окна;
- render(data: IModalData): HTMLElement - отображает модальное окно.

Сеттеры класса:
    - set content(value: HTMLElement) - установка контента модального окна.

#### Класс Success
Класс, реализующий модальное окно успешного заказа.

В полях класса хранятся следующие данные:
- protected _total: HTMLElement; - общая стоимость продуктов в корзине;
- protected _closeButton: HTMLButtonElement; - кнопка закрытия модального окна.

Сеттеры класса:
- set total(value: string) - установка общей стоимости продуктов в корзине;

### Слой коммуникации

### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*
- `items:changed` — изменение товара;
- `card:select` — выбор карточки;
- `card:toBasket` — товар выбран в корзину;
- `basket:add` — добавление товара;
- `basket:remove` — удаление товара;
- `basket:changed` — изменение корзины;
- `basket:open` — открытие корзины;
- `orderDelivery:open` — открытие формы с выбором оплаты;
- `orderDelivery:submit` — отправка формы с выбором оплаты и открытие формы контактов;
- `orderContacts:submit` — отправка формы контактов;
- `formErrors:change` — процесс валидации формы;
- `orderDelivery:reset` - сброс полей формы доставки;
- `orderContacts:reset` — сброс полей формы контактов;
- `modal:open` — открытие модального окна;
- `modal:close` — закрытие модального окна.
