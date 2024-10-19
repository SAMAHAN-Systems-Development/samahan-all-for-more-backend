// supabase.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { generateUniqueFileName } from '../src/utils/datefns';
import { LoginDto } from 'src/auth/auth.dto';
@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor() {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseAPIKey = process.env.SUPABASE_KEY;
    this.supabase = createClient(supabaseURL, supabaseAPIKey);
  }

  getSupabase() {
    return this.supabase;
  }

  async signInSupabaseUser(loginData: LoginDto): Promise<any> {
    const { email, password } = loginData;
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return data;
  }

  async signOutSupabaseUser() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new HttpException(
        'Failed to sign out',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCurrentUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) {
      throw new HttpException('Invalid Credentials', HttpStatus.FORBIDDEN);
    }
    return user;
  }

  async createSupabaseUser(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Handle Supabase signup error
      throw new Error(`Supabase signup failed: ${error.message}`);
    }

    return data;
  }
  async uploadPdftoDb(pdfAttachment: Express.Multer.File) {
    const uniqueFilename = generateUniqueFileName(pdfAttachment.originalname);

    const { error } = await this.supabase.storage
      .from(process.env.STORAGE_BUCKET)
      .upload(uniqueFilename, pdfAttachment.buffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true,
      });
    const getUrl = await this.supabase.storage
      .from(process.env.STORAGE_BUCKET)
      .getPublicUrl(uniqueFilename);
    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    return getUrl.data.publicUrl;
  }

  async uploadPosterToBucket(file: Express.Multer.File): Promise<string> {
    const fileName = generateUniqueFileName(file.originalname);
    const { error } = await this.supabase.storage
      .from(process.env.POSTER_IMAGE_BUCKET)
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) {
      console.error('Failed to upload to bucket:', error);
      throw new Error('Failed to upload poster image');
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from('posterImages').getPublicUrl(fileName);

    if (!publicUrl) {
      throw new Error('Failed to retrieve public URL for poster');
    }

    return publicUrl;
  }

  // FiletoBase64(file: Express.Multer.File) {
  //   let fileToBase64;
  //   try {
  //     fileToBase64 = Buffer.from(file.buffer).toString('base64');
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  //   return fileToBase64;
  // }

  // async uploadImageToDB(file: Express.Multer.File, uuid: string) {
  //   const bucketName = 'payment';
  //   // the generated file name when
  //   // image is uploaded to supabase
  //   const file_name = `${uuid}_receipt.png`;
  //   const payment_path = `${bucketName}${file_name}`;
  //   // converts file to base64 string
  //   // supabase has limitations in uploading files
  //   // without converting to Base64, causes uploaded file to be incorrectly
  //   // uploaded with missing details in supabase
  //   const base64 = this.FiletoBase64(file);
  //   try {
  //     await this.supabase.storage
  //       .from(bucketName)
  //       .upload(file_name, decode(base64), {
  //         contentType: 'image/jpg',
  //       });
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  //   return payment_path;
  // }
}
