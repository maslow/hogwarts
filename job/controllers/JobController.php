<?php
/**
 * Created by PhpStorm.
 * User: maslow
 * Date: 2017/1/23
 * Time: 16:44
 */

namespace app\controllers;

use app\models\API;
use app\models\Job;
use app\models\User;
use yii\data\ActiveDataProvider;
use yii\filters\Cors;
use yii\rest\Controller;
use yii\rest\OptionsAction;
use yii\web\ForbiddenHttpException;
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
     * @param string $courseId
     * @return ActiveDataProvider
     */
    public function actionIndex($courseId)
    {
        $query = Job::find()
            ->where([
                'uid' => \Yii::$app->user->id,
                'course_id' => $courseId
            ]);
        return new ActiveDataProvider(['query' => $query]);
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return array
     * @throws ForbiddenHttpException
     * @throws NotFoundHttpException
     */
    public function actionView($courseId, $chapterId, $sectionId)
    {
        $uid = \Yii::$app->user->id;
        $data = API::getSectionCached($courseId, $chapterId, $sectionId);

        if (!$data)
            throw new NotFoundHttpException("Section not found: $courseId, $chapterId, $sectionId");

        $deps = $data->section->deps;
        $extends = $data->section->extends;
        if (!$deps) $deps = [];
        if (!$extends) $extends = [];
        $deps = array_merge($deps, $extends);
        foreach ($deps as $s) {
            $arr = explode('/', $s);
            $ch = $arr[0];
            $sec = $arr[1];
            /** @var Job $job */
            $job = Job::find()->where([
                'uid' => $uid,
                'course_id' => $courseId,
                'chapter_id' => $ch,
                'section_id' => $sec,
            ])->one();
            if (!$job || $job->status !== Job::JOB_STATUS_PASSED) {
                throw new ForbiddenHttpException("Job cannot be created until all deps been passed: $courseId, $chapterId, $sectionId");
            }
        }

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
            $model->version = $data->section->version;
            if (!$model->save()) {
                \Yii::error($model->getErrors());
                throw new NotFoundHttpException("Object not found: $courseId, $chapterId, $sectionId");
            }
        }

        if (!$model->codesExists())
            $model->prepareJobFiles($extends);

        return [
            'job' => $model,
            'files' => $model->getSrcFiles()
        ];
    }

    /**
     * @param $jobId
     * @param $file
     * @return array
     * @throws NotFoundHttpException
     */
    public function actionFile($jobId, $file)
    {
        $uid = \Yii::$app->user->id;
        /** @var Job $model */
        $model = Job::find()->where([
            'id' => $jobId,
            'uid' => $uid,
        ])->one();

        if (!$model) {
            throw new NotFoundHttpException("Object not found: $jobId, $uid");
        }
        $content = $model->getFileContent($file);
        return [
            'file' => $file,
            'content' => $content,
            'hash' => md5($content),
            'job_id' => $jobId
        ];
    }

    /**
     * @param $jobId
     * @return array
     * @throws NotFoundHttpException
     * @throws ServerErrorHttpException
     */
    public function actionUpdateFile($jobId)
    {
        $uid = \Yii::$app->user->id;
        /** @var Job $model */
        $model = Job::find()->where([
            'id' => $jobId,
            'uid' => $uid,
        ])->one();

        if (!$model) {
            throw new NotFoundHttpException("Object not found: $jobId, $uid");
        }
        $params = \Yii::$app->request->getBodyParams();
        $file = $params['name'];
        $content = $params['content'];
        $hash = $model->setFileContent($file, $content);
        if (!$hash)
            throw new ServerErrorHttpException('Failed to update the File');
        return [
            'file' => $file,
            'hash' => $hash,
            'job_id' => $jobId
        ];
    }

    /**
     * @param \yii\base\Action $action
     * @return bool
     */
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