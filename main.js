let $ = (id) => document.getElementById(id);

let create = (element_type) => document.createElement(element_type);

let appendTodoItem = (container, todo) => {
    let { 'id': item_id, label, date, is_complete } = todo;

    is_complete = (is_complete == 'complete') ? true : false;

    let todoItem = createTodoItem(item_id, label, date, false);
    container.appendChild(todoItem);
}

window.onload = () => {
    let container = $('list-items');

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let todos = JSON.parse(this.responseText);

            todos.forEach(todo => {
                appendTodoItem(container, todo);
            })
        }
    }
    xhttp.open('GET', 'get_todos.php', true);
    xhttp.send();


    $('submit-todo').addEventListener('click', (e) => {
        e.preventDefault();
        addTodo(container);
    });
}

let addTodo = (container) => {
    let todo_input = $('add-todo-input');

    let content = todo_input.value.trim();
    if (content.length > 0) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
                appendTodoItem(container, JSON.parse(this.responseText));
            }
        }
        xhttp.open('POST', 'add_todo.php', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`todo=${encodeURIComponent(content)}`);
    }
    todo_input.value = '';
}

let createTodoItem = (item_id, label, date, is_complete) => {
    let todoItem = create('div');
    todoItem.className = 'list-item';
    todoItem.id = `item-${item_id}`;

    let todoCheck = createCheckDiv(item_id, is_complete);
    let todoContent = createContentDiv(label, date, is_complete);
    let todoDelete = createDeleteDiv(item_id);

    todoItem.appendChild(todoCheck);
    todoItem.appendChild(todoContent);
    todoItem.appendChild(todoDelete);

    return todoItem;
}

let createCheckDiv = (item_id, is_complete) => {
    let todoCheck = create('input');
    todoCheck.type = 'checkbox';
    todoCheck.checked = is_complete;

    todoCheck.addEventListener('change', () => {
        let item = $(`item-${item_id}`);
        let label_el = item.querySelector('div.item-content > label');

        let cur_state = label_el.style.textDecoration;
        if (cur_state == 'none' || cur_state.length == 0) {
            label_el.style.textDecoration = 'line-through';
            // set item to be complete in database
        } else if (cur_state == 'line-through') {
            label_el.style.textDecoration = 'none';
            // set item to be incomplete in database;
        }
    });

    return todoCheck;
}

let createDateDiv = (date) => {
    let smallContainer = create('div');

    let todoDate = create('small');
    todoDate.textContent = `Created on ${date}`;

    smallContainer.appendChild(todoDate);

    return smallContainer;
}

let createContentDiv = (label, date, is_complete) => {
    let todoContent = create('div');
    todoContent.className = 'item-content';

    let todoLabel = create('label');
    todoLabel.textContent = label;
    if (is_complete) {
        todoLabel.style.textDecoration = 'line-through';
    }

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
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 204) {
                $(`item-${item_id}`).remove();
            }
        };

        xhttp.open('POST', 'delete_todo.php', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`item_id=${encodeURIComponent(item_id)}`);
    });

    return todoDelete;
}
