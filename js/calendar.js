class myCollection {
  constructor() {
    let data = [];
    let message = "";
    let booking = Object;

    this.setData = (newData) => (data = newData);
    this.getData = (_) => data;

    this.setMessage = (s) => (message = s);
    this.getMessage = (_) => message;

    this.setBooking = (book) => (booking = book);
    this.getBooking = (_) => booking;
  }
}
const DOMElements = {
  titleInfo: document.querySelector("#title-info"),
  dateInfo: document.querySelector("#date-info"),
  add_del_form: document.querySelector("#add-date-form"),
  add_del_addBtn: document.querySelector(".submit"),
  add_del_delBtn: document.querySelector(".cancel"),
  add_del_date: document.querySelector("#setDate"),
  add_del_title: document.querySelector("#setTitle"),
  findInfo: document.querySelector("#info-text"),
  findForm: document.querySelector("#form"),
  findYear: document.querySelector("#year"),
  findMonth: document.querySelector("#month"),
  findContainer: document.querySelector("#available-dates-container"),
};

const { findForm, findYear, findMonth, findInfo, findContainer } = DOMElements; // for Finding available dates
const {
  add_del_form,
  add_del_date,
  add_del_title,
  add_del_addBtn,
  add_del_delBtn,
} = DOMElements;

const {
  titleInfo,
  dateInfo
} = DOMElements;

const collection = new myCollection();

let protocol = window.location.protocol;
let host = window.location.host;
const bookingURL = `${protocol}//${host}/booking`

const fetchExactData = async (year, month, callback) => {
  const url = `${bookingURL}/available/${year}/${month}`;
  try {
    await axios
      .get(url)
      .then((res) => res.data)
      .then((data) => data.result)
      .then((dates) => {
        const { data, message } = dates;
        collection.setData(data);
        collection.setMessage(message);
        return message;
      })
      .then((message) => {
        displayInfoMessage(message);
        callback(year, month);
      })
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    alert(error);
  }
};

const displayInfoMessage = (message) => {
  return (findInfo.innerText = message);
};

function displayResults(year, month) {
  findContainer.innerHTML = "";
  const data = collection.getData();
  data.forEach((item) => {
    const dateElement = document.createElement("span");
    dateElement.classList.add("blocks");
    dateElement.innerHTML = new Date(item).toLocaleDateString("en-PH", {
      day: "numeric",
    });
    findContainer.appendChild(dateElement);
  });
}

findForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const year = findYear.value;
  const month = findMonth.value;
  await fetchExactData(year, month, displayResults);
});

// For adding and deleting event

const checkExact = async (date, callback) => {
  const url = `${bookingURL}/check/${date}`;
  try {
    await axios
      .get(url)
      .then((res) => res.data)
      .then((result) => {
        collection.setBooking(result.data);
        return result.status;
      })
      .then((status) => callback(status))
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    console.error(error);
  }
};

const addEvent = async (date, title, callback) => {
  const data = {
    date,
    title,
  };
  const url = `${bookingURL}/add`;
  try {
    await axios
      .post(url, data)
      .then((res) => callback(res.data))
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    if(error.response.status === 400) {
      return alert("This date is already occupied");
    }
    alert(error);
  }
};
const delEvent = async (date, callback) => {
  const url = `${bookingURL}/delete/${date}`;
  try {
    await axios
      .delete(url)
      .then((res) => callback(res.data))
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    alert(error);
  }
};

const verifyDate = async (d) => {
  add_del_title.value = "";
  add_del_addBtn.setAttribute("disabled", "yes");
  add_del_delBtn.setAttribute("disabled", "yes");

  const date = d || add_del_date.value;
  await checkExact(date, activateButton);
}

const activateButton = (status) => {
  if (status) {
    // if occupied
    const booking = collection.getBooking();
    titleInfo.innerText = booking.title;
    dateInfo.innerText = new Date(booking.date).toLocaleDateString('default', {
      day: "numeric",
      year: "numeric",
      month: "long"
    })
    add_del_title.value = booking.title;
    add_del_title.setAttribute("readonly", "yes");
    add_del_addBtn.setAttribute("disabled", "yes");
    return add_del_delBtn.removeAttribute("disabled");
  }

  // if not occupied
  add_del_title.value = "";
  add_del_title.removeAttribute("readonly");
  add_del_delBtn.setAttribute("disabled", "yes");
  return add_del_addBtn.removeAttribute("disabled");
};

add_del_date.addEventListener("change", async () => {
  await verifyDate();
});

add_del_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const date = add_del_date.value,
    title = add_del_title.value;

  await addEvent(date, title, (res) => {
    const event = res.data;
    const date = new Date(event.date).toLocaleDateString('default', { day: "numeric", year: "numeric", month: "long" });
    alert(`${event.title} has been added to ${date}`);
    add_del_form.reset();
    activateButton(false);
  });
});

add_del_delBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const date = add_del_date.value;
  if(confirm("Are you sure you want to remove this event?")){
    await delEvent(date, (res)=>{
      const event = res.data;
      const date = new Date(event.date).toLocaleDateString('default', { day: "numeric", year: "numeric", month: "long" });
      alert(`Event for ${date}:${event.title} has been removed.`);
      add_del_form.reset();
      activateButton(false);
    });
  }
});