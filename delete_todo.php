<?php
$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'GET') {
    http_response_code(301);
    header("Location: /");
} else if ($method == 'POST') {
    require_once('db_connect.php');

    $stmt = $db->prepare("DELETE FROM todo_list WHERE id=:item_id");

    $stmt->bindValue(':item_id', $_POST['item_id'], SQLITE3_NUM);

    $stmt->execute();

    $db->close();

    http_response_code(204);
}
exit;
