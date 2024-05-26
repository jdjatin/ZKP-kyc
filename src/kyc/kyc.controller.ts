import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { KycService } from './kyc.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';


@Controller('kyc')
export class KycController {

    constructor(private readonly veriffService: KycService) {}

    @Post('create-session')
  async createSession(@Body() userData: any) {
    return this.veriffService.createVerificationSession(userData);
  }

  @Post('upload-document/:sessionId')
  async uploadDocument(
    @Param('sessionId') sessionId: string,
    @Body('imagePath') imagePath: string,
    @Body('side') side: 'front' | 'back',
  ) {
    return this.veriffService.uploadDocument(sessionId, imagePath, side);
  }

  @Post('upload-selfie/:sessionId')
  async uploadSelfie(@Param('sessionId') sessionId: string, @Body('imagePath') imagePath: string) {
    return this.veriffService.uploadSelfie(sessionId, imagePath);
  }

  @Post('submit-session/:sessionId')
  async submitSession(@Param('sessionId') sessionId: string) {
    return this.veriffService.submitVerificationSession(sessionId);
  }

  @Get('session-decision/:sessionId')
  async getSessionDecision(@Param('sessionId') sessionId: string) {
    return this.veriffService.getSessionDecision(sessionId);
  }

  @Post('check-age')
  async checkAge(@Body('dateOfBirth') dateOfBirth: string) {
    const isAdult = await this.veriffService.isUserAdult(dateOfBirth);
    return { isAdult };
  }

  @Post('doc-verify')
  @UseInterceptors(FilesInterceptor('files', 2, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async docVerify(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (files.length !== 2) {
      throw new Error('Two files are required: front and back of the document.');
    }
    const [document, documentBack] = files;
    return this.veriffService.docVerify(document, documentBack);
  }

  @Get('doc-details')
  async getDoc(@Body() data){
    return await this.veriffService.findDoc(data)
  }

}
