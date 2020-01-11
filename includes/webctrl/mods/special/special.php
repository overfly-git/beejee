<?php

class Special
{
    public function __construct($config = null)
    {
        /* */
    }

    function get_tasks()
    {
        $tasks = Db::run("SELECT id, name, email, description, comment, add_on, status FROM `bj_tasks`")->fetchAll();
        return $tasks;
    }

    function get_updated_tasks()
    {
        $updated_tasks = Db::run("SELECT id FROM `bj_tasks` WHERE edit_on IS NOT NULL")->fetchAll();

        if ($updated_tasks)
        {
            $updated_tasks = array_map(function($value){ return $value['id']; }, $updated_tasks);
        }

        return $updated_tasks;
    }

    function get_tasks_columns($options = null)
    {
        $columns = Db::query("SHOW FULL COLUMNS FROM `bj_tasks`")->fetchAll();
        $result  = [];

        foreach ($columns as $column)
        {
            $result[] =
            [
                'id'    => $column['Field'],
                'title' => $column['Comment'],
            ];
        }

        return $result;
    }

    function task_exists(int $id)
    {
        return (int)Db::run("SELECT count(*) FROM `bj_tasks` WHERE id = ?", [$id])->fetchColumn() != 0;
    }

    function task_remove(int $id)
    {
        if ($this->task_exists($id) && $this->is_authorized())
        {
            return (int)Db::run("DELETE FROM `bj_tasks` WHERE id = ?", [$id])->rowCount() != 0;
        }

        return false;
    }

    function task_update($options = null)
    {
        $task_id = (int)$options['id'];

        /*
         a: task_add
         id: ?
         name: *
         email: *
         description: *
         comment: *
         status: *
        */

        if ($task_id && $this->task_exists($task_id))
        {
            // update
            $updated =  Db::run("UPDATE `bj_tasks` SET name=?, email=?, description=?, comment=?, status=?, edit_on=? WHERE id=?", [
                $options['name'],
                $options['email'],
                $options['description'],
                $options['comment'],
                $options['status'],
                strtotime('now'),
                $task_id
            ]);

            return $updated->rowCount() > 0;

        } else
        if (!$this->task_exists($task_id))
        {
            // new
            $added = Db::run("INSERT INTO `bj_tasks` VALUES (NULL, ?, ?, ?, ?, ?, ?, NULL)", [
                $options['name'],
                $options['email'],
                $options['description'],
                $options['comment'],
                strtotime('now'),
                $options['status'],
            ]);

            return $added->rowCount() > 0;
        }

        return false;
    }

    /////////////////////////////////
    /// Login
    /////////////////////////////////

    function is_authorized()
    {
        return $_SESSION['auth.authorized'] === true && $_SESSION['auth.name'] === Webctrl::$config['admin']['name'];
    }

    function login($user, $pwd, $add_session_context = true)
    {
        $result = $user === Webctrl::$config['admin']['name'] && password_verify($pwd, Webctrl::$config['admin']['pwd']);

        if ($result && $add_session_context && !$this->is_authorized())
        {
            $_SESSION['auth.authorized'] = true;
            $_SESSION['auth.name'] = Webctrl::$config['admin']['name'];
            $_SESSION['auth.login_date'] = date( "d/m/Y", strtotime( 'now' ) );
        }

        return $result;
    }

    function logout()
    {
        if ($this->is_authorized())
        {
            $_SESSION['auth.authorized'] = false;
            $_SESSION['auth.name'] = null;
            $_SESSION['auth.logout_date'] = date( "d/m/Y", strtotime( 'now' ) );
        }

        return true;
    }

}