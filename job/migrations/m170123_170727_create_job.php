<?php

use yii\db\Migration;

class m170123_170727_create_job extends Migration
{

    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            // http://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%job}}', [
            'id' => $this->primaryKey(),
            'uid' => $this->integer()->notNull(),
            'course_id' => $this->string(32)->notNull(),
            'chapter_id' => $this->string(32)->notNull(),
            'section_id' => $this->string(32)->notNull(),
            'status' => $this->integer()->defaultValue(0),
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
            'version' => $this->string(64)->notNull(),
            'codes' => 'json',
            'PRIMARY KEY(id)'
        ], $tableOptions);
    }

    public function down()
    {
        $this->dropTable('{{%job}}');
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
