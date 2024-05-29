import { getServerSession } from 'next-auth/next';
import { type NextRequest } from 'next/server';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';

interface FetchEvent {
  params: {
    communityId: string;
  };
}

export async function GET(request: NextRequest, { params }: FetchEvent) {
  const session = await getServerSession(authOptions);

  return Response.json({ success: true });
}
