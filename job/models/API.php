<?php
/**
 * Created by PhpStorm.
 * Author: Maslow(wangfugen@126.com)
 * Date: 2/13/17
 * Time: 9:55 PM
 */

namespace app\models;

use yii\base\Component;
use yii\httpclient\Client;
use yii\httpclient\Request;

class API extends Component
{
    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @param int $cache_duration
     * @return mixed|null|object
     */
    public static function getSectionCached($courseId, $chapterId, $sectionId, $cache_duration = 60){
        $cache = \Yii::$app->cache;
        $cache_key = "jobs+course:$courseId+chapter:$chapterId+section:$sectionId";
        if (!($data = $cache->get($cache_key))) {
            $data = self::getSection($courseId, $chapterId, $sectionId);
            $cache->set($cache_key, $data, $cache_duration);
        }
        return $data;
    }

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return null | object
     */
    public static function  getSection($courseId, $chapterId, $sectionId){
        \Yii::beginProfile("$courseId, $chapterId, $sectionId", __METHOD__);
        $req = self::getCourseServer();
        $req->setUrl("courses/$courseId/$chapterId/$sectionId");
        $res = $req->send();
        \Yii::endProfile("$courseId, $chapterId, $sectionId", __METHOD__);
        if($res->statusCode == '200'){
            return json_decode($res->content);
        }else{
            return null;
        }
    }

    /**
     * @return Request
     */
    public static function getCourseServer(){
        $client = new Client(['baseUrl' => 'http://localhost:8001']);
        $req = $client->createRequest()
            ->addHeaders(['x-uid' => self::getUid()])
            ->setFormat(Client::FORMAT_JSON);
        return $req;
    }

    /**
     * @return int|string
     */
    public static function getUid(){
        return \Yii::$app->user->id;
    }
}