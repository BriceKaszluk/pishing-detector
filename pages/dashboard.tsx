import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <p>
        [<Link href="/">Home</Link>] | [
        <Link href="/profile">getServerSideProps</Link>]
      </p>
      <div>Protected content</div>
      <p>server-side fetched data with RLS:</p>
      <p>user:</p>
      <pre></pre>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const isConnected = query.isConnected;
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && !isConnected)
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };

    return {
      props: {},
    };
};
