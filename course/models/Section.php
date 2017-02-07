<?php
/**
 * Created by PhpStorm.
 * User: maslow
 * Date: 2017/1/22
 * Time: 10:15
 */

namespace app\models;

use yii\base\Exception;
use yii\base\InvalidConfigException;
use yii\base\InvalidParamException;
use yii\base\Model;
use yii\helpers\Json;

/**
 * Class Section
 * @package app\models
 *
 * @property string $id
 * @property string $title
 * @property integer $order
 * @property string $description
 * @property string $version
 * @property string $lang
 * @property string $tester
 * @property array $extends
 * @property array $deps
 */
class Section extends Model
{
    public $id;
    public $title;
    public $order;
    public $description;
    public $version;
    public $lang;
    public $tester;
    public $extends;
    public $deps;

    public $courseId;
    public $chapterId;

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return string
     */
    public static function getPath($courseId, $chapterId, $sectionId)
    {
        $p = join(DIRECTORY_SEPARATOR, [Chapter::getPath($courseId, $chapterId), $sectionId]);
        if (!file_exists($p))
            throw new InvalidParamException("ERROR: INVALID FILE PATH `$p`");
        return $p;
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @return Section[]
     */
    public static function findAll($courseId, $chapterId)
    {
        $sections = Util::getSubDirectories(Chapter::getPath($courseId, $chapterId));
        $results = [];
        foreach ($sections as $sectionId)
            array_push($results, self::findOne($courseId, $chapterId, $sectionId));
        usort($results, function ($a, $b) {
            return $a['order'] < $b['order'] ? -1 : 1;
        });
        return $results;
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return Section|null
     */
    public static function findOne($courseId, $chapterId, $sectionId)
    {
        try {
            $p = self::getPath($courseId, $chapterId, $sectionId);
            $data = self::getJson($p);
        } catch (\Exception $e) {
            return null;
        }
        $section = new Section();
        $section->id = $sectionId;
        $section->title = isset($data['title']) ? $data['title'] : 'Untitled';
        $section->description = isset($data['description']) ? $data['description'] : '';
        $section->order = isset($data['order']) ? $data['order'] : 0;
        $section->lang = isset($data['lang']) ? $data['lang'] : '';
        $section->tester = isset($data['tester']) ? $data['tester'] : '';
        $section->extends = isset($data['extends']) ? $data['extends'] : [];
        $section->deps = isset($data['deps']) ? $data['deps'] : [];
        $section->version = self::getVersion($courseId, $chapterId, $sectionId);
        $section->courseId = $courseId;
        $section->chapterId = $chapterId;
        return $section;
    }

    /**
     * @param $sectionPath
     * @return array
     */
    protected static function getJson($sectionPath)
    {
        $p = $sectionPath . DIRECTORY_SEPARATOR . 'section.json';
        $data = file_get_contents($p);
        return Json::decode($data, true);
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return null|string
     */
    public static function getVersion($courseId, $chapterId, $sectionId)
    {
        $cache = \Yii::$app->cache;
        $key = "section.versions.$courseId.$chapterId.$sectionId";
        if (!$version = $cache->get($key)) {
            $path = self::getPath($courseId, $chapterId, $sectionId);
            if ($version = Util::getGitVersion($path))
                $cache->set($key, $version, 60);
        }
        return $version;
    }

    /**
     * @return Chapter
     */
    public function chapter()
    {
        return Chapter::findOne($this->courseId, $this->chapterId);
    }

    /**
     * @return Course
     */
    public function course()
    {
        return Course::findOne($this->courseId);
    }

    /**
     * @return Section|null
     */
    public function next()
    {
        // 获取下一小节
        $sections = self::findAll($this->courseId, $this->chapterId);
        $next = null;
        foreach ($sections as $section)
            if ($section->order > $this->order) {
                $next = $section;
                break;
            }

        if ($next) return $next;

        // 获取下一章的第一小节
        $nextChapter = $this->chapter()->next();
        if (!$nextChapter) return null;

        $nextChapterSections = self::findAll($nextChapter->courseId, $nextChapter->id);
        return array_shift($nextChapterSections);
    }

    /**
     * @return Section|null
     */
    public function prev()
    {
        // 获取上一小节
        $sections = self::findAll($this->courseId, $this->chapterId);
        $sections = array_reverse($sections);
        $prev = null;
        foreach ($sections as $section)
            if ($section->order < $this->order) {
                $prev = $section;
                break;
            }
        if ($prev) return $prev;

        // 获取上一章的最后一小节
        $prevChapter = $this->chapter()->prev();
        if (!$prevChapter) return null;

        $prevChapterSections = self::findAll($prevChapter->courseId, $prevChapter->id);
        return array_pop($prevChapterSections);
    }

    /**
     * @return string
     */
    public function text()
    {
        $p = self::getPath($this->courseId, $this->chapterId, $this->id) . DIRECTORY_SEPARATOR . 'doc.md';
        return file_get_contents($p);
    }
}