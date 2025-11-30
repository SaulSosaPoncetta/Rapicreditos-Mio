import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

// http://localhost:3000/rapicreditos
@Controller('rapicreditos')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // http://localhost:3000/rapicreditos/login
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.mail, dto.password);
  }
}
