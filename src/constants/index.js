import {
    mobile,
    backend,
    creator,
    web,
    css,
    docker,
    tableau,
    git,
    html,
    javascript,
    java,
    matlab,
    r,
    c,
    sql,
    cpp,
    python,
    atlassian,
    sherwin,
    rpi,
    carrent,
    jobit,
    tripguide,
    david_goggins,
    shuzo,
    tyler,
  } from "../assets";

  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
  ];

  export const contactLinks = [
    {
      id: "email",
      title: "Email",
      href: "mailto:dylnbtylr@gmail.com",
      external: false,
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      href: "https://www.linkedin.com/in/dylntylr",
      external: true,
    },
  ];

  // Lives in public/, so the path stays relative to work under the
  // /portfolio/ base path on GitHub Pages.
  export const resumeUrl = "/Dylan_Taylor_Resume.pdf";

  export const metrics = [
    {
      value: "83%",
      label:
        "Cut off FedRAMP service onboarding, from 60 developer-days to under 10",
    },
    {
      value: "125+",
      label:
        "Pull requests consolidating config checks across an 80GB+ monorepo",
    },
    {
      value: "$14K/mo",
      label:
        "Infrastructure spend reclaimed by automating stale policy cleanup",
    },
  ];

  export const focusAreas = [
    "Backend engineering",
    "Platform & developer tooling",
    "SDK design",
    "Regulated cloud (FedRAMP)",
    "CI/CD & release automation",
    "Data & BI",
  ];


  const services = [
    {
      title: "Software Engineer",
      icon: web,
    },
    {
      title: "Backend Developer",
      icon: backend,
    },
    {
      title: "Platform & Cloud",
      icon: mobile,
    },
    {
      title: "Data Analyst",
      icon: creator,
    },
  ];

  const technologies = [
    {
      name: "Python",
      icon: python,
    },
    {
      name: "C++",
      icon: cpp,
    },
    {
      name: "SQL",
      icon: sql,
    },
    {
      name: "C",
      icon: c,
    },
    {
      name: "R",
      icon: r,
    },
    {
      name: "Java",
      icon: java,
    },
    {
      name: "Matlab",
      icon: matlab,
    },
    {
      name: "Tableau",
      icon: tableau,
    },
    {
      name: "git",
      icon: git,
    },
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "docker",
      icon: docker,
    },
  ];

  const experiences = [
    {
      title: "Software Engineer",
      company_name: "Atlassian",
      icon: atlassian,
      iconBg: "#383E56",
      date: "July 2025 - Present",
      points: [
        "Cut regulated-cloud (FedRAMP) service onboarding by 83% - from 60 developer-days to under 10 - by co-developing an LLM-based AI-agent automation pilot, since adopted org-wide as the default onboarding workflow.",
        "Drove adoption of a centralized environment-configuration platform across an 80GB+ frontend monorepo, authoring and merging 125+ pull requests to consolidate scattered, error-prone checks onto a shared SDK.",
        "Designed and built a Java backend SDK adopted across multiple services, giving them one consistent interface for environment-aware decisions with automated releases through built-in CI/CD pipelines.",
        "Accelerated go-live for government and enterprise customers, provisioning production and staging environments and resolving onboarding across SSO/IdP integration, domain verification, and org-admin setup.",
      ],
    },
    {
      title: "Software Engineering Intern",
      company_name: "Atlassian",
      icon: atlassian,
      iconBg: "#383E56",
      date: "May 2024 - August 2024",
      points: [
        "Owned an end-to-end feature from design through implementation, testing, and rollout: a CLI-driven automation for cleaning up Bring Your Own Key (BYOK) encryption policies.",
        "Reclaimed up to $14K per month in RDS infrastructure spend by automating deletion of stale encryption policies across test environments.",
        "Designed and implemented a RESTful API in Kotlin and Spring Boot for policy retrieval and deletion, backed by a Go command-line tool with unit and acceptance tests.",
      ],
    },
    {
      title: "Digital Technology Intern/Co-op",
      company_name: "Sherwin Williams",
      icon: sherwin,
      iconBg: "#383E56",
      date: "March 2023 - August 2023",
      points: [
        "Built a dynamic Tableau workbook analyzing the company's entire Tableau Server content - hundreds of dashboards and datasets - to deliver enterprise-wide usage insights.",
        "Consolidated BI tool documentation and tutorials into a centralized SharePoint hub, streamlining onboarding for the Enterprise Data Organization.",
        "Worked across Python, SQL, Snowflake, Tableau, MicroStrategy, and Dataiku.",
      ],
    },
    {
      title: "CAD Teaching Assistant",
      company_name: "Rensselaer Polytechnic Institute",
      icon: rpi,
      iconBg: "#E6DEDD",
      date: "January 2022 - December 2022",
      points: [
        "Educated 50 undergraduate students weekly on the fundamentals of CAD software.",
        "Provided comprehensive feedback on students' assignments.",
        "Conducted weekly office hours to work through questions students had.",
      ],
    },
  ];

  const testimonials = [
    {
      testimonial:
        "Nobody cares what you did yesterday. What have you done today to better yourself?",
      name: "David Goggins",
      designation: "",
      company: "",
      image: david_goggins,
    },
    {
      testimonial:
        "In that case, hold on for dear life! Stake your entire life in here and now!",
      name: "Shuzo Matsuoka",
      designation: "",
      company: "",
      image: shuzo,
    },
    {
      testimonial:
        "It’s only after we’ve lost everything that we’re free to do anything.",
      name: "Tyler Durden",
      designation: "",
      company: "",
      image: tyler,
    },
  ];

  const projects = [
    {
      name: "Meta Back-End Developer Professional Certificate",
      description:
        "The Meta Back-End Developer Certificate is awarded to learners who complete a series of courses on back-end development, hosted by Coursera. The courses culminate in the successful completion of a capstone project.",
      tags: [
        {
          name: "Django",
          color: "blue-text-gradient",
        },
        {
          name: "APIs",
          color: "green-text-gradient",
        },
        {
          name: "MySQL",
          color: "pink-text-gradient",
        },
      ],
      image: carrent,
      source_code_link: "https://coursera.org/share/f99548cdb5936763a9132e2390e459b7",
    },
    {
      name: "Microsoft Certified: Azure AI Fundamentals",
      description:
        "Earners of the Azure AI Fundamentals certification have demonstrated foundational knowledge of machine learning (ML) and artificial intelligence (AI) concepts and related Microsoft Azure services.",
      tags: [
        {
          name: "Machine Learning",
          color: "blue-text-gradient",
        },
        {
          name: "AI",
          color: "green-text-gradient",
        },
        {
          name: "Computer Vision",
          color: "pink-text-gradient",
        },
      ],
      image: tripguide,
      source_code_link: "https://www.credly.com/badges/11e14ca9-608b-440b-a40a-d05b5d21af82/public_url",
    },
    {
      name: "Microsoft Certified: Azure Fundamentals",
      description:
        "Earners of the Azure Fundamentals certification have demonstrated foundational level knowledge of cloud services and how those services are provided with Microsoft Azure.",
      tags: [
        {
          name: "Azure",
          color: "blue-text-gradient",
        },
        {
          name: "Cloud Services",
          color: "green-text-gradient",
        },
        {
          name: "Cloud Concepts",
          color: "pink-text-gradient",
        },
      ],
      image: jobit,
      source_code_link: "https://www.credly.com/badges/94411b42-911d-4bd7-bca4-536ba7d701d4/public_url",
    },
  ];

  export { services, technologies, experiences, testimonials, projects };
