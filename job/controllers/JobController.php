<?php
/**
 * Created by PhpStorm.
 * User: maslow
 * Date: 2017/1/23
 * Time: 16:44
 */

namespace app\controllers;

use app\models\Job;
use app\models\User;
use yii\data\ActiveDataProvider;
use yii\filters\Cors;
use yii\helpers\Url;
use yii\rest\Controller;
use yii\rest\OptionsAction;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

class JobController extends Controller
{
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
     * @param string|null $tag
     * @return ActiveDataProvider
     */
    public function actionIndex($tag = null)
    {
//        $query = Course::find()
//            ->rightJoin('course_tag', 'course.id = course_tag.course_id')
//            ->rightJoin('tag', 'tag.id = course_tag.tag_id');
//        $query->orFilterWhere(['like', 'tag.label', trim($tag)]);
//        return new ActiveDataProvider(['query' => $query]);
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return array
     * @throws NotFoundHttpException
     */
    public function actionView($courseId, $chapterId, $sectionId)
    {
        $uid = \Yii::$app->user->id;
        /** @var Job $model */
        $query = Job::find()
            ->where([
                'uid' => $uid,
                'course_id' => $courseId,
                'chapter_id' => $chapterId,
                'section_id' => $sectionId,
            ]);

        $model = $query->one();
        if (!$model) {
            $model = new Job();
            $model->uid = $uid;
            $model->course_id = $courseId;
            $model->chapter_id = $chapterId;
            $model->section_id = $sectionId;
            $model->status = Job::JOB_STATUS_CREATED;
            $model->created_at = time();
            $model->version = 'REVERSED';
            if (!$model->save()) {
                \Yii::error($model->getErrors());
                throw new NotFoundHttpException("Object not found: $courseId, $chapterId, $sectionId");
            }
        }

        return [
            'job' => $model,
            'files' => $model->getSrcFiles()
        ];
    }

    /**
     * @param $id
     * @return Course
     * @throws NotFoundHttpException
     * @throws ServerErrorHttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate($id)
    {
//        /** @var Course $model */
//        if (!$model = Course::findOne($id))
//            throw new NotFoundHttpException("Object not found: $id");
//        $model->load(\Yii::$app->request->getBodyParams(), '');
//        if (!$model->save() && !$model->hasErrors())
//            throw new ServerErrorHttpException('Failed to update the object for unknown reason');
//        return $model;
    }

    public function beforeAction($action)
    {
        $uid = \Yii::$app->request->headers->get('x-uid');
        if ($uid) {
            $user = new User();
            $user->id = $uid;
            \Yii::$app->user->login($user);
        }
        return parent::beforeAction($action);
    }
}