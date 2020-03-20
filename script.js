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

const renderCheapDay = (cheapTicket) => {
 console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
  console.log(cheapTickets);
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;

  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date;
  });

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);

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

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();

  const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
  const cityTo = city.find((item) => inputCitiesTo.value === item.name);
  
  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value,
  };

  const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&oneway=true`;

  // const requestData2 = '?depart_date=' + formData.when + '&origin=' + formData.from + '&destination=' + formData.to + '&oneway=true&token=' + API_KEY;
  
  getData(proxy + calendar + requestData, (response) => {
    renderCheap(response, formData.when);
  });
})


// получение данных о городах (убирает пустые поля в name)
getData(proxy + citiesApi, (data) => {
  city = JSON.parse(data).filter(item => item.name);
});

// получение данных о рейсах Екатеринбург - Калининград
// getData(proxy + calendar + '?depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token='+ API_KEY, (data) => {
//   console.log(JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-25'));

// })

