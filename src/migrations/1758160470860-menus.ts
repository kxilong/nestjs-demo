import { MigrationInterface, QueryRunner } from 'typeorm';

export class Menus1758160470860 implements MigrationInterface {
  name = 'Menus1758160470860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`role_menus\` (\`menuId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_b447ba2d495fdf8e4a489afa3f\` (\`menuId\`), INDEX \`IDX_1edf55a2d483f8aa59ea943a77\` (\`roleId\`), PRIMARY KEY (\`menuId\`, \`roleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_b447ba2d495fdf8e4a489afa3fc\` FOREIGN KEY (\`menuId\`) REFERENCES \`menu\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_1edf55a2d483f8aa59ea943a771\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_1edf55a2d483f8aa59ea943a771\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_b447ba2d495fdf8e4a489afa3fc\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1edf55a2d483f8aa59ea943a77\` ON \`role_menus\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b447ba2d495fdf8e4a489afa3f\` ON \`role_menus\``,
    );
    await queryRunner.query(`DROP TABLE \`role_menus\``);
  }
}
