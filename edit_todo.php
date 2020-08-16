<?php
$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'GET') {
    http_response_code(301);
    header("Location: /");
} else if ($method == 'POST') {
    require_once('db_connect.php');

    $stmt = $db->prepare("UPDATE todo_list SET is_complete = :is_complete WHERE id=:item_id");

    $stmt->bindValue(':item_id', $_POST['item_id'], SQLITE3_NUM);
    $stmt->bindValue(':is_complete', $_POST['is_complete'], SQLITE3_TEXT);

    $stmt->execute();

    $db->close();

    http_response_code(204);
}
exit;
