<?php

$params = require(__DIR__ . '/params.php');

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => '!@#3764%DFFd$#65JH$@%!@K64753^*$&^^%%^$%192fDdDJsaIKFDSadF837',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            'enableSession' => false
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
                [
                    'class' => 'yii\rest\UrlRule',
                    'controller' => 'course',
                    'tokens' => [
                        '{id}' => '<id:[\\w]+>'
                    ],
                    'extraPatterns' => [
                        'GET <courseId>/<chapterId>/<sectionId>' => 'section',
                        'OPTIONS <courseId>/<chapterId>/<sectionId>' => 'options',
                        'GET <courseId>/<chapterId>' => 'chapter',
                        'OPTIONS <courseId>/<chapterId>' => 'options',
                        'GET <courseId>/<chapterId>/<sectionId>/next' => 'next-section',
                        'OPTIONS <courseId>/<chapterId>/<sectionId>/next' => 'options',
                        'GET <courseId>/<chapterId>/<sectionId>/prev' => 'prev-section',
                        'OPTIONS <courseId>/<chapterId>/<sectionId>/prev' => 'options',
                        'GET <courseId>/<chapterId>/next' => 'next-section',
                        'OPTIONS <courseId>/<chapterId>/next' => 'options',
                        'GET <courseId>/<chapterId>/prev' => 'prev-section',
                        'OPTIONS <courseId>/<chapterId>/prev' => 'options',
                    ],
                ],
            ],
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
    ];
}

return $config;
