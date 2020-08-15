let $ = (id) => document.getElementById(id);

let create = (element_type) => document.createElement(element_type);

let createCheckDiv = (item_id) => {
    let todoCheck = create('input');
    todoCheck.type = 'checkbox';

    todoCheck.addEventListener('change', () => {
        console.log(item_id, 'complete toggle');
        // update the state of the item in the database
        // indicate that the todo item has been completed
    });

    return todoCheck;
}

let createDateDiv = (date) => {
    let smallContainer = create('div');

    let todoDate = create('small');
    todoDate.textContent = `Created on ${date}`; // TODO: format the date better

    smallContainer.appendChild(todoDate);

    return smallContainer;
}

let createContentDiv = (label, date) => {
    let todoContent = create('div');
    todoContent.className = 'item-content';

    let todoLabel = create('label');
    todoLabel.textContent = label;

    let dateDiv = createDateDiv(date);

    todoContent.appendChild(todoLabel);
    todoContent.appendChild(dateDiv);

    return todoContent;
}

let createDeleteDiv = (item_id) => {
    let todoDelete = create('div');
    todoDelete.className = 'delete';
    todoDelete.textContent = 'Delete';

    todoDelete.addEventListener('click', () => {
        console.log(item_id, 'delete item');
        // remove item from the database
        // remove the parent element
    });

    return todoDelete;
}

let createTodoItem = (item_id, label, date) => {
    let todoItem = create('div');
    todoItem.className = 'list-item';

    let todoCheck = createCheckDiv(item_id);
    let todoContent = createContentDiv(label, date);
    let todoDelete = createDeleteDiv(item_id);

    todoItem.appendChild(todoCheck);
    todoItem.appendChild(todoContent);
    todoItem.appendChild(todoDelete);

    return todoItem;
}

window.onload = () => {
    let container = $('list-items');

    $('submit-todo').addEventListener('click', (e) => {
        e.preventDefault();

        let todo_input = $('add-todo-input');

        let content = todo_input.value.trim();
        if (content.length > 0) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 201) {
                    let { item_id, label, date } = JSON.parse(this.responseText);

                    let todoItem = createTodoItem(item_id, label, date);

                    container.appendChild(todoItem);
                }
            }
            xhttp.open('POST', 'add_todo.php', true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(`todo=${encodeURIComponent(content)}`);
        }
        todo_input.value = '';
    });
}