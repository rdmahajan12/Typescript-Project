const getUser = document.querySelector("#user") as HTMLInputElement;
const submitForm = document.querySelector("#form") as HTMLFormElement;
const mainContainer = document.querySelector(".main-container") as HTMLElement;

interface UserData {
  id: number;
  login: string;
  avatar_url: string;
  location: string;
  url: string;
}

async function myUser<T>(url: string, option?: RequestInit): Promise<T> {
  const res = await fetch(url, option);

  if (!res.ok) {
    throw new Error("User response not found");
  }
  const data = await res.json();
  return data;
}

const showResult = (singleUser: UserData) => {
  const { login, avatar_url, url } = singleUser;
  mainContainer.insertAdjacentHTML(
    "beforeend",
    `<div>
      <img src="${avatar_url}" alt="${login}"/>
      </hr>
      <div class="card-footer">
        <img src="${avatar_url}" alt="${login}"/>
        <p class="user-name">${login.toUpperCase()}</p>
        <a href="${url}">Github</a>
      </div>
     </div>`
  );
};

function myUserData(url: string) {
  myUser<UserData[]>(url, {}).then((userInfo) => {
    for (const singleUser of userInfo) {
      showResult(singleUser);
    }
  });
}

submitForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchTerm = getUser.value.toLowerCase();

  try {
    const url = "https://api.github.com/users";
    const data = await myUser<UserData[]>(url, {});
    const userData = data.filter((ele) => {
      return ele.login.toLowerCase().includes(searchTerm);
    });

    mainContainer.innerHTML = "";
    if (userData.length === 0) {
      mainContainer.insertAdjacentHTML(
        "beforeend",
        `<p class="empty-msg">No user found</p>`
      );
    } else {
      for (const singleUser of userData) {
        showResult(singleUser);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

myUserData("https://api.github.com/users");
