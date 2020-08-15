<?php
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
        http_response_code(301);
        header("Location: /");
    } else if ($method == 'POST') {
        $db = new SQLite3('todo_list.db');

        $db->exec("CREATE TABLE IF NOT EXISTS todo_list (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            todo TEXT,
            date TEXT
        )");

        $stmt = $db->prepare("INSERT INTO todo_list (todo, date) VALUES (:todo, :date)");

        $stmt->bindValue(':todo', $_POST['todo'], SQLITE3_TEXT);

        $date_str = date_create("now")->format('Y-m-d\TH:i:s');
        $stmt->bindValue(':date', $date_str, SQLITE3_TEXT);

        $stmt->execute();
        $db->close();

        http_response_code(201);

        $arr = array(
            "item" => $_POST['todo'],
            "date" => $date_str
        );

        echo json_encode($arr);
    }
    exit;
?>