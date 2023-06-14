import { TaskStatus } from '../src/app/task/repository.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	return knex.schema.createTable('tasks', (table) => {
		table.increments('id').primary();
		table.integer('user_id').index().references('id').inTable('users').notNullable();
		table
			.enum(
				'status',
				[TaskStatus.PENDING, TaskStatus.STARTED, TaskStatus.COMPLETED, TaskStatus.FAILED],
				{
					useNative: true,
					enumName: 'status_type',
				}
			)
			.notNullable();
		table.jsonb('data').notNullable();
		table.jsonb('result');
		table.timestamp('created_at', { useTz: true }).notNullable();
		table.timestamp('started_at', { useTz: true });
		table.timestamp('completed_at', { useTz: true });
		table.timestamp('failed_at', { useTz: true });
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {};
