import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as dotenv from 'dotenv';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as crypto from 'crypto';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { PrismaService } from '../prisma/prisma.service';
dotenv.config();

@Injectable()
export class KycService {
  // private readonly veriffApiKey = process.env.VERIFF_API_KEY;
  private readonly veriffApiUrl = 'https://stationapi.veriff.com/v1';
  private readonly apiKey = process.env.API_KEY;
  private readonly apiUrl = 'https://api2.idanalyzer.com/quickscan';

  constructor(private readonly httpService: HttpService,
    private readonly prisma:PrismaService
    ) {}

 
  async createVerificationSession(userData: any): Promise<any> {
    const url = `${this.veriffApiUrl}/sessions`;
    const headers = {
      'Content-Type': 'application/json',
      // 'X-AUTH-CLIENT': this.veriffApiKey,
    };
    const body = {
      verification: {
        callback: 'https://your-callback-url.com',
        vendorData: userData,
        person: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          idNumber: userData.idNumber,
          country: userData.country,
          dateOfBirth: userData.dateOfBirth,
        },
      },
    };

    const response = await firstValueFrom(this.httpService.post(url, body, { headers }));
    return response.data;
  }

  async uploadDocument(sessionId: string, imagePath: string, side: 'front' | 'back'): Promise<any> {
    const url = `${this.veriffApiUrl}/sessions/${sessionId}/media`;
    const headers = {
      'Content-Type': 'multipart/form-data',
      // 'X-AUTH-CLIENT': this.veriffApiKey,
    };
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));
    formData.append('type', `document-${side}`);

    const response = await firstValueFrom(this.httpService.post(url, formData, { headers }));
    return response.data;
  }

  async uploadSelfie(sessionId: string, imagePath: string): Promise<any> {
    const url = `${this.veriffApiUrl}/sessions/${sessionId}/media`;
    const headers = {
      'Content-Type': 'multipart/form-data',
      // 'X-AUTH-CLIENT': this.veriffApiKey,
    };
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));
    formData.append('type', 'selfie');

    const response = await firstValueFrom(this.httpService.post(url, formData, { headers }));
    return response.data;
  }

  async submitVerificationSession(sessionId: string): Promise<any> {
    const url = `${this.veriffApiUrl}/sessions/${sessionId}/submit`;
    const headers = {
      'Content-Type': 'application/json',
      // 'X-AUTH-CLIENT': this.veriffApiKey,
    };

    const response = await firstValueFrom(this.httpService.post(url, {}, { headers }));
    return response.data;
  }

  async getSessionDecision(sessionId: string): Promise<any> {
    const url = `${this.veriffApiUrl}/sessions/${sessionId}/decision`;
    const headers = {
      'Content-Type': 'application/json',
      // 'X-AUTH-CLIENT': this.veriffApiKey,
    };

    const response = await firstValueFrom(this.httpService.get(url, { headers }));
    return response.data;
  }

  async isUserAdult(dateOfBirth: string): Promise<boolean> {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }

  async docVerify(document: Express.Multer.File, documentBack?: Express.Multer.File): Promise<any> {
    const documentBase64 = fs.readFileSync(document.path, 'base64');
    let documentBackBase64 = '';

    if (documentBack) {
      documentBackBase64 = fs.readFileSync(documentBack.path, 'base64');
    }

    const data: any = {
      document: documentBase64,
    };

    if (documentBackBase64) {
      data.documentBack = documentBackBase64;
    }

    const options: AxiosRequestConfig = {
      method: 'POST',
      url: this.apiUrl,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': this.apiKey,
      },
      data: data,
    };

    try {
      const response: AxiosResponse = await axios.request(options);
      const res = response.data;
      const age = res.data.age[0].value;
      if (age>= 19) {
        const userHash = crypto.randomBytes(20).toString('hex')
        const saved_rec = await this.prisma.kyc.create({
          data:{
            age:age,
            hash:userHash
          }
        });
        console.log(saved_rec)
        return {
          "age":age,
          "hash": userHash,
          "user image":`${process.env.ENV}/user-image.jpg`
        }
      }
        else {
          return "User Not Eligible, Age restricted !!!"
        }
      
    } catch (error: any) {
      console.error(error);
      throw new Error('Verification failed');
    } finally {
      // Clean up the uploaded files
      fs.unlinkSync(document.path);
      if (documentBack) {
        fs.unlinkSync(documentBack.path);
      }
    }
  }


  async findDoc(data){
    const dbData =  await this.prisma.kyc.findMany({
      where:{
        hash:data.hash
      }
    }) 
    return {
      ...dbData,
      "user_image":`${process.env.ENV}/user-image.jpg`
    }
  }


}
