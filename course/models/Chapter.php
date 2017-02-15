<?php
/**
 * Created by PhpStorm.
 * User: impower-0022
 * Date: 2017/1/22
 * Time: 10:17
 */

namespace app\models;

use yii\base\InvalidParamException;
use yii\base\Model;
use yii\helpers\Json;

/**
 * Class Chapter
 * @package app\models
 *
 * @property string $id
 * @property string $title
 * @property integer $order
 * @property string $description
 * @property string $version
 */
class Chapter extends Model
{
    public $id;
    public $title;
    public $order;
    public $description;
    public $version;

    public $courseId;

    public static function getPath($courseId, $chapterId)
    {
        $p = join(DIRECTORY_SEPARATOR, [Course::getPath($courseId), $chapterId]);
        if (!file_exists($p))
            throw new InvalidParamException("ERROR: INVALID FILE PATH `$p`");
        return $p;
    }

    /**
     * @param $courseId
     * @return Chapter[]
     */
    public static function findAll($courseId)
    {
        $chapters = Util::getSubDirectories(Course::getPath($courseId));
        $results = [];
        foreach ($chapters as $chapterId)
            if ($ch = self::findOne($courseId, $chapterId))
                array_push($results, $ch);

        usort($results, function ($a, $b) {
            return $a['order'] < $b['order'] ? -1 : 1;
        });
        return $results;
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @return Chapter
     */
    public static function findOne($courseId, $chapterId)
    {
        try {
            $p = self::getPath($courseId, $chapterId);
            $info = self::getJson($p);
        } catch (\Exception $e) {
            return null;
        }
        $ch = new Chapter();
        $ch->id = $chapterId;
        $ch->title = isset($info['title']) ? $info['title'] : 'Untitled';
        $ch->order = isset($info['order']) ? $info['order'] : 0;
        $ch->description = isset($info['description']) ? $info['description'] : '';
        $ch->version = self::getVersion($courseId, $chapterId);
        $ch->courseId = $courseId;
        return $ch;
    }

    /**
     * @param $chapterPath
     * @return array
     */
    protected static function getJson($chapterPath)
    {
        $p = join(DIRECTORY_SEPARATOR, [$chapterPath, 'chapter.json']);
        $data = file_get_contents($p);
        return Json::decode($data, true);
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @param int $cache_duration
     * @return null|string
     */
    public static function getVersion($courseId, $chapterId, $cache_duration = 60)
    {
        $cache = \Yii::$app->cache;
        $key = "chapter.versions.$courseId.$chapterId";
        if (!($version = $cache->get($key))) {
            $path = self::getPath($courseId, $chapterId);
            $version = Util::getGitVersion($path);
            $cache->set($key, $version, $cache_duration);
        }
        return $version;
    }

    /**
     * @return Chapter|null
     */
    public function next()
    {
        $chapters = Chapter::findAll($this->courseId);
        $next = null;
        foreach ($chapters as $ch)
            if ($ch->order > $this->order) {
                $next = $ch;
                break;
            }
        return $next;
    }

    /**
     * @return Chapter|null
     */
    public function prev()
    {
        $chapters = Chapter::findAll($this->courseId);
        $chapters = array_reverse($chapters);
        $prev = null;
        foreach ($chapters as $ch)
            if ($ch->order < $this->order) {
                $prev = $ch;
                break;
            }
        return $prev;
    }
}