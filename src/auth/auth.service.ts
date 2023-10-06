import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Account } from 'src/account/entities/account.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private configService: ConfigService,
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

  async generateAccessToken(account: Account): Promise<string> {
    const payload = { email: account.email, id: account.id };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  async generateRefreshToken(account: Account): Promise<string> {
    const payload = { id: account.id };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }

  async validateUserFromRefreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      return await this.validateJwt(decoded.id);
    } catch (e) {
      return null;
    }
  }

  async refreshToken(refreshToken: string) {
    const account = await this.validateUserFromRefreshToken(refreshToken);

    if (!account) {
      throw new UnauthorizedException('Invalid token');
    }

    const accessToken = await this.generateAccessToken(account);

    return accessToken;
  }
}
