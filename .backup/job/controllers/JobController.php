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
use yii\web\MethodNotAllowedHttpException;
use yii\web\NotAcceptableHttpException;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

/**
 * Class JobController
 * @package app\controllers
 */
class JobController extends Controller
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
     * @param string $courseId
     * @param null $chapterId
     * @return ActiveDataProvider
     */
    public function actionIndex($courseId = null, $chapterId = null)
    {
        $query = Job::find()
            ->where([
                'uid' => \Yii::$app->user->id,
            ]);
        $query->andFilterWhere([
            'course_id' => $courseId,
            'chapter_id' => $chapterId,
        ]);
        return new ActiveDataProvider(['query' => $query]);
    }

    /**
     * @param $section
     * @return array|null
     */
    private function checkDeps($section)
    {
        $uid = \Yii::$app->user->id;
        $deps = $section->deps;
        $extends = $section->extends;
        if (!$deps) $deps = [];
        if (!$extends) $extends = [];
        $all = array_merge($deps, $extends);

        $rs = [];
        foreach ($all as $s) {
            $arr = explode('/', $s);
            $courseId = $arr[0];
            $chapterId = $arr[1];
            $sectionId = $arr[1];
            /** @var Job $job */
            $job = Job::find()->where([
                'uid' => $uid,
                'course_id' => $courseId,
                'chapter_id' => $chapterId,
                'section_id' => $sectionId,
            ])->one();
            if (!$job || $job->status !== Job::JOB_STATUS_PASSED) {
                array_push($rs, $s);
            }
        }
        if (count($rs)) return $rs;
        return null;
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

        $section = $data->section;

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
            if($deps = $this->checkDeps($section)){
                throw new ForbiddenHttpException(json_encode($deps));
            }

            $model = new Job();
            $model->uid = $uid;
            $model->course_id = $courseId;
            $model->chapter_id = $chapterId;
            $model->section_id = $sectionId;
            $model->status = Job::JOB_STATUS_CREATED;
            $model->created_at = time();
            $model->version = $section->version;
            if (!$model->save()) {
                \Yii::error($model->getErrors());
                throw new NotFoundHttpException("Object not found: $courseId, $chapterId, $sectionId");
            }
        }

        if (!$model->codesExists())
            $model->prepareJobFiles($section->extends);

        return [
            'job' => $model,
            'section' => $data->section,
            'text' => $data->text,
        ];
    }

    /**
     * @param $jobId
     * @return array
     * @throws NotFoundHttpException
     */
    public function actionViewById($jobId)
    {
        $uid = \Yii::$app->user->id;

        /** @var Job $model */
        $model = Job::find()->where([
            'id' => $jobId,
            'uid' => $uid,
        ])->one();

        if (!$model)
            throw new NotFoundHttpException("Object not found: $jobId, $uid");

        $data = API::getSectionCached($model->course_id, $model->chapter_id, $model->section_id);
        if (!$data)
            throw new NotFoundHttpException("Section not found: $model->course_id, $model->chapter_id, $model->section_id");

        return [
            'job' => $model,
            'section' => $data->section,
        ];
    }

    /**
     * @param $jobId
     * @param $status
     * @return Job
     * @throws NotFoundHttpException
     */
    public function actionUpdateStatus($jobId, $status)
    {
        $uid = \Yii::$app->user->id;
        /** @var Job $model */
        $model = Job::find()->where([
            'id' => $jobId,
            'uid' => $uid,
        ])->one();

        if (!$model)
            throw new NotFoundHttpException("Object not found: $jobId, $uid");

        if ($model->status === $status)
            return $model;

        if ($status < 0)
            $model->status = Job::JOB_STATUS_FAILED;
        elseif ($status > 0)
            $model->status = Job::JOB_STATUS_PASSED;
        else
            $model->status = Job::JOB_STATUS_CREATED;

        $model->updated_at = time();

        if (!$model->save()) {
            \Yii::error($model->getErrors());
            throw new NotFoundHttpException("Object not found: $jobId");
        }
        return $model;
    }

    /**
     * @param $jobId
     * @param null $path
     * @return array
     * @throws NotFoundHttpException
     */
    public function actionFiles($jobId, $path = null)
    {
        $uid = \Yii::$app->user->id;

        /** @var Job $model */
        $model = Job::find()->where([
            'id' => $jobId,
            'uid' => $uid,
        ])->one();

        if (!$model)
            throw new NotFoundHttpException("Object not found: $jobId, $uid");

        $path = $path ? base64_decode($path) : '';
        return [
            'job_id' => $jobId,
            'path' => $path,
            'files' => $model->getFiles($path),
        ];
    }

    /**
     * @param $jobId
     * @param $fileId
     * @return array
     * @throws NotFoundHttpException
     * @internal param $file
     */
    public function actionFile($jobId, $fileId)
    {
        $uid = \Yii::$app->user->id;

        /** @var Job $model */
        $model = Job::find()->where([
            'id' => $jobId,
            'uid' => $uid,
        ])->one();

        if (!$model)
            throw new NotFoundHttpException("Object not found: $jobId, $uid");

        $file = base64_decode($fileId);
        $content = $model->getFileContent($file);
        return [
            'file' => $file,
            'id' => $fileId,
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
    public function actionUpdateFile($jobId, $fileId)
    {
        $uid = \Yii::$app->user->id;
        /** @var Job $model */
        $model = Job::find()->where([
            'id' => $jobId,
            'uid' => $uid,
        ])->one();

        if (!$model)
            throw new NotFoundHttpException("Object not found: $jobId, $uid");

        $params = \Yii::$app->request->getBodyParams();
        $file = base64_decode($fileId);
        $content = $params['content'];
        $hash = $model->setFileContent($file, $content);
        if (!$hash)
            throw new ServerErrorHttpException('Failed to update the File');
        return [
            'id' => $fileId,
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