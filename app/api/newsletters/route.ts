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
