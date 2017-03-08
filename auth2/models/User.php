<?php

namespace app\models;

use yii\web\IdentityInterface;

/**
 * This is the model class for table "{{%user}}".
 *
 * @property integer $id
 * @property string $email
 * @property string $password_hash
 * @property string $private_token
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 */
class User extends \yii\db\ActiveRecord implements IdentityInterface
{
    const USER_STATUS_INACTIVE = 0;
    const USER_STATUS_ACTIVE = 1;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%user}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['email', 'password_hash', 'private_token', 'created_at', 'updated_at'], 'required'],
            [['status', 'created_at', 'updated_at'], 'integer'],
            [['email'], 'string', 'max' => 32],
            [['email'], 'email'],
            [['password_hash', 'private_token'], 'string', 'max' => 64],
            [['email'], 'unique'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'email' => 'Email',
            'password_hash' => 'Password Hash',
            'private_token' => 'Private Token',
            'status' => 'Status',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    public function fields()
    {
        return [
            'id', 'email', 'created_at', 'updated_at'
        ];
    }

    /**
     * Finds an identity by the given ID.
     * @param string|int $id the ID to be looked for
     * @return IdentityInterface the identity object that matches the given ID.
     * Null should be returned if such an identity cannot be found
     * or the identity is not in an active state (disabled, deleted, etc.)
     */
    public static function findIdentity($id)
    {
        return static::findOne($id);
    }

    /**
     * Finds an identity by the given token.
     * @param mixed $token the token to be looked for
     * @param mixed $type the type of the token. The value of this parameter depends on the implementation.
     * For example, [[\yii\filters\auth\HttpBearerAuth]] will set this parameter to be `yii\filters\auth\HttpBearerAuth`.
     * @return IdentityInterface the identity object that matches the given token.
     * Null should be returned if such an identity cannot be found
     * or the identity is not in an active state (disabled, deleted, etc.)
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        $arr = self::parseAccessToken($token);
        if (!$arr)
            return null;
        $uid = $arr['uid'];
        $signature = $arr['signature'];
        $payload = $arr['payload'];

        $user = static::findOne($uid);
        if (!$user) return null;

        $key = Util::getTokenSalt() . $user->private_token;
        if (md5($payload . $key) === $signature)
            return $user;

        return null;
    }

    /**
     * Returns an ID that can uniquely identify a user identity.
     * @return string|int an ID that uniquely identifies a user identity.
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Returns a key that can be used to check the validity of a given identity ID.
     *
     * The key should be unique for each individual user, and should be persistent
     * so that it can be used to check the validity of the user identity.
     *
     * The space of such keys should be big enough to defeat potential identity attacks.
     *
     * This is required if [[User::enableAutoLogin]] is enabled.
     * @return string a key that is used to check the validity of a given identity ID.
     * @see validateAuthKey()
     */
    public function getAuthKey()
    {
        // TODO
    }

    /**
     * Validates the given auth key.
     *
     * This is required if [[User::enableAutoLogin]] is enabled.
     * @param string $authKey the given auth key
     * @return bool whether the given auth key is valid.
     * @see getAuthKey()
     */
    public function validateAuthKey($authKey)
    {
        // TODO
    }

    /**
     * @param $expire
     * @return string
     */
    public function getAccessToken($expire)
    {
        $key = Util::getTokenSalt() . $this->private_token;
        $payload = [
            'uid' => $this->id,
            'expire' => $expire,
        ];
        $payloadStr = json_encode($payload);
        $payloadBase64 = base64_encode($payloadStr);
        $signature = md5($payloadBase64 . $key);
        return $payloadBase64 . $signature;
    }

    /**
     * @param $token
     * @return array|null
     */
    public function parseAccessToken($token)
    {
        $pair = explode('.', $token);
        if (count($pair) !== 2)
            return null;
        $payloadBase64 = $pair[0];
        $signature = $pair[1];
        $payloadStr = base64_decode($payloadBase64);
        try {
            $payload = json_decode($payloadStr);
        } catch (\Exception $e) {
            return null;
        }
        if (!isset($payload['uid']))
            return null;

        if (!isset($payload['expire']))
            return null;

        if ($payload['expire'] > time())
            return null;

        return [
            'uid' => $payload['uid'],
            'payload' => $payloadBase64,
            'signature' => $signature,
        ];
    }
}
