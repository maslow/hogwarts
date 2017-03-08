<?php

namespace app\models;

/**
 * This is the model class for table "{{%email_code}}".
 *
 * @property string $email
 * @property string $type
 * @property string $code
 * @property integer $status
 * @property integer $expired_at
 * @property integer $created_at
 */
class EmailCode extends \yii\db\ActiveRecord
{
    const STATUS_UNUSED = 0;
    const STATUS_USED = 1;

    const TYPE_SIGNUP = 'signup';
    const TYPE_MOD_PASSWD = 'mod_passwd';
    const TYPE_RESET_PASSWD = 'reset_passwd';

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%email_code}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['email', 'type', 'code', 'status', 'expired_at', 'created_at'], 'required'],
            [['expired_at', 'status', 'created_at'], 'integer'],
            ['email', 'email'],
            [['type'], 'string', 'max' => 8],
            [['code', 'email'], 'string', 'max' => 32],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'uid' => 'Uid',
            'type' => 'Type',
            'code' => 'Code',
            'expired_at' => 'Expired At',
            'created_at' => 'Created At',
        ];
    }
}
