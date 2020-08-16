<?php
require_once('db_connect.php');

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    http_response_code(200);

    $split = (array_key_exists('sort_by', $_GET))
        ? explode('.', $_GET['sort_by'])
        : array('id', 'ASC');

    $res = $db->query("SELECT * FROM todo_list ORDER BY $split[0] $split[1]");

    $data = array();

    if (gettype($res) != 'boolean') {
        while ($item = $res->fetchArray(SQLITE3_ASSOC)) {
            array_push($data, $item);
        }
    }

    $db->close();

    echo json_encode($data);
}
exit;
