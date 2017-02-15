<?php
/**
 * Created by PhpStorm.
 * User: impower-0022
 * Date: 2017/1/22
 * Time: 13:36
 */

namespace app\models;


use Yii;
use yii\base\InvalidConfigException;

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
        $output = null;
        $return_val = -1;
        exec("git log -n 1 --pretty=format:%H $path", $output, $return_val);
        return $return_val ? null : array_pop($output);
    }

    /**
     * @return bool|string
     * @throws InvalidConfigException
     */
    public static function getCoursesBasePath()
    {
        if (!($coursesPath = Yii::$app->params['courses_base_path'])) {
            throw new InvalidConfigException('CONFIG ERROR: `courses_base_path` missing');
        }
        return Yii::getAlias($coursesPath);
    }

    /**
     * @return bool|string
     * @throws InvalidConfigException
     */
    public static function getJobsBasePath()
    {
        if (!($jobsPath = Yii::$app->params['job_base_path'])) {
            throw new InvalidConfigException('CONFIG ERROR: `jobs_base_path` missing');
        }
        return Yii::getAlias($jobsPath);
    }
}