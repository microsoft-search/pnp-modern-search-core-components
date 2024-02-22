import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { HomepageFeatures, UseCaseSection, PeopleSection } from '@site/src/components/HomepageFeatures';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={`${clsx('hero hero--primary', styles.heroBanner)}`} 
            style={{ 
                backgroundImage: `url("${useBaseUrl('/img/home_bg.jpg')}")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' 
            }}
      >
      <div className="container">
        <ThemedImage
            alt="PnP Logo"
            className="w-28 mb-8"
            sources={{
              light: useBaseUrl('/img/pnp.png'),
              dark: useBaseUrl('/img/pnp.png'),
            }}
        />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation for the PnP Modern Search components">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <UseCaseSection />
        <PeopleSection />
      </main>
    </Layout>
  );
}
