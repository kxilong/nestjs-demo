import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private ProfilesRepository: Repository<Profile>,
  ) {}

  findCountByUserId() {
    return this.ProfilesRepository.createQueryBuilder('profile').getCount();
  }
}
