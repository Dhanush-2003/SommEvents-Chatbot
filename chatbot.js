let currentNode = "mainMenu";

function renderNode(nodeKey) {
  const node = knowledge[nodeKey];
  const chat = document.getElementById("chat");

  const botMessage = document.createElement("div");
  botMessage.className = "bot";
  botMessage.innerText = node.message;
  chat.appendChild(botMessage);

  if (node.options) {
    node.options.forEach(option => {
      const btn = document.createElement("button");
      btn.innerText = option.label;
      btn.onclick = () => {
        if (node.next) {
          renderNode(node.next);
        } else if (option.next) {
          renderNode(option.next);
        }
      };
      chat.appendChild(btn);
    });
  }

  if (node.form) {
    const input = document.createElement("input");
    input.placeholder = "Name & Email";
    chat.appendChild(input);

    const submit = document.createElement("button");
    submit.innerText = "Submit";
    submit.onclick = () => {
      alert("Thank you! Our team will reach out shortly.");
      renderNode("mainMenu");
    };
    chat.appendChild(submit);
  }
}

window.onload = () => renderNode(currentNode);
