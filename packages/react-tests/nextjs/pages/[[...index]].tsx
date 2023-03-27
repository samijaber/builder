import { ALL_PATHNAMES, getAPIKey, getProps } from '@builder.io/sdks-e2e-tests';
import { useRouter } from 'next/router';
import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import { BuilderComponent, builder, Builder } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import { useEffect } from 'react';
import { getCustomComponents } from '@builder.io/sdks-tests-custom-components/output/react/src/index';

builder.init(getAPIKey());

type StaticProps = { index: string[] };

export async function getStaticProps(x: GetStaticPropsContext<StaticProps>) {
  const path = x.params.index ? `/${x.params.index.join('/')}` : '/';
  return { props: { ...getProps(path), customComponents: getCustomComponents(path) } };
}

export function getStaticPaths(): GetStaticPathsResult<StaticProps> {
  return {
    paths: ALL_PATHNAMES.map(path => {
      const output: StaticProps = {
        index: path === '/' ? null : path.split('/').filter(Boolean),
      };

      return { params: output };
    }),
    fallback: true,
  };
}

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

// default to not tracking, and re-enable when appropriate
builder.canTrack = false;

export default function Page(props: PageProps) {
  const router = useRouter();

  props.customComponents.forEach(({ component, ...info }) => {
    Builder.registerComponent(component, info);
  });

  // only enable tracking if we're not in the `/can-track-false` test route
  useEffect(() => {
    if (!router.asPath.includes('can-track-false')) {
      builder.canTrack = true;
    }
  }, []);

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {!props.content && <meta name="robots" content="noindex" />}
      </Head>
      {!props ? <DefaultErrorPage statusCode={404} /> : <BuilderComponent {...props} />}
    </>
  );
}
