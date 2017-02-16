<?php
/**
 * Created by PhpStorm.
 * User: impower-0022
 * Date: 2017/1/20
 * Time: 9:57
 */

namespace app\controllers;

use app\models\Chapter;
use app\models\Course;
use app\models\CourseTag;
use app\models\Section;
use app\models\Tag;
use app\models\User;
use yii\data\ActiveDataProvider;
use yii\db\ActiveQuery;
use yii\filters\Cors;
use yii\helpers\Url;
use yii\rest\Controller;
use yii\rest\OptionsAction;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

class CourseController extends Controller
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
        $query = Course::find()
            ->leftJoin('course_tag', 'course.id = course_tag.course_id')
            ->leftJoin('tag', 'tag.id = course_tag.tag_id');
        $query->orFilterWhere(['like', 'tag.label', trim($tag)]);
        return new ActiveDataProvider(['query' => $query]);
    }

    /**
     * @return Course
     * @throws ServerErrorHttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionCreate()
    {
        $model = new Course();
        $model->load(\Yii::$app->request->getBodyParams(), '');
        if ($model->save()) {
            $response = \Yii::$app->response;
            $response->setStatusCode(201);
            $response->headers->set('Location', Url::toRoute(['view', 'id' => $model->id], true));
            return Course::findOne($model->id);
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to create the object for unknown reason');
        }
        return $model;
    }

    /**
     * @param $id
     * @return array
     * @throws NotFoundHttpException
     */
    public function actionView($id)
    {
        /** @var Course $model */
        if (!$model = Course::findOne($id))
            throw new NotFoundHttpException("Object not found: $id");

        return [
            'course' => $model,
            'chapters' => Chapter::findAll($id)
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
        /** @var Course $model */
        if (!$model = Course::findOne($id))
            throw new NotFoundHttpException("Object not found: $id");
        $model->load(\Yii::$app->request->getBodyParams(), '');
        if (!$model->save() && !$model->hasErrors())
            throw new ServerErrorHttpException('Failed to update the object for unknown reason');
        return $model;
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @return array
     * @throws NotFoundHttpException
     */
    public function actionChapter($courseId, $chapterId)
    {
        if (!$model = Chapter::findOne($courseId, $chapterId))
            throw new NotFoundHttpException("Object not found: $chapterId");
        return [
            'chapter' => $model,
            'sections' => Section::findAll($courseId, $chapterId),
        ];
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @return Chapter|null
     * @throws NotFoundHttpException
     */
    public function actionNextChapter($courseId, $chapterId)
    {
        if (!$model = Chapter::findOne($courseId, $chapterId))
            throw new NotFoundHttpException("Object not found: $chapterId");
        return $model->next();
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @return Chapter|null
     * @throws NotFoundHttpException
     */
    public function actionPrevChapter($courseId, $chapterId)
    {
        if (!$model = Chapter::findOne($courseId, $chapterId))
            throw new NotFoundHttpException("Object not found: $chapterId");
        return $model->prev();
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return array
     * @throws NotFoundHttpException
     */
    public function actionSection($courseId, $chapterId, $sectionId)
    {
        if (!$model = Section::findOne($courseId, $chapterId, $sectionId))
            throw new NotFoundHttpException("Object not found: $sectionId");
        return [
            'section' => $model,
            'text' => $model->text()
        ];
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return Section|null
     * @throws NotFoundHttpException
     */
    public function actionNextSection($courseId, $chapterId, $sectionId){
        if (!$model = Section::findOne($courseId, $chapterId, $sectionId))
            throw new NotFoundHttpException("Object not found: $sectionId");
        return $model->next();
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return Section|null
     * @throws NotFoundHttpException
     */
    public function actionPrevSection($courseId, $chapterId, $sectionId){
        if (!$model = Section::findOne($courseId, $chapterId, $sectionId))
            throw new NotFoundHttpException("Object not found: $sectionId");
        return $model->prev();
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