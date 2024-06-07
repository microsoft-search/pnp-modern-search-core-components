import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

const FeatureList = [
  {
    title: "I'm a contributor",
    Svg: require('@site/static/img/contributor_role.svg').default,
    description: (
      <>
        Contribute and maintain this awesome projet.
      </>
    ),
    link: "/docs/category/development-guide"
  },
  {
    title: "I'm a developer",
    Svg: require('@site/static/img/developer_role.svg').default,
    description: (
      <>
        Integrate the search components into your application.
      </>
    ),
    link: "https://azpnpmodernsearchcoresto.z9.web.core.windows.net/latest/index.html?path=/docs/introduction-getting-started--docs"
  },
  {
    title: "I'm a SharePoint super user",
    Svg: require('@site/static/img/end_user_role.svg').default,
    description: (
      <>
        Provide awesome search experiences in your SharePoint site.
      </>
    ),
    link: "/docs/category/sharepoint-web-parts"
  }
];

function Feature({Svg, title, description, link}) {
  return (
    <Link to={link} className="hover:no-underline">
    <div className="rounded-lg min-h-[380px] p-4 border-primary border-2 hover:bg-primary text-homeLink hover:text-white border-solid hover:scale-[1.02] ease-in duration-200">
     
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <span className="font-bold text-2xl">{title}</span>
          <p>{description}</p>
        </div>
     
    </div>
    </Link>
  );
}

export function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="grid grid-cols-3 auto-cols-auto gap-4">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function UseCaseSection() {
  return (
    <section className="bg-emphasis">
      <div className="container p-14 flex justify-center align-center flex-col text-center y-space-4">
          
          <div className="text-black">
            <p className="font-bold text-2xl">Want to know the story behind these components?</p>

            <p className="text-black-600/25">These components are the open source version of components made by Ubisoft for their Microsoft Search implementation project in 2023</p>
            <ThemedImage
              alt="Ubisoft Logo"
              className="w-28 mb-8"
              sources={{
                light: useBaseUrl('/img/ubisoft.png'),
                light: useBaseUrl('/img/ubisoft.png'),
              }}
            />
          </div>
          
          <div>
            <a href="https://microsoft-search.github.io/pnp-modern-search-core-components/assets/ubisoft_microsoft-search-implementation_use_case.pdf" target="_blank">
              <button className="text-2xl rounded-lg bg-primary font-bold border-none p-6 text-white hover:cursor-pointer">📖 Read the implementation use case</button> 
            </a>
          </div>
      </div>
    </section>
  );
}

const PeopleList = [
  {
    thumbnailUrl: "https://www.franckcornu.com/images/author_hu9b02e0e5fa61fa4710f0e85bb0f4dbed_853600_1110x0_resize_q90_h2_box_3.webp",
    profileUrl: "https://www.linkedin.com/in/franckcornu/",
    name: 'Franck Cornu',
    role: 'Maintainer',
    title: "Microsoft 365 developer @Ubisoft Montréal and Microsoft MVP"
  },
  {
    thumbnailUrl: "https://cdn-icons-png.flaticon.com/512/4123/4123763.png",
    profileUrl: "/docs/category/development-guide",
    name: 'You?',
    role: 'Maintainer/Contributor',
    title: ""
  }
];

function Person({thumbnailUrl, profileUrl, name, role, title}) {
  return (
    <a href={profileUrl} target="_blank" className="hover:no-underline">
      <div className="text-homeLink p-4">
          <img className="rounded-full w-24" src={thumbnailUrl}/>
          <div className="flex flex-col justify-center text-center">
            <div className="font-bold">{name}</div>
            <small className="mt-[.25rem]">{role}</small>
            <small className="mt-[.25rem]">{title}</small>
          </div>
      </div>
    </a>
  );
}

export function PeopleSection() {
  return (
    <section className="bg-white">
      <div className="container p-14 flex justify-center align-center flex-col text-center y-space-4">
        <div className="font-bold text-2xl mb-4 text-black">People behind this project</div>
        <div className="grid grid-cols-2 auto-cols-auto gap-4">
          {PeopleList.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            }).map((props, idx) => (
            <Person key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

