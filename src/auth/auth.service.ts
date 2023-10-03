import { Injectable } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAccount(email: string, password: string): Promise<any> {
    const account = await this.accountService.findOneByEmail(email);

    if (account && (await bcrypt.compare(password, account.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = account;
      return result;
    }

    return null;
  }

  async validateJwt(id: string): Promise<any> {
    const account = await this.accountService.findOne(id);

    if (account) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = account;
      return result;
    }

    return null;
  }

  async login(account: any) {
    const payload = { email: account.email, id: account.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
