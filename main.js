let $ = (id) => document.getElementById(id);

let create = (element_type) => document.createElement(element_type);

let request = (method, script, body, stateFunction) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = stateFunction;
    xhttp.open(method, script, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(body);
}

window.onload = () => {
    let container = $('list-items');

    let getTodos = function () {
        if (this.readyState == 4 && this.status == 200)
            JSON.parse(this.responseText).forEach(todo => {
                container.appendChild(createTodoItem(todo));
            });
    }

    let default_sort = encodeURI('?sort_by=id.ASC');
    request('GET', `php/get_todos.php${default_sort}`, null, getTodos);

    $('submit-todo').addEventListener('click', (e) => {
        e.preventDefault();
        addTodo(container);
    });

    let sort = $('sort');
    sort.addEventListener('change', () => {
        while (container.firstChild)
            container.removeChild(container.lastChild);
        let uri = encodeURI(`?sort_by=${sort.value}`);
        request('GET', `php/get_todos.php${uri}`, null, getTodos);
    })
}

let addTodo = (container) => {
    let todo_input = $('add-todo-input');

    let content = todo_input.value.trim();
    if (content.length > 0) {
        let addFunction = function () {
            if (this.readyState == 4 && this.status == 201) {
                let todoItem = createTodoItem(JSON.parse(this.responseText));
                let sort = $('sort').value;
                if (sort == 'id.DESC' || sort == 'is_complete.ASC') {
                    container.prepend(todoItem);
                } else {
                    container.appendChild(todoItem);
                }
            }
        }

        let body = `todo=${encodeURIComponent(content)}`;
        request('POST', 'php/add_todo.php', body, addFunction);
    }
    todo_input.value = '';
}

let createTodoItem = (todo) => {
    let { 'id': item_id, label, date, is_complete } = todo;

    is_complete = (is_complete == 'true') ? true : false;

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
        let el = item.querySelector('div.item-content > label');

        let editFunction = function () {
            if (this.readyState == 4 && this.status == 204) {
                el.style.textDecoration = (is_complete) ? 'none' : 'line-through';
                is_complete = !is_complete;
            }
        }

        let body = encodeURI(`item_id=${item_id}&is_complete=${!is_complete}`);
        request('POST', 'php/edit_todo.php', body, editFunction);
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
    if (is_complete) todoLabel.style.textDecoration = 'line-through';

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

        let deleteFunction = function () {
            if (this.readyState == 4 && this.status == 204)
                $(`item-${item_id}`).remove();
        }

        let body = `item_id=${encodeURIComponent(item_id)}`;

        request('POST', 'php/delete_todo.php', body, deleteFunction);
    });

    return todoDelete;
}
