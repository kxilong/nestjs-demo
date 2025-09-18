import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getUserDto } from './dto/query-user.dto';
import { conditionUtils } from 'src/utils/db.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findAll(query: getUserDto): Promise<User[]> {
    const { page, limit, name } = query;
    const take = limit || 10;
    const currentPage = page || 1;
    // return this.usersRepository.find({
    //   select: {
    //     id: true,
    //     name: true,
    //   },
    //   where: { name },
    //   relations: {
    //     profile: true,
    //   },
    //   skip: (page - 1) * take,
    //   take,
    // });
    const obj = {
      'user.name': name,
    };
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');
    const newQuery = conditionUtils<User>(queryBuilder, obj);
    return newQuery
      .take(take)
      .skip((currentPage - 1) * take)
      .getMany();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByName(name: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ name });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = await this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, user: Partial<User>) {
    const data = await this.usersRepository.findOneBy({ id });
    if (!data) {
      throw new Error(`User with id ${id} not found`);
    }
    const mergeData = this.usersRepository.merge(data, user);
    return await this.usersRepository.update(id, mergeData);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findUserProfile(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  findUserWithPhotos(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['photos'],
    });
  }

  findCountByUserId(userId: number) {
    return 111;
  }
}
