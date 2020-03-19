const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = document.querySelector('.input__cities-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');
const buttonSearch = document.querySelector('.button__search');

let city = [];

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = 'f0282b9427831585c3bab9c2a7715d00';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';

// запрос на сервер
const getData = (url, callback) => {
  const request = new XMLHttpRequest();
  request.open('GET', url);

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });
  request.send();
}

// выпадающий список городов
const showCity = (input, list) => {
  list.textContent = '';

  if (input.value !== '') {
    const filterCity = city.filter((item) => {
      const fixItem = item.name.toLowerCase();
      return fixItem.includes(input.value.toLowerCase());
    });
  
    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name;
      list.append(li);
    })
  }
}

// выбор города
const selectCity = (event, input, list) => {
  const target = event.target;
  if (target.tagName.toUpperCase() === 'LI') {
    input.value = target.textContent;
    list.textContent = '';
  }
}

// обработчики событий

inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo);
});


// получение данных о городах (убирает пустые поля в name)
getData(proxy + citiesApi, (data) => {
  city = JSON.parse(data).filter(item => item.name);
});

// получение данных о рейсах Екатеринбург - Калининград
getData(proxy + calendar + '?origin=SVX&destination=KGD&depart_date=2020-05-25&one_way=false', (data) => {
  console.log(JSON.parse(data).current_depart_date_prices);

})