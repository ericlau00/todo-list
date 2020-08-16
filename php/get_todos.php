<?php
require_once('db_connect.php');

http_response_code(200);

$res = $db->query('SELECT * FROM todo_list');

$data = array();

while ($item = $res->fetchArray(SQLITE3_ASSOC)) {
    array_push($data, $item);
}

echo json_encode($data);
exit;
