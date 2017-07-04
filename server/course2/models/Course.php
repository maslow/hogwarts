<?php

namespace app\models;

use yii\base\InvalidConfigException;
use yii\base\InvalidParamException;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%course}}".
 *
 * @property string $id
 * @property integer $uid
 * @property string $title
 * @property string $description
 * @property string $status
 * @property integer $created_at
 *
 * @property Tag[] tags
 */
class Course extends ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%course}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'uid', 'title', 'created_at'], 'required'],
            [['uid', 'created_at'], 'integer'],
            [['id', 'title'], 'string', 'max' => 32],
            [['description'], 'string', 'max' => 64],
            [['status'], 'string', 'max' => 16],
            [['title', 'id'], 'unique']
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
            'title' => 'Title',
            'description' => 'Description',
            'status' => 'Status',
            'created_at' => 'Created At',
        ];
    }

    public function fields()
    {
        $fields = parent::fields();
        return array_merge($fields, [
            'tags'
        ]);
    }

    /**
     * @return bool
     */
    public function beforeValidate()
    {
        $this->created_at = time();
        $this->uid = \Yii::$app->user->id;
        return parent::beforeValidate();
    }

    /**
     * @return string
     * @throws InvalidConfigException
     */
    public static function getCoursesBasePath()
    {
        $p = \Yii::$app->params['courses_base_path'];
        if (!$p || !file_exists(\Yii::getAlias($p)))
            throw new InvalidConfigException("CONFIG ERROR: courses_base_path is INVALID");
        return \Yii::getAlias($p);
    }

    /**
     * @param $courseId
     * @return string
     */
    public static function getPath($courseId)
    {
        $p = join(DIRECTORY_SEPARATOR, [static::getCoursesBasePath(), $courseId]);
        if (!file_exists($p))
            throw new InvalidParamException("ERROR: INVALID FILE PATH `$p`");
        return $p;
    }

    /**
     * @return ActiveQuery
     */
    public function getTags()
    {
        return $this
            ->hasMany(Tag::className(), ['id' => 'tag_id'])
            ->viaTable('{{%course_tag}}', ['course_id' => 'id']);
    }
}
