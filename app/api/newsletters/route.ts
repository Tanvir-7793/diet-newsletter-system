import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    // Fetch all images from the 'newsletters' folder
    const result = await cloudinary.search
      .expression('folder:newsletters')
      .with_field('context')
      .sort_by('created_at', 'desc')
      .execute();

    const newsletters = result.resources.map((resource: any) => ({
      id: resource.public_id,
      url: resource.secure_url,
      title: resource.context?.custom?.title || 'Untitled Newsletter',
      type: resource.context?.custom?.type || 'download',
      createdAt: resource.created_at,
    }));

    return NextResponse.json({ newsletters });
  } catch (error) {
    console.error('Cloudinary fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Newsletter ID is required' }, { status: 400 });
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(id);

    return NextResponse.json({ success: true, message: 'Newsletter deleted successfully' });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ error: 'Failed to delete newsletter' }, { status: 500 });
  }
}
