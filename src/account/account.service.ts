import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<string> {
    const { email, fullname, password } = createAccountDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const account = new Account();
    account.email = email;
    account.fullname = fullname;
    account.password = hashedPassword;

    try {
      await this.accountRepository.save(account);
    } catch (error) {
      throw new ConflictException();
    }

    return account.id;
  }

  async findOne(id: string) {
    return await this.accountRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return this.accountRepository.findOne({ where: { email } });
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const { fullname } = updateAccountDto;

    const account = await this.accountRepository.findOneBy({ id });

    if (!account) {
      throw new NotFoundException();
    }

    account.fullname = fullname;

    await this.accountRepository.save(account);

    return account.id;
  }

  async remove(id: string) {
    const account = await this.accountRepository.findOneBy({ id });

    if (!account) {
      throw new NotFoundException();
    }

    await this.accountRepository.delete(account.id);

    return {};
  }
}
