import { InternalServerErrorException } from '@nestjs/common';
import { ArrayContains, Like } from 'typeorm';
import { Product } from '../entities';
import type { UpdateResponse } from 'src/@types';
import type { DataSource, FindOptionsSelect, FindOptionsRelations } from 'typeorm';
import type { CreateProductDto } from '../dtos/create-product.dto';
import type { UpdateProductDto } from '../dtos/update-product.dto';
import type { ProductWhere } from '../interfaces';
import type { IProductRepository } from '../interfaces';

const selectOptions: FindOptionsSelect<Product> = {
  id: true,
  name: true,
  price: true,
  availableCount: true,
  soldCount: true,
  description: true,
  content: true,
};

const relationOptions: FindOptionsRelations<Product> = {
  categories: {
    category: true,
  },
};

export const ProductRepository = Symbol('PRODUCT_REPOSITORY');

export const ProductRepositoryFactory =
  (dataSource: DataSource): IProductRepository => dataSource.getRepository(Product).extend({
    async findAllBy(query: ProductWhere): Promise<Product[]> {
      try {
        return await this.find({
          select: selectOptions,
          relations: relationOptions,
          where: {
            name: Like(`${query.name}%`),
            categories: ArrayContains(query.categories),
          },
          order: {
            id: 'asc',
          },
          skip: query.skip,
          take: query.take,
        });
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },

    async findOneById(id: number): Promise<Product | null> {
      try {
        return await this.findOne({
          select: selectOptions,
          relations: relationOptions,
          where: { id },
        });
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },

    async createOne(createProductDto: CreateProductDto): Promise<Product> {
      try {
        const product = await this.create({
          name: createProductDto.name,
          price: createProductDto.price,
          availableCount: createProductDto.availableCount,
          soldCount: createProductDto.soldCount,
          description: createProductDto.description,
          content: createProductDto.content,
        });

        const newProduct = await this.save(product);

        return newProduct;
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },

    async updateOne(product: Product, updateProductDto: UpdateProductDto): Promise<UpdateResponse> {
      try {
        await this.merge(product, {});

        return {
          message: 'The product was updated successfully',
          id: updateProductDto.price as number, updatedAt: 'sometime',
        };
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },

    async deleteOne(product: Product): Promise<void> {
      try {
        await this.remove(product);
      } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    },
  });
