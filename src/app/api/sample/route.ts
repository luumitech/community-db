import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from '~/api/auth/[...better]/auth';

interface FetchEvent {
  params: {
    communityId: string;
  };
}

/**
 * For more details, see:
 *
 * https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
export async function GET(request: NextRequest, { params }: FetchEvent) {
  const { headers } = request;
  const session = await getServerSession(headers);
  // const { searchParams } = req.nextUrl;
  // const query = searchParams.get('arg');

  return NextResponse.json({ success: true });
}
