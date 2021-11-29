const LoginDOM = {
  loginForm: document.getElementById("login-form"),
};

const adminURL = `${window.location.protocol}//${window.location.host}/admin`;
const { loginForm } = LoginDOM;

const login = async (username, password) => {
  const url = `${adminURL}/login`;

  try {
    await axios
      .post(url, {
        username,
        password,
      })
      .then((res) => res.data)
      .then((data) => {
        const token = data.accessToken;
        localStorage.setItem("token", token);
        window.location.href = `./schedinfo.html`;
      })
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    const errStatus = error.response.status;
    const message = error.response.data.error;
    if (errStatus === 401) {
      alert(message);
    }
  }
};

const authenticated = async () => {
  try {
    const token = localStorage.getItem("token");
    if(!token){
      alert("Please login first!");
      window.location.href = `${bookingURL}/login`;
    }
    await axios
      .post(
        `${adminURL}/authenticate`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data)
      .then((data) => {
        if (!data.authenticated) {
          return (window.location.href = "/");
        }
      })
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    const status = error.response.status;
    if(status === 403) {
      alert("Please login first!");
      window.location.href = "/";
    }
    alert(error);
    window.location.href = "/";
  }
};


loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;
  await login(username, password);
});