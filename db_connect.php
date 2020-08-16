<?php
$db = new SQLite3('todo_list.db');

$bool = $db->exec("CREATE TABLE IF NOT EXISTS todo_list (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT,
            date TEXT,
            is_complete TEXT
        )");
