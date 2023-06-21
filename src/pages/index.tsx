import { api } from "@/utils/api";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>T3 Template</title>
        <meta name="description" content="T3 template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="bg-gray-500 text-4xl text-white">T3 Template</h1>
      <h2 className="bg-gray-200 text-2xl">tRPC</h2>
      <p>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</p>
      <h2 className="bg-gray-200 text-2xl">AuthShowcase</h2>
      <AuthShowcase />
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );
  return (
    <>
      <p>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </>
  );
};
