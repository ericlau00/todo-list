<?php
$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'GET') {
    http_response_code(301);
    header("Location: /");
} else if ($method == 'POST') {
    require_once('db_connect.php');

    $stmt = $db->prepare("INSERT INTO todo_list (label, date, is_complete) VALUES (:label, :date, 'false')");

    $stmt->bindValue(':label', $_POST['todo'], SQLITE3_TEXT);

    $date_str = date_create("now")->format('Y-m-d');
    $stmt->bindValue(':date', $date_str, SQLITE3_TEXT);

    $stmt->execute();

    $item_id = $db->lastInsertRowID();

    $db->close();

    http_response_code(201);

    $arr = array(
        "item_id" => $item_id,
        "label" => $_POST['todo'],
        "date" => $date_str,
        "is_complete" => 'false'
    );

    echo json_encode($arr);
}
exit;
