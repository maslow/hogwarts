<?php

namespace app\models;

use Yii;
use yii\base\InvalidConfigException;
use yii\base\InvalidParamException;
use yii\db\ActiveRecord;
use yii\helpers\FileHelper;

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
 * @property string $codes
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
            [['codes'], 'string'],
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
            'codes' => 'Codes',
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
     * @param bool $insert
     * @return bool
     */
    public function beforeSave($insert)
    {
        if ($insert) {
            $this->prepareJobFiles();
        }
        return parent::beforeSave($insert);
    }

    /**
     * @return bool
     */
    protected function prepareJobFiles()
    {
        if (empty($this->uid) || empty($this->course_id) || empty($this->chapter_id) || empty($this->section_id)) {
            throw new InvalidParamException();
        }
        $jobpath = $this->getPath();
        if (file_exists($jobpath))
            return true;
        $srcpath = self::getCoursesBasePath() . "/{$this->course_id}/{$this->chapter_id}/{$this->section_id}/codes";
        FileHelper::copyDirectory($srcpath, $jobpath);
        return true;
    }

    /**
     * @return string
     */
    public function getPath()
    {
        return self::getJobsBasePath() . "/{$this->uid}/{$this->course_id}/{$this->chapter_id}/{$this->section_id}";
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
     * @param $file
     * @return array
     */
    public function getFileContent($file)
    {
        $path = $this->getPath() . "/src" . $file;
        if (!$this->existAndSafeFile($file))
            return [
                'content' => null,
                'hash' => null
            ];
        return [
            'content' => file_get_contents($path),
            'hash' => md5_file($path)
        ];
    }

    /**
     * @param $file
     * @return bool
     */
    private function existAndSafeFile($file)
    {
        $files = $this->getSrcFiles();
        return in_array($file, $files);
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
        if (!$this->existAndSafeFile($file))
            return null;
        return md5_file($path);
    }

    /**
     * @return bool|string
     * @throws InvalidConfigException
     */
    protected static function getCoursesBasePath()
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
    protected static function getJobsBasePath()
    {
        if (!($jobsPath = Yii::$app->params['job_base_path'])) {
            throw new InvalidConfigException('CONFIG ERROR: `jobs_base_path` missing');
        }
        return Yii::getAlias($jobsPath);
    }
}