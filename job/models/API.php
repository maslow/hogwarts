<?php
/**
 * Created by PhpStorm.
 * Author: Maslow(wangfugen@126.com)
 * Date: 2/13/17
 * Time: 9:55 PM
 */

namespace app\models;


use yii\base\Component;
use yii\helpers\Json;
use yii\httpclient\Client;
use yii\httpclient\Request;

class API extends Component
{

    /**
     * @param $courseId
     * @param $chapterId
     * @param $sectionId
     * @return null | object
     */
    public static function  getSection($courseId, $chapterId, $sectionId){
        $req = self::getCourseServer();
        $req->setUrl("courses/$courseId/$chapterId/$sectionId");
        $res = $req->send();
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
        $client = new Client(['baseUrl' => 'http://localhost:8081']);
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