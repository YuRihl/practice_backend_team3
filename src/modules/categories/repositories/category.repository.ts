import { InternalServerErrorException } from '@nestjs/common';
import type { UpdateResponse } from 'src/@types';
import type { DataSource, ObjectLiteral } from 'typeorm';
import type { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { Category } from '../entities';
import type { ICategoryRepository } from '../interfaces';

export const CategoryRepository = Symbol('CATEGORY_REPOSITORY');

export const CategoryRepositoryFactory =
  (dataSource: DataSource): ICategoryRepository => dataSource.getRepository(Category).extend({
    async findAll(): Promise<Category[]> {
      try {
        return await this.find({
          select: {
            id: true,
            name: true,
          },
        });
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },

    async findOneById(id: number): Promise<Category | null> {
      try {
        return await this.findOne({
          select: {
            id: true,
            name: true,
          },
          where: {
            id,
          },
        });
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },

    async createOne(createCategoryDto: CreateCategoryDto): Promise<Category> {
      try {

        const { identifiers } = await this.upsert(createCategoryDto, ['name']);

        return await this.findOneById({ id: (identifiers[0] as ObjectLiteral).id as number }) as Category;
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },

    async updateOne(category: Category, updateCategoryDto: UpdateCategoryDto): Promise<UpdateResponse> {
      try {
        const mergedCategory = await this.merge(category, updateCategoryDto);

        const { id: updatedId, updatedAt } = await this.save(mergedCategory);

        return { message: 'Category was updated successfully', id: updatedId, updatedAt: updatedAt.toISOString() };
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },

    async deleteOne(category: Category): Promise<void> {
      try {
        await this.remove(category);
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },
  });
