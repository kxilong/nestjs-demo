import AppDataSource from '../ormconfig';
import { User } from './user/entities/user.entity';

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...');
    const users = await AppDataSource.manager.find(User);
    console.log('Loaded users: ', users);
  })
  .catch((error) => console.log(error));
