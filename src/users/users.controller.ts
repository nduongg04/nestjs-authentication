import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

	@Post('delete-all')
	deleteAll() {
		return this.usersService.deleteAll();
	}
}
