<?php

use yii\db\Migration;

class m170303_170727_create_tables extends Migration
{

    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            // http://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%user}}', [
            'id' => $this->primaryKey(),
            'email' => $this->string(32)->unique()->notNull(),
            'password_hash' => $this->string(64)->notNull(),
            'private_token' => $this->string(64)->notNull(),
            'status' => $this->integer()->defaultValue(0),
            'code' => $this->
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ], $tableOptions);

        $this->createTable('{{%email_code}}', [
            'email' => $this->string(32)->notNull(),
            'type' => $this->string(8)->notNull(),
            'code' => $this->string(32)->notNull(),
            'status' => $this->integer()->notNull(),
            'expired_at' => $this->integer()->notNull(),
            'created_at' => $this->integer()->notNull(),
        ], $tableOptions);
    }

    public function down()
    {
        $this->dropTable('{{%user}}');
        $this->dropTable('{{%email_code}}');
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
