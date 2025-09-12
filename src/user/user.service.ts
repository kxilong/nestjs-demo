import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Photo } from 'src/photo/entities/photo.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Photo) private photosRepository: Repository<Photo>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = await this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, user: Partial<User>) {
    return await this.usersRepository.update(id, user);
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
    return this.photosRepository
      .createQueryBuilder('photo')
      .select('photo.code')
      .addSelect('COUNT("photo.code")', 'count')
      .leftJoinAndSelect('photo.user', 'user')
      .where('user.id = :userId', { userId })
      .groupBy('photo.code')
      .orderBy('code', 'DESC')
      .addOrderBy('count', 'DESC')
      .offset(1)
      .limit(2)
      .getRawMany();
  }
}
