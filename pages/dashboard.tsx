import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { checkProviderToken, checkSession } from "../services/checkAuth";

export default function Dashboard() {
  return (
    <>
      <p>
        [<Link href="/">Home</Link>] | [
        <Link href="/profil">getServerSideProps</Link>]
      </p>
      <div>Protected content</div>
      <p>server-side fetched data with RLS:</p>
      <p>user:</p>
      <pre></pre>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const redirectNoProvider = await checkProviderToken(ctx);
  if (redirectNoProvider) {
    return redirectNoProvider;
  }
  const redirectNoSession = await checkSession(ctx);
  if (redirectNoSession) {
    return redirectNoSession;
  }

  return {
    props: {},
  };
};
