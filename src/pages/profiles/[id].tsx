import ssgHelper from "@/server/api/ssgHelper";
import { api } from "@/utils/api";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import ErrorPage from "next/error";
import Head from "next/head";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  if (id === undefined) {
    return <ErrorPage statusCode={404} />;
  }
  const { data: profile } = api.profile.getById.useQuery({ id });
  if (profile === null || profile === undefined) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <>
      <Head>
        <title>{`Twitter clone - ${profile.name}`}</title>
      </Head>
      {profile.name}
    </>
  );
};
export default ProfilePage;

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;
  if (id === null || id === undefined) {
    return { redirect: { destination: "/" } };
  }
  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}
