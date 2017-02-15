<?php

namespace app\models;

use Yii;
use yii\base\InvalidConfigException;
use yii\base\InvalidParamException;
use yii\db\ActiveRecord;
use yii\helpers\FileHelper;
use yii\helpers\StringHelper;

/**
 * This is the model class for table "{{%job}}".
 *
 * @property integer $id
 * @property integer $uid
 * @property string $course_id
 * @property string $chapter_id
 * @property string $section_id
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 * @property string $version
 */
class Job extends ActiveRecord
{
    const JOB_STATUS_CREATED = 0;
    const JOB_STATUS_PASSED = 1;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%job}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['uid', 'course_id', 'chapter_id', 'section_id', 'created_at', 'updated_at', 'version'], 'required'],
            [['uid', 'status', 'created_at', 'updated_at'], 'integer'],
            [['course_id', 'chapter_id', 'section_id'], 'string', 'max' => 32],
            [['version'], 'string', 'max' => 64],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'uid' => 'Uid',
            'course_id' => 'Course ID',
            'chapter_id' => 'Chapter ID',
            'section_id' => 'Section ID',
            'status' => 'Status',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
            'version' => 'Version',
        ];
    }

    /**
     * @return bool
     */
    public function beforeValidate()
    {
        $this->updated_at = time();
        return parent::beforeValidate();
    }

    /**
     * @param $extends
     * @return bool
     */
    public function prepareJobFiles($extends)
    {
        $jobpath = $this->getPath();
        if (file_exists($jobpath))
            return true;

        $basepath = Util::getCoursesBasePath();
        $courseCodesPath = "$basepath/{$this->course_id}/{$this->chapter_id}/{$this->section_id}/codes";
        FileHelper::copyDirectory($courseCodesPath, $jobpath);
        foreach ($extends as $ext) {
            $srcpath = "$basepath/{$this->course_id}/$ext/codes/src";
            FileHelper::copyDirectory($srcpath, "$jobpath/src");
        }
        return true;
    }

    /**
     * @return string
     */
    public function getPath()
    {
        if (empty($this->id))
            throw new InvalidParamException('Job should be inserted into db first');

        return Util::getJobsBasePath() . "/{$this->id}";
    }

    /**
     * @return array
     */
    public function getSrcFiles()
    {
        $path = $this->getPath() . "/src";
        $dirs = FileHelper::findFiles($path);
        return array_map(function ($file) use ($path) {
            $str = str_replace($path, '', $file);
            return str_replace('\\', '/', $str);
        }, $dirs);
    }

    /**
     * @return bool
     */
    public function codesExists()
    {
        return file_exists($this->getPath());
    }

    /**
     * @param $file
     * @return string | null
     */
    public function getFileContent($file)
    {
        $path = $this->getPath() . "/src" . $file;
        if (!$this->isReadSafe($file))
            return null;
        return file_get_contents($path);
    }

    /**
     * @param $file
     * @param $content
     * @return bool
     */
    public function setFileContent($file, $content)
    {
        $path = $this->getPath() . "/src" . $file;
        file_put_contents($path, $content);
        if (!$this->isWriteSafe($file))
            return null;
        return md5_file($path);
    }

    /**
     * @param $file
     * @return bool
     */
    private function isReadSafe($file)
    {
        $files = $this->getSrcFiles();
        return $this->validateFileName($file) && in_array($file, $files);
    }

    /**
     * @param $file
     * @return bool
     */
    private function isWriteSafe($file)
    {
        return $this->validateFileName($file);
    }

    /**
     * @param $file
     * @return bool
     */
    private function validateFileName($file)
    {
        $file = str_replace('\\', '/', $file);
        if (!StringHelper::startsWith($file, '/'))
            return false;
        if (StringHelper::endsWith($file, '/'))
            return false;
        if (strstr($file, '..'))
            return false;
        if (strlen($file) > 255)
            return false;
        return true;
    }
}