import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) { }
  async create(createUser: Prisma.DashboardCreateInput) {
    return this.databaseService.dashboard.create({
      data: createUser
    });
  }

  async findAll(name?: string) {
    let where: {
      OR?: {
        firstName?: { contains: string; mode: "insensitive" };
        lastName?: { contains: string; mode: "insensitive" };
        middleName?: { contains: string; mode: "insensitive" };
      }[];
    } = {};

    if (name) {
      where = {
        OR: [
          {
            firstName: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            middleName: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      };
    }

    return this.databaseService.dashboard.findMany({
      where
    });
  }

  findOne(id: number) {

    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: Prisma.DashboardUpdateInput) {
    return this.databaseService.dashboard.update({
      where: { id },
      data: updateUserDto
    });
  }

  async removeMany(ids: string[]) {
    return this.databaseService.dashboard.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
