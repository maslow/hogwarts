<?php

use yii\db\Migration;

class m170119_095627_create_course extends Migration
{

    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            // http://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%course}}', [
            'id' => $this->string(36),
            'uid' => $this->integer()->notNull(),
            'title' => $this->string(32)->notNull(),
            'description' => $this->string(64)->defaultValue(''),
            'status' => $this->string(16)->defaultValue('created'),
            'created_at' => $this->integer()->notNull(),
            'PRIMARY KEY(id)'
        ], $tableOptions);

        $this->createTable('{{%tag}}', [
            'id' => $this->primaryKey(),
            'label' => $this->string(32)->unique()->notNull()
        ], $tableOptions);

        $this->createTable('{{%course_tag}}', [
            'course_id' => $this->string(36)->notNull(),
            'tag_id' => $this->integer()->notNull(),
            'CONSTRAINT pk_course_tag PRIMARY KEY (course_id, tag_id)'
        ], $tableOptions);
    }

    public function down()
    {
        $this->dropTable('{{%course_tag}}');
        $this->dropTable('{{%tag}}');
        $this->dropTable('{{%course}}');
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
