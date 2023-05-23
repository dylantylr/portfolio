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
    sherwin,
    rpi,
    carvel,
    carrent,
    jobit,
    tripguide,
    david_goggins,
    shuzo,
    denzel,
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
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Student",
      icon: web,
    },
    {
      title: "Software Engineer",
      icon: mobile,
    },
    {
      title: "Backend Developer",
      icon: backend,
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
      title: "Digital Technology Intern/Co-op",
      company_name: "Sherwin Williams",
      icon: sherwin,
      iconBg: "#383E56",
      date: "March 2023 - August 2023",
      points: [
        "Worked with Senior & Jr. Developers to create a data visualization dashboard using Tableau, SQL, and Python to enhance business metrics analysis and decision-making processes.",
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
        "Provided comprehensive feedback on students’ assignments.",
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
        "Dreams without goals, are just dreams and they ultimately fuel disappointment.",
      name: "Denzel Washington",
      designation: "",
      company: "",
      image: denzel,
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