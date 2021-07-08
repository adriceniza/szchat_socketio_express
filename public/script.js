const socket = io.connect("http://localhost:3000", { forceNew: true });
socket.on("messages", (data) => {
  render(data);
});
socket.on("userslist", (data) => {
  console.log(data, "userslist");
  renderUsers(data);
});

socket.on("disconnected", () => {
  console.log("client - user disconnected");
  socket.emit("delUser", current_name);
});

let current_name = "";

const renderUsers = (data) => {
  console.log(data, "renderUsers");
  let html = data
    .map((user) => {
      return `<li>${user}</>`;
    })
    .join("<br>");
  document.getElementById("usersList").innerHTML = html;
};
const render = (data) => {
  let html = data
    .map((m) => {
      if (current_name === m.name) {
        return `<div class="messageCardRight" id="${m.name}">
            <div class="message_name"><p>${m.name} </p></div>
            <div class="message_text"><p>${m.text}</p></div>
            </div>`;
      } else {
        return `<div class="messageCardLeft" id="${m.name}">
            <div class="message_name">${m.name} </div>
            <div class="message_text">${m.text}</div>
            </div>`;
      }
    })
    .join("<br>");
  document.getElementById("messages").innerHTML = html;

  scrollToBottom();
};

const scrollToBottom = () => {
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
};
const logIn = (e) => {
  const welcomeUser = document.getElementById("welcomeUser");
  const welcomeUserH1 = document.getElementById("welcomeUserH1");
  const formLogin = document.getElementById("formLogin");
  const login = document.getElementById("login");
  const chat = document.getElementById("chat");
  current_name = e.name.value;
  socket.emit("current_user_name", current_name);
  console.log(current_name);
  e.name.value = "";
  welcomeUser.style.display = "block";
  formLogin.style.display = "none";
  welcomeUser.style.display = "block";
  welcomeUserH1.innerText += `Welcome ${current_name} , enjoy the chat!`;
  setTimeout(() => {
    welcomeUserH1.style.transform = "translateY(0%)";
    setTimeout(() => {
      login.style.transform = "translateX(-1000%)";
      setTimeout(() => {
        login.style.display = "none";
        chat.style.display = "grid";
        setTimeout(() => {
          login.style.transform = "translateX(0%)";
          chat.style.transform = "translateX(0%)";
        }, 10);
      }, 600);
    }, 2000);
  }, 600);

  return false;
};

const addMessage = (e) => {
  let payload = {
    text: e.text.value,
    name: current_name,
  };

  socket.emit("new-message", payload);
  document.getElementById("message").value = "";
  return false;
};
