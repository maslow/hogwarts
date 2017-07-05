<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%course_tag}}".
 *
 * @property integer $course_id
 * @property integer $tag_id
 *
 * @property Tag $tag
 */
class CourseTag extends ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%course_tag}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['course_id', 'tag_id'], 'required'],
            [['course_id', 'tag_id'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'course_id' => 'Course ID',
            'tag_id' => 'Tag ID',
        ];
    }

    public function fields()
    {
        return array_merge(parent::fields(), ['tag']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTag(){
        return $this->hasMany(Tag::className(), ['id' => 'tag_id']);
    }
}
