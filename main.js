let $ = (id) => document.getElementById(id);

window.onload = () => {
    $('submit-todo').addEventListener('click', (e) => {
        e.preventDefault();

        let todo_input = $('add-todo-input');

        let content = todo_input.value.trim();
        if (content.length > 0) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 201) {
                    let todo = JSON.parse(this.responseText);
                    console.log(todo);
                }
            }
            xhttp.open('POST', 'add_todo.php', true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(`todo=${encodeURIComponent(content)}`);
        }
        todo_input.value = '';
    });
}