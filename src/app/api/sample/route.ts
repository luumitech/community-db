import { getServerSession } from 'next-auth/next';
import { NextResponse, type NextRequest } from 'next/server';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';

interface FetchEvent {
  params: {
    communityId: string;
  };
}

/**
 * For more details, see:
 * See https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
export async function GET(request: NextRequest, { params }: FetchEvent) {
  const session = await getServerSession(authOptions);
  // const { searchParams } = req.nextUrl;
  // const query = searchParams.get('arg');

  return NextResponse.json({ success: true });
}
