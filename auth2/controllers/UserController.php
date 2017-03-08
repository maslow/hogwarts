<?php
/**
 * Created by PhpStorm.
 * User: maslow
 * Date: 2017/3/3
 * Time: 16:44
 */

namespace app\controllers;

use app\models\EmailCode;
use app\models\User;
use app\models\Util;
use yii\filters\Cors;
use yii\rest\Controller;
use yii\rest\OptionsAction;
use yii\web\NotFoundHttpException;

/**
 * Class JobController
 * @package app\controllers
 */
class UserController extends Controller
{
    /**
     * @return array
     */
    public function behaviors()
    {
        $behaviors = parent::behaviors();
        // add CORS filter
        $behaviors['corsFilter'] = [
            'class' => Cors::className(),
        ];
        return $behaviors;
    }

    /**
     * @return array
     */
    public function actions()
    {
        return [
            'options' => ['class' => OptionsAction::className()]
        ];
    }

    /**
     * @return array
     */
    public function actionSendSignUpMail()
    {
        $params = \Yii::$app->request->getBodyParams();
        $email = $params['email'];
        //发送注册邮件
        $code = rand(100000, 999999);
        $emailCode = new EmailCode();
        $emailCode->email = $email;
        $emailCode->code = $code;
        $emailCode->type = EmailCode::TYPE_SIGNUP;
        $emailCode->status = EmailCode::STATUS_UNUSED;
        $emailCode->created_at = time();
        $emailCode->expired_at = time() + 60 * 60;
        Util::sendSignUpMail($email, $code);
        if ($emailCode->save())
            return [
                'code' => 0,
                'msg' => 'Sign-up mail had been sent',
                'email' => $email,
            ];
        else
            return $emailCode->getErrors();
    }

    /**
     * @return array
     */
    public function actionSignUp()
    {
        $params = \Yii::$app->request->getBodyParams();
        $email = $params['email'];
        $code = isset($params['code']) ? $params['code'] : null;
        $password = $params['password'];

        $user = new User();

        /** @var EmailCode $emailCode */
        $emailCode = EmailCode::find()
            ->where([
                'email' => $email,
                'type' => EmailCode::TYPE_SIGNUP,
                'code' => $code,
                'status' => EmailCode::STATUS_UNUSED,
            ])->one();

        if (!$emailCode || $emailCode->expired_at >= time()) {
            return [
                'code' => 1,
                'msg' => 'INVALID code'
            ];
        }

        $user->email = $email;
        $user->password_hash = \Yii::$app->security->generatePasswordHash($password);
        $user->private_token = \Yii::$app->security->generateRandomString();
        $user->status = User::USER_STATUS_ACTIVE;
        $user->created_at = time();
        $user->updated_at = time();


    }

    public function actionSignIn()
    {
        $params = \Yii::$app->request->getBodyParams();
        $email = $params['email'];
        $password = $params['password'];

        /** @var User $model */
        $model = User::find()->where([
            'email' => $email
        ])->one();

        if (!$model)
            throw new NotFoundHttpException("Object not found");

        if ($model->status === User::USER_STATUS_INACTIVE)
            return [
                'code' => 2,
                'msg' => '该帐户未激活',
                'email' => $email,
            ];

        if (!\Yii::$app->security->validatePassword($password, $model->password_hash))
            return [
                'code' => 1,
                'msg' => 'Email or password invalid',
            ];

        return [
            'code' => 0,
            'uid' => $model->id,
            'email' => $model->email,
            'access_token' => $model->getAccessToken(time() + 60 * 60 * 24),
        ];
    }

    /**
     * @param \yii\base\Action $action
     * @return bool
     */
//    public function beforeAction($action)
//    {
//        $uid = \Yii::$app->request->headers->get('x-uid');
//        if ($uid) {
//            $user = User::findOne($uid);
//            \Yii::$app->user->login($user);
//        }
//        return parent::beforeAction($action);
//    }
}