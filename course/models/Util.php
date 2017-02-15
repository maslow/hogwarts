<?php
/**
 * Created by PhpStorm.
 * User: impower-0022
 * Date: 2017/1/22
 * Time: 13:36
 */

namespace app\models;


class Util
{
    /**
     * @param $directory string
     * @return array
     */
    public static function getSubDirectories($directory)
    {
        $dirs = [];
        $dir = dir($directory);
        while ($file = $dir->read())
            if ((is_dir("$directory/$file")) AND ($file != ".") AND ($file != ".."))
                array_push($dirs, $file);
        $dir->close();
        return $dirs;
    }

    /**
     * @param $path
     * @return string|null
     */
    public static function getGitVersion($path)
    {
        \Yii::beginProfile("$path", __METHOD__);
        $output = null;
        $return_val = -1;
        exec("git log -n 1 --pretty=format:%H $path", $output, $return_val);
        \Yii::endProfile("$path", __METHOD__);
        return $return_val ? null : array_pop($output);
    }
}