<?php
/**
 * Created by PhpStorm.
 * Author: Maslow(wangfugen@126.com)
 * Date: 03/03/2017
 * Time: 5:22 PM
 */

namespace app\models;

use yii\base\InvalidConfigException;

/**
 * Class Util
 * @package app\models
 */
class Util
{
    /**
     * @return mixed
     * @throws InvalidConfigException
     */
    public static function getTokenSalt()
    {
        $params = \Yii::$app->params;
        if (!isset($params['access_token_salt']))
            throw new InvalidConfigException('CONFIG ERROR: access_token_salt is missing');
        return $params['access_token_salt'];
    }

    /**
     * @param $email
     * @param $content
     * @return bool
     */
    public static function sendSignUpMail($email, $content)
    {
        \Yii::trace("send sign-up email to $email with content: $content", 'EMAIL');
        return true;
    }
}