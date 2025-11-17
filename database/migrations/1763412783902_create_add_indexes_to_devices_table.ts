import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'devices'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['brand'])
      table.index(['state'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['brand'])
      table.dropIndex(['state'])
    })
  }
}
