import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: number) {
    return this.locationService.delete(+id);
  }
}
