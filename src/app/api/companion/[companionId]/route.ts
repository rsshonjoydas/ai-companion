import { auth, currentUser } from '@clerk/nextjs';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkSubscription } from '@/lib/subscription';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function PATCH(req: Request, { params }: { params: { companionId: string } }) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src: newImageSrc, name, description, instructions, seed, categoryId } = body;

    if (!params.companionId) {
      return new NextResponse('Companion ID required', { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!newImageSrc || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const isPro = await checkSubscription();

    if (!isPro) {
      return new NextResponse('Pro subscription required', { status: 403 });
    }

    // Fetch the existing companion data to get the old image URL
    const existingCompanion = await prismadb.companion.findUnique({
      where: {
        id: params.companionId,
        userId: user.id,
      },
    });

    if (!existingCompanion) {
      return new NextResponse('Companion not found', { status: 404 });
    }

    // Check if the new image URL is different from the old one
    if (newImageSrc !== existingCompanion.src) {
      // Extract the public ID (filename without extension) from the existing image URL
      const publicId = existingCompanion.src.replace(/^.*\//, '').replace(/\.[^/.]+$/, '');

      // Delete the old image from Cloudinary using the extracted public ID
      await cloudinary.uploader.destroy(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER_NAME}/${publicId}`
      );
    }

    // Update the companion in the Prisma database with the new data, including the new image URL
    const updatedCompanion = await prismadb.companion.update({
      where: {
        id: params.companionId,
        userId: user.id,
      },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src: newImageSrc,
        name,
        description,
        instructions,
        seed,
      },
    });

    return NextResponse.json(updatedCompanion);
  } catch (error) {
    console.log('[COMPANION_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { companionId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch the companion data before deleting it
    const companion = await prismadb.companion.findUnique({
      where: {
        userId,
        id: params.companionId,
      },
    });

    if (!companion) {
      return new NextResponse('Companion not found', { status: 404 });
    }

    // Delete the companion from the Prisma database
    await prismadb.companion.delete({
      where: {
        userId,
        id: params.companionId,
      },
    });

    // Extract the public ID (filename) of the image from the companion data
    const publicId = companion.src.replace(/^.*\//, '').replace(/\.[^/.]+$/, '');

    // Delete the image from Cloudinary using the public ID
    await cloudinary.uploader.destroy(
      `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER_NAME}/${publicId}`
    );

    return NextResponse.json(companion);
  } catch (error) {
    console.log('[COMPANION_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
