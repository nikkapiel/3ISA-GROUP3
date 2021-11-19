class ManageDates {
  constructor(year, month) {
      this.year = year;
      this.month = month;

      let getMonthNumber = (month = this.month) => {
          const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
          ];
          return months.indexOf(month) + 1;
      };
      let getAllDays = (year = this.year, month = this.month) => {
          const monthNumber = getMonthNumber();
          const dateInput = new Date(year, monthNumber, 0);
          return dateInput.getDate();
      };

      this.getDateArray = (year = this.year, month = this.month) => {
          month = getMonthNumber(month);
          const days = getAllDays(year, month);
          const dateArray = [];

          for (let i = 1; i <= days; i++) {
              const date = new Date(year, month - 1, i);
              dateArray.push(date);
          }
          return dateArray;
      };
      this.getAvailableDays = function (occupied, year = this.year, month = this.month) {
          month = getMonthNumber(month);
          const occupiedDays = occupied.map((date) => new Date(date).getDate());
          const availableDays = this.getDateArray();
          console.log(occupiedDays);
          return availableDays.filter((date) => {
              return !occupiedDays.includes(new Date(date).getDate());
          });

      };
  }
}

class myCollection {
  constructor() {
      let data = [];

      this.getData = () => {
          return data;
      };
      this.setData = (newData) => {
          data = newData;
      };
  }
}

async function submitRequest(e) {
e.preventDefault();
const data = await fetchData();
}




const collection = new myCollection();
const form = document.querySelector("#form");

const fetchExactData = async (year, month, callback) => {
const url = "https://618f0ee950e24d0017ce1577.mockapi.io/date";
try {
  await axios
    .get(url)
    .then((res) => res.data)
    .then((data) => {
      const filtered = data
        .map((item) => item.date)
        .filter((date) => {
          const yyyy = new Date(date).getFullYear().toString();
          const MM = new Date(date).toLocaleDateString("default", {
            month: "long",
          });

          if (yyyy === year && MM === month) {
            return date;
          }
        });

      collection.setData(filtered);
    })
    .then(() => callback(year, month))
    .catch((e) => {
      console.log(e);
    });
} catch (error) {
  console.log(error);
}
};

form.addEventListener("submit", async (e) => {
e.preventDefault();

const year = document.querySelector("#inputYear").value;
const month = document.querySelector("#selectMonth").value;

await fetchExactData(year, month, generateAvailableDates);
});

function generateAvailableDates(year, month) {
const container = document.querySelector("#available-dates-container");
container.innerHTML = "";
const data = collection.getData();

const manageDates = new ManageDates(year, month);
const availableDays = manageDates.getAvailableDays(data);
availableDays.forEach((item) => {
  const dateElement = document.createElement("span");
  dateElement.classList.add("badge", "badge-success", "m-1", "p-2");
  dateElement.innerHTML = new Date(item).toLocaleDateString("en-PH", {
    day: "numeric",
  });  
  container.appendChild(dateElement);
});

}