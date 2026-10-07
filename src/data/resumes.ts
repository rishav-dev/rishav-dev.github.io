/* Generated from the category resumes (Word files). Each entry is one resume, in the order it is listed on /resume. */

export interface ResumeEducation { school: string; dates: string; degree: string; place: string }
export interface ResumeExperience { org: string; role: string; dates: string; place: string; bullets: string[] }
export interface ResumeProject { name: string; tools: string; context: string; bullets: string[] }
export interface ResumeSkill { label: string; items: string }
export interface ResumeHonor { name: string; text: string }

export interface ResumeVariant {
  slug: string;
  number: string;
  title: string;
  description: string;
  header: { name: string; location: string; contact: string[] };
  education: ResumeEducation[];
  coursework: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkill[];
  honors: ResumeHonor[];
  pdf: string;
  docx: string;
}

export const RESUMES: ResumeVariant[] = [
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Intro to Quantitative Analysis",
      "Text as Data",
      "Data Science Fundamentals",
      "Applied Statistics",
      "Data Visualization",
      "SQL & Database Management",
      "Regression & Predictive Modeling",
      "Time Series Forecasting",
      "Research Design"
    ],
    "experience": [
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "Zad Holding Company Q.P.S.C.",
        "role": "Data Analytics Intern",
        "dates": "Mar. 2021 - Aug. 2021",
        "place": "Doha, Qatar",
        "bullets": [
          "Built datasets, database structures, and Power BI reporting workflows to support operational analysis and reduce manual reporting.",
          "Completed a client analytics project for Ooredoo Qatar using customer usage data, statistical inference, and Power BI to develop a mobile data-plan recommendation."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      },
      {
        "org": "ProDose",
        "role": "Product Manager",
        "dates": "Sep. 2026 - Present",
        "place": "Amherst, MA",
        "bullets": [
          "Lead product development for a smart medication dispenser with a five-person UMass Mechanical & Industrial Engineering senior capstone team.",
          "Translate product requirements into CAD, 3D-printed prototypes, test plans, design refinements, and manufacturability decisions."
        ]
      }
    ],
    "projects": [
      {
        "name": "Mental Health Signal on Reddit",
        "tools": "Python, NLP, scikit-learn, Transformers, Plotly Dash",
        "context": "UMass Amherst",
        "bullets": [
          "Collected and analyzed 25,886 posts and comments from three mental-health communities; compared three sentiment methods and three classifiers, conducted topic analysis, and built an interactive dashboard."
        ]
      },
      {
        "name": "Campus Safety Alerts Dataset",
        "tools": "Python, BeautifulSoup, pdfminer.six, requests",
        "context": "UMass Amherst",
        "bullets": [
          "Built source-specific scrapers for 10 universities and standardized 519 HTML/PDF safety documents into a traceable multi-source dataset."
        ]
      },
      {
        "name": "Evolution of the Billboard Hot 100",
        "tools": "D3.js, Three.js, JavaScript, Python",
        "context": "UMass Amherst",
        "bullets": [
          "Joined Billboard chart history with Spotify audio features and built an interactive scrollytelling analysis covering 24 years of popular music."
        ]
      }
    ],
    "skills": [
      {
        "label": "Languages",
        "items": "Python, R, SQL, JavaScript"
      },
      {
        "label": "Analytics / BI",
        "items": "Power BI, Pandas, NumPy, Statistical Analysis, Regression, Time Series, KPI Reporting"
      },
      {
        "label": "Data / Visualization",
        "items": "Microsoft SQL Server, MongoDB, Plotly Dash, D3.js, Matplotlib, Web Scraping"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      },
      {
        "name": "UPitch Spring 2026 Second Place - Karnah",
        "text": "Awarded second place and a $750 prize at UMass Amherst."
      }
    ],
    "slug": "data-analyst-bi",
    "number": "01",
    "title": "Data Analyst / BI",
    "description": "Dashboards, KPI reporting, SQL and statistical analysis, built around consulting analytics and Power BI work.",
    "pdf": "/resumes/Rishav_Chakravarty_Data_Analyst_BI.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Data_Analyst_BI.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Machine Learning for Social Scientists",
      "Text as Data",
      "Data Science Fundamentals",
      "Causal Inference",
      "Network Inference",
      "Regression & Predictive Modeling",
      "Model Tuning & Validation",
      "Applied Statistics",
      "Python for Data Science"
    ],
    "experience": [
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "Google Developer Student Clubs",
        "role": "Featured Speaker - AI for Mental Health",
        "dates": "Aug. 2023 - Nov. 2023",
        "place": "Blacksburg, VA",
        "bullets": [
          "Presented applications of machine learning for personalized mental-health interventions to 150+ participants.",
          "Built supporting Power BI visualizations and discussed the use of behavioral science and data-driven methods in health technology."
        ]
      },
      {
        "org": "Intercare Therapy, Inc.",
        "role": "Behavioral Health Technician",
        "dates": "Jan. 2025 - Jun. 2025",
        "place": "San Diego, CA",
        "bullets": [
          "Collected and reviewed behavioral data during ABA sessions and used client progress to inform session-level adjustments under clinical supervision.",
          "Implemented reinforcement schedules, prompt fading, and task analysis while maintaining HIPAA requirements and coordinating with caregivers."
        ]
      },
      {
        "org": "Zad Holding Company Q.P.S.C.",
        "role": "Data Analytics Intern",
        "dates": "Mar. 2021 - Aug. 2021",
        "place": "Doha, Qatar",
        "bullets": [
          "Built datasets, database structures, and Power BI reporting workflows to support operational analysis and reduce manual reporting.",
          "Completed a client analytics project for Ooredoo Qatar using customer usage data, statistical inference, and Power BI to develop a mobile data-plan recommendation."
        ]
      }
    ],
    "projects": [
      {
        "name": "Mental Health Signal on Reddit",
        "tools": "Python, NLP, scikit-learn, Transformers, Plotly Dash",
        "context": "UMass Amherst",
        "bullets": [
          "Collected and analyzed 25,886 posts and comments from three mental-health communities; compared three sentiment methods and three classifiers, conducted topic analysis, and built an interactive dashboard."
        ]
      },
      {
        "name": "Face Recognition Software",
        "tools": "Python, TensorFlow, Computer Vision",
        "context": "Independent",
        "bullets": [
          "Built a deep-learning face-detection system that reached 93% accuracy after hyperparameter tuning and reduced inference time by 25% with GPU acceleration."
        ]
      },
      {
        "name": "Dynamic Pricing Model for ReCell",
        "tools": "Python, Linear Regression, EDA",
        "context": "UT Austin",
        "bullets": [
          "Developed a regression-based pricing model on 20,000+ refurbished-device sales and identified key drivers of resale value."
        ]
      }
    ],
    "skills": [
      {
        "label": "Languages",
        "items": "Python, R, SQL, JavaScript"
      },
      {
        "label": "Machine Learning",
        "items": "scikit-learn, TensorFlow, Transformers, NLTK, Classification, Clustering, Regression, Model Tuning"
      },
      {
        "label": "Data / Tools",
        "items": "Pandas, NumPy, MongoDB, Power BI, Plotly Dash, Git, Docker"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      },
      {
        "name": "UPitch Spring 2026 Second Place - Karnah",
        "text": "Awarded second place and a $750 prize at UMass Amherst."
      }
    ],
    "slug": "data-science-applied-ml",
    "number": "02",
    "title": "Data Science / Applied ML",
    "description": "Machine learning, NLP and modeling projects, including a face-recognition system and a pricing model.",
    "pdf": "/resumes/Rishav_Chakravarty_Data_Science_Applied_ML.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Data_Science_Applied_ML.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Data Science Fundamentals",
      "Text as Data",
      "Social Media Analysis",
      "SQL & Database Management",
      "Python for Data Science",
      "Exploratory Data Analysis",
      "Data Visualization",
      "Research Design",
      "Machine Learning for Social Scientists"
    ],
    "experience": [
      {
        "org": "Zad Holding Company Q.P.S.C.",
        "role": "Data Analytics Intern",
        "dates": "Mar. 2021 - Aug. 2021",
        "place": "Doha, Qatar",
        "bullets": [
          "Built datasets, database structures, and Power BI reporting workflows to support operational analysis and reduce manual reporting.",
          "Completed a client analytics project for Ooredoo Qatar using customer usage data, statistical inference, and Power BI to develop a mobile data-plan recommendation."
        ]
      },
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "ProDose",
        "role": "Product Manager",
        "dates": "Sep. 2026 - Present",
        "place": "Amherst, MA",
        "bullets": [
          "Lead product development for a smart medication dispenser with a five-person UMass Mechanical & Industrial Engineering senior capstone team.",
          "Translate product requirements into CAD, 3D-printed prototypes, test plans, design refinements, and manufacturability decisions."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      }
    ],
    "projects": [
      {
        "name": "Campus Safety Alerts Dataset",
        "tools": "Python, BeautifulSoup, pdfminer.six, requests",
        "context": "UMass Amherst",
        "bullets": [
          "Built source-specific scrapers for 10 universities and standardized 519 HTML/PDF safety documents into a traceable multi-source dataset."
        ]
      },
      {
        "name": "Mental Health Signal on Reddit",
        "tools": "Python, NLP, scikit-learn, Transformers, Plotly Dash",
        "context": "UMass Amherst",
        "bullets": [
          "Collected and analyzed 25,886 posts and comments from three mental-health communities; compared three sentiment methods and three classifiers, conducted topic analysis, and built an interactive dashboard."
        ]
      },
      {
        "name": "Evolution of the Billboard Hot 100",
        "tools": "D3.js, Three.js, JavaScript, Python",
        "context": "UMass Amherst",
        "bullets": [
          "Joined Billboard chart history with Spotify audio features and built an interactive scrollytelling analysis covering 24 years of popular music."
        ]
      }
    ],
    "skills": [
      {
        "label": "Languages",
        "items": "Python, SQL, R, JavaScript, Bash"
      },
      {
        "label": "Data Engineering",
        "items": "Pandas, BeautifulSoup, requests, pdfminer.six, MongoDB, Microsoft SQL Server, Data Cleaning, Web Scraping"
      },
      {
        "label": "Platforms / Tools",
        "items": "Google Cloud, Docker, Git, Power BI, Plotly Dash, Node.js"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      }
    ],
    "slug": "analytics-data-engineering",
    "number": "03",
    "title": "Analytics / Data Engineering",
    "description": "Data collection, datasets, databases and reporting workflows, led by the multi-university scraper and Power BI reporting.",
    "pdf": "/resumes/Rishav_Chakravarty_Analytics_Data_Engineering.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Analytics_Data_Engineering.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Intro to Quantitative Analysis",
      "Causal Inference",
      "Applied Statistics",
      "Regression & Predictive Modeling",
      "Time Series Forecasting",
      "Data Visualization",
      "SQL & Database Management",
      "Research Design",
      "Exploratory Data Analysis"
    ],
    "experience": [
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "Virginia Tech Dining Services - Dietrick",
        "role": "Student Manager",
        "dates": "Aug. 2021 - Apr. 2024",
        "place": "Blacksburg, VA",
        "bullets": [
          "Managed daily operations in a high-volume dining facility while training, supervising, and providing performance feedback to staff.",
          "Maintained customer-service, food-safety, and operational standards across a fast-paced multi-function environment."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      },
      {
        "org": "Zad Holding Company Q.P.S.C.",
        "role": "Data Analytics Intern",
        "dates": "Mar. 2021 - Aug. 2021",
        "place": "Doha, Qatar",
        "bullets": [
          "Built datasets, database structures, and Power BI reporting workflows to support operational analysis and reduce manual reporting.",
          "Completed a client analytics project for Ooredoo Qatar using customer usage data, statistical inference, and Power BI to develop a mobile data-plan recommendation."
        ]
      }
    ],
    "projects": [
      {
        "name": "Dynamic Pricing Model for ReCell",
        "tools": "Python, Linear Regression, EDA",
        "context": "UT Austin",
        "bullets": [
          "Developed a regression-based pricing model on 20,000+ refurbished-device sales and identified key drivers of resale value."
        ]
      },
      {
        "name": "Stock Data Clustering",
        "tools": "Python, k-means, Hierarchical Clustering",
        "context": "UT Austin",
        "bullets": [
          "Clustered S&P 500 time-series data to identify equity groups with similar patterns and examine portfolio-diversification opportunities."
        ]
      },
      {
        "name": "Karnah",
        "tools": "Product Strategy, Social Impact, Matching",
        "context": "UMass Amherst",
        "bullets": [
          "Developed an in-kind donation platform concept for matching usable items with nonprofit needs; won second place and a $750 prize at UPitch Spring 2026."
        ]
      }
    ],
    "skills": [
      {
        "label": "Analytics",
        "items": "Business Analytics, KPI Reporting, Forecasting, Cost-Benefit Analysis, Statistical Analysis, Regression"
      },
      {
        "label": "Tools",
        "items": "Python, SQL, R, Power BI, Pandas, NumPy, Microsoft SQL Server"
      },
      {
        "label": "Business",
        "items": "Operations Analysis, Process Improvement, Customer Analytics, Requirements Analysis, Stakeholder Communication"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      },
      {
        "name": "UPitch Spring 2026 Second Place - Karnah",
        "text": "Awarded second place and a $750 prize at UMass Amherst."
      }
    ],
    "slug": "business-operations-analytics",
    "number": "04",
    "title": "Business / Operations Analytics",
    "description": "Operational and business performance analysis, with pricing, clustering and operations experience.",
    "pdf": "/resumes/Rishav_Chakravarty_Business_Operations_Analytics.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Business_Operations_Analytics.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Causal Inference",
      "Intro to Quantitative Analysis",
      "Applied Statistics",
      "Research Design",
      "Regression & Predictive Modeling",
      "Data Visualization",
      "Machine Learning for Social Scientists",
      "Exploratory Data Analysis",
      "Social Media Analysis"
    ],
    "experience": [
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      },
      {
        "org": "ProDose",
        "role": "Product Manager",
        "dates": "Sep. 2026 - Present",
        "place": "Amherst, MA",
        "bullets": [
          "Lead product development for a smart medication dispenser with a five-person UMass Mechanical & Industrial Engineering senior capstone team.",
          "Translate product requirements into CAD, 3D-printed prototypes, test plans, design refinements, and manufacturability decisions."
        ]
      },
      {
        "org": "Intercare Therapy, Inc.",
        "role": "Behavioral Health Technician",
        "dates": "Jan. 2025 - Jun. 2025",
        "place": "San Diego, CA",
        "bullets": [
          "Collected and reviewed behavioral data during ABA sessions and used client progress to inform session-level adjustments under clinical supervision.",
          "Implemented reinforcement schedules, prompt fading, and task analysis while maintaining HIPAA requirements and coordinating with caregivers."
        ]
      }
    ],
    "projects": [
      {
        "name": "CalendAI",
        "tools": "Predictive Modeling, A/B Testing, AWS, MongoDB, Node.js, React",
        "context": "Virginia Tech",
        "bullets": [
          "Applied behavioral modeling and experimentation to an intelligent scheduling concept; the project received a $500 KickStart VT seed grant."
        ]
      },
      {
        "name": "Mental Health Signal on Reddit",
        "tools": "Python, NLP, scikit-learn, Transformers, Plotly Dash",
        "context": "UMass Amherst",
        "bullets": [
          "Collected and analyzed 25,886 posts and comments from three mental-health communities; compared three sentiment methods and three classifiers, conducted topic analysis, and built an interactive dashboard."
        ]
      },
      {
        "name": "Karnah",
        "tools": "Product Strategy, Social Impact, Matching",
        "context": "UMass Amherst",
        "bullets": [
          "Developed an in-kind donation platform concept for matching usable items with nonprofit needs; won second place and a $750 prize at UPitch Spring 2026."
        ]
      }
    ],
    "skills": [
      {
        "label": "Product / Growth",
        "items": "Product Analytics, A/B Testing, Customer Analytics, Journey Analysis, KPI Reporting, Digital Strategy"
      },
      {
        "label": "Analytics",
        "items": "Python, SQL, R, Power BI, Statistical Analysis, Predictive Modeling, Regression"
      },
      {
        "label": "Tools",
        "items": "Pandas, NumPy, scikit-learn, Plotly Dash, MongoDB, SEO / Web Analytics"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      },
      {
        "name": "UPitch Spring 2026 Second Place - Karnah",
        "text": "Awarded second place and a $750 prize at UMass Amherst."
      }
    ],
    "slug": "product-growth-customer-analytics",
    "number": "05",
    "title": "Product Growth / Customer Analytics",
    "description": "Customer behavior, conversion and experimentation, with CalendAI and customer journey consulting work.",
    "pdf": "/resumes/Rishav_Chakravarty_Product_Growth_Customer_Analytics.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Product_Growth_Customer_Analytics.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Research Design",
      "Causal Inference",
      "Text as Data",
      "Network Inference",
      "Social Media Analysis",
      "Intro to Quantitative Analysis",
      "Machine Learning for Social Scientists",
      "Data Science Fundamentals",
      "Statistics for Social Science"
    ],
    "experience": [
      {
        "org": "Intercare Therapy, Inc.",
        "role": "Behavioral Health Technician",
        "dates": "Jan. 2025 - Jun. 2025",
        "place": "San Diego, CA",
        "bullets": [
          "Collected and reviewed behavioral data during ABA sessions and used client progress to inform session-level adjustments under clinical supervision.",
          "Implemented reinforcement schedules, prompt fading, and task analysis while maintaining HIPAA requirements and coordinating with caregivers."
        ]
      },
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "Google Developer Student Clubs",
        "role": "Featured Speaker - AI for Mental Health",
        "dates": "Aug. 2023 - Nov. 2023",
        "place": "Blacksburg, VA",
        "bullets": [
          "Presented applications of machine learning for personalized mental-health interventions to 150+ participants.",
          "Built supporting Power BI visualizations and discussed the use of behavioral science and data-driven methods in health technology."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      }
    ],
    "projects": [
      {
        "name": "Mental Health Signal on Reddit",
        "tools": "Python, NLP, scikit-learn, Transformers, Plotly Dash",
        "context": "UMass Amherst",
        "bullets": [
          "Collected and analyzed 25,886 posts and comments from three mental-health communities; compared three sentiment methods and three classifiers, conducted topic analysis, and built an interactive dashboard."
        ]
      },
      {
        "name": "Campus Safety Alerts Dataset",
        "tools": "Python, BeautifulSoup, pdfminer.six, requests",
        "context": "UMass Amherst",
        "bullets": [
          "Built source-specific scrapers for 10 universities and standardized 519 HTML/PDF safety documents into a traceable multi-source dataset."
        ]
      },
      {
        "name": "Evolution of the Billboard Hot 100",
        "tools": "D3.js, Three.js, JavaScript, Python",
        "context": "UMass Amherst",
        "bullets": [
          "Joined Billboard chart history with Spotify audio features and built an interactive scrollytelling analysis covering 24 years of popular music."
        ]
      }
    ],
    "skills": [
      {
        "label": "Research",
        "items": "Research Design, Causal Inference, Quantitative Research, Behavioral Measurement, Text Analysis, Network Analysis"
      },
      {
        "label": "Analytics",
        "items": "Python, R, SQL, Statistical Analysis, Regression, NLP, Machine Learning"
      },
      {
        "label": "Tools",
        "items": "scikit-learn, NLTK, Transformers, BeautifulSoup, Plotly Dash, Power BI, D3.js"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      },
      {
        "name": "UPitch Spring 2026 Second Place - Karnah",
        "text": "Awarded second place and a $750 prize at UMass Amherst."
      }
    ],
    "slug": "research-computational-social-science",
    "number": "06",
    "title": "Research / Computational Social Science",
    "description": "Research design, causal inference, text as data and behavioral research experience.",
    "pdf": "/resumes/Rishav_Chakravarty_Research_Computational_Social_Science.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Research_Computational_Social_Science.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Research Design",
      "Causal Inference",
      "Intro to Quantitative Analysis",
      "Text as Data",
      "Statistics for Social Science",
      "Human-Computer Interaction",
      "Applied Statistics",
      "Data Visualization",
      "Social Media Analysis"
    ],
    "experience": [
      {
        "org": "Intercare Therapy, Inc.",
        "role": "Behavioral Health Technician",
        "dates": "Jan. 2025 - Jun. 2025",
        "place": "San Diego, CA",
        "bullets": [
          "Collected and reviewed behavioral data during ABA sessions and used client progress to inform session-level adjustments under clinical supervision.",
          "Implemented reinforcement schedules, prompt fading, and task analysis while maintaining HIPAA requirements and coordinating with caregivers."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      },
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "Virginia Tech Dining Services - Dietrick",
        "role": "Student Manager",
        "dates": "Aug. 2021 - Apr. 2024",
        "place": "Blacksburg, VA",
        "bullets": [
          "Managed daily operations in a high-volume dining facility while training, supervising, and providing performance feedback to staff.",
          "Maintained customer-service, food-safety, and operational standards across a fast-paced multi-function environment."
        ]
      }
    ],
    "projects": [
      {
        "name": "Mental Health Signal on Reddit",
        "tools": "Python, NLP, scikit-learn, Transformers, Plotly Dash",
        "context": "UMass Amherst",
        "bullets": [
          "Collected and analyzed 25,886 posts and comments from three mental-health communities; compared three sentiment methods and three classifiers, conducted topic analysis, and built an interactive dashboard."
        ]
      },
      {
        "name": "CalendAI",
        "tools": "Predictive Modeling, A/B Testing, AWS, MongoDB, Node.js, React",
        "context": "Virginia Tech",
        "bullets": [
          "Applied behavioral modeling and experimentation to an intelligent scheduling concept; the project received a $500 KickStart VT seed grant."
        ]
      },
      {
        "name": "MeAsmi",
        "tools": "Clustering, Supervised Learning, Behavioral Analytics",
        "context": "Independent",
        "bullets": [
          "Co-led an interdisciplinary project exploring machine-learning methods for neurodivergent support and therapy-effectiveness analysis."
        ]
      }
    ],
    "skills": [
      {
        "label": "Behavioral / Research",
        "items": "Behavioral Analysis, Research Design, Customer Journey Analysis, A/B Testing, UX Research, HIPAA"
      },
      {
        "label": "Analytics",
        "items": "Python, R, SQL, Power BI, Statistical Analysis, Regression, Clustering, NLP"
      },
      {
        "label": "Business",
        "items": "Consumer Insights, Customer Analytics, Digital Strategy, Stakeholder Communication, Data Visualization"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      },
      {
        "name": "UPitch Spring 2026 Second Place - Karnah",
        "text": "Awarded second place and a $750 prize at UMass Amherst."
      }
    ],
    "slug": "behavioral-ux-consumer-insights",
    "number": "07",
    "title": "Behavioral / UX / Consumer Insights",
    "description": "Behavioral measurement, user-centered work and consumer insight from clinical and consulting roles.",
    "pdf": "/resumes/Rishav_Chakravarty_Behavioral_UX_Consumer_Insights.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Behavioral_UX_Consumer_Insights.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Intro to Quantitative Analysis",
      "Causal Inference",
      "Research Design",
      "Applied Statistics",
      "Data Visualization",
      "SQL & Database Management",
      "Regression & Predictive Modeling",
      "Machine Learning for Social Scientists",
      "Exploratory Data Analysis"
    ],
    "experience": [
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      },
      {
        "org": "ProDose",
        "role": "Product Manager",
        "dates": "Sep. 2026 - Present",
        "place": "Amherst, MA",
        "bullets": [
          "Lead product development for a smart medication dispenser with a five-person UMass Mechanical & Industrial Engineering senior capstone team.",
          "Translate product requirements into CAD, 3D-printed prototypes, test plans, design refinements, and manufacturability decisions."
        ]
      },
      {
        "org": "Zad Holding Company Q.P.S.C.",
        "role": "Data Analytics Intern",
        "dates": "Mar. 2021 - Aug. 2021",
        "place": "Doha, Qatar",
        "bullets": [
          "Built datasets, database structures, and Power BI reporting workflows to support operational analysis and reduce manual reporting.",
          "Completed a client analytics project for Ooredoo Qatar using customer usage data, statistical inference, and Power BI to develop a mobile data-plan recommendation."
        ]
      }
    ],
    "projects": [
      {
        "name": "Karnah",
        "tools": "Product Strategy, Social Impact, Matching",
        "context": "UMass Amherst",
        "bullets": [
          "Developed an in-kind donation platform concept for matching usable items with nonprofit needs; won second place and a $750 prize at UPitch Spring 2026."
        ]
      },
      {
        "name": "Dynamic Pricing Model for ReCell",
        "tools": "Python, Linear Regression, EDA",
        "context": "UT Austin",
        "bullets": [
          "Developed a regression-based pricing model on 20,000+ refurbished-device sales and identified key drivers of resale value."
        ]
      },
      {
        "name": "CalendAI",
        "tools": "Predictive Modeling, A/B Testing, AWS, MongoDB, Node.js, React",
        "context": "Virginia Tech",
        "bullets": [
          "Applied behavioral modeling and experimentation to an intelligent scheduling concept; the project received a $500 KickStart VT seed grant."
        ]
      }
    ],
    "skills": [
      {
        "label": "Consulting",
        "items": "Business Analysis, Requirements Analysis, KPI Design, Process Improvement, Digital Strategy, Customer Experience"
      },
      {
        "label": "Analytics",
        "items": "Python, SQL, R, Power BI, Statistical Analysis, Predictive Modeling, Customer Analytics"
      },
      {
        "label": "Technology",
        "items": "MongoDB, Google Cloud, React, Node.js, Docker, Git, Data Visualization"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      },
      {
        "name": "UPitch Spring 2026 Second Place - Karnah",
        "text": "Awarded second place and a $750 prize at UMass Amherst."
      }
    ],
    "slug": "analytics-consulting-digital-transformation",
    "number": "08",
    "title": "Analytics Consulting / Digital Transformation",
    "description": "Client-facing analytics, digital strategy and implementation across consulting roles.",
    "pdf": "/resumes/Rishav_Chakravarty_Analytics_Consulting_Digital_Transformation.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Analytics_Consulting_Digital_Transformation.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Research Design",
      "Causal Inference",
      "Data Science Fundamentals",
      "Intro to Quantitative Analysis",
      "Human-Computer Interaction",
      "Data Visualization",
      "Applied Statistics",
      "Machine Learning for Social Scientists",
      "Problem Solving in CS"
    ],
    "experience": [
      {
        "org": "ProDose",
        "role": "Product Manager",
        "dates": "Sep. 2026 - Present",
        "place": "Amherst, MA",
        "bullets": [
          "Lead product development for a smart medication dispenser with a five-person UMass Mechanical & Industrial Engineering senior capstone team.",
          "Translate product requirements into CAD, 3D-printed prototypes, test plans, design refinements, and manufacturability decisions."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      },
      {
        "org": "Virginia Tech Dining Services - Dietrick",
        "role": "Student Manager",
        "dates": "Aug. 2021 - Apr. 2024",
        "place": "Blacksburg, VA",
        "bullets": [
          "Managed daily operations in a high-volume dining facility while training, supervising, and providing performance feedback to staff.",
          "Maintained customer-service, food-safety, and operational standards across a fast-paced multi-function environment."
        ]
      },
      {
        "org": "Franklin County Community Development Corporation",
        "role": "Entrepreneurs Accelerator Program Participant",
        "dates": "Mar. 2026 - May 2026",
        "place": "Greenfield, MA",
        "bullets": [
          "Selected for the Spring 2026 cohort and worked on business strategy, market positioning, venture planning, and execution through mentorship and structured training."
        ]
      }
    ],
    "projects": [
      {
        "name": "CalendAI",
        "tools": "Predictive Modeling, A/B Testing, AWS, MongoDB, Node.js, React",
        "context": "Virginia Tech",
        "bullets": [
          "Applied behavioral modeling and experimentation to an intelligent scheduling concept; the project received a $500 KickStart VT seed grant."
        ]
      },
      {
        "name": "Karnah",
        "tools": "Product Strategy, Social Impact, Matching",
        "context": "UMass Amherst",
        "bullets": [
          "Developed an in-kind donation platform concept for matching usable items with nonprofit needs; won second place and a $750 prize at UPitch Spring 2026."
        ]
      },
      {
        "name": "MeAsmi",
        "tools": "Clustering, Supervised Learning, Behavioral Analytics",
        "context": "Independent",
        "bullets": [
          "Co-led an interdisciplinary project exploring machine-learning methods for neurodivergent support and therapy-effectiveness analysis."
        ]
      }
    ],
    "skills": [
      {
        "label": "Product",
        "items": "Product Management, Requirements Analysis, Prototyping, Cross-Functional Coordination, User-Centered Design, Testing"
      },
      {
        "label": "Analytics",
        "items": "Python, SQL, Power BI, Product Analytics, A/B Testing, Customer Analytics, Data Visualization"
      },
      {
        "label": "Technology",
        "items": "MongoDB, React, Node.js, Flutter, Docker, Git, CAD / 3D Prototyping"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      },
      {
        "name": "UPitch Spring 2026 Second Place - Karnah",
        "text": "Awarded second place and a $750 prize at UMass Amherst."
      }
    ],
    "slug": "product-program-management",
    "number": "09",
    "title": "Product / Program Management",
    "description": "Product requirements, prototyping and cross-functional coordination, led by ProDose and venture projects.",
    "pdf": "/resumes/Rishav_Chakravarty_Product_Program_Management.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Product_Program_Management.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Data Science Fundamentals",
      "SQL & Database Management",
      "Python for Data Science",
      "Research Design",
      "Data Visualization",
      "Intro to Quantitative Analysis",
      "Human-Computer Interaction",
      "Problem Solving in CS",
      "Applied Statistics"
    ],
    "experience": [
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "ProDose",
        "role": "Product Manager",
        "dates": "Sep. 2026 - Present",
        "place": "Amherst, MA",
        "bullets": [
          "Lead product development for a smart medication dispenser with a five-person UMass Mechanical & Industrial Engineering senior capstone team.",
          "Translate product requirements into CAD, 3D-printed prototypes, test plans, design refinements, and manufacturability decisions."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      },
      {
        "org": "Zad Holding Company Q.P.S.C.",
        "role": "Data Analytics Intern",
        "dates": "Mar. 2021 - Aug. 2021",
        "place": "Doha, Qatar",
        "bullets": [
          "Built datasets, database structures, and Power BI reporting workflows to support operational analysis and reduce manual reporting.",
          "Completed a client analytics project for Ooredoo Qatar using customer usage data, statistical inference, and Power BI to develop a mobile data-plan recommendation."
        ]
      }
    ],
    "projects": [
      {
        "name": "Campus Safety Alerts Dataset",
        "tools": "Python, BeautifulSoup, pdfminer.six, requests",
        "context": "UMass Amherst",
        "bullets": [
          "Built source-specific scrapers for 10 universities and standardized 519 HTML/PDF safety documents into a traceable multi-source dataset."
        ]
      },
      {
        "name": "CalendAI",
        "tools": "Predictive Modeling, A/B Testing, AWS, MongoDB, Node.js, React",
        "context": "Virginia Tech",
        "bullets": [
          "Applied behavioral modeling and experimentation to an intelligent scheduling concept; the project received a $500 KickStart VT seed grant."
        ]
      },
      {
        "name": "Evolution of the Billboard Hot 100",
        "tools": "D3.js, Three.js, JavaScript, Python",
        "context": "UMass Amherst",
        "bullets": [
          "Joined Billboard chart history with Spotify audio features and built an interactive scrollytelling analysis covering 24 years of popular music."
        ]
      }
    ],
    "skills": [
      {
        "label": "Solutions / Systems",
        "items": "Requirements Analysis, Workflow Optimization, Dashboard Implementation, Customer-Facing Consulting, Process Improvement"
      },
      {
        "label": "Technical",
        "items": "Python, SQL, R, MongoDB, Microsoft SQL Server, Google Cloud, React, Node.js, Docker, Git"
      },
      {
        "label": "Analytics",
        "items": "Power BI, Data Analysis, Data Visualization, KPI Reporting, Statistical Analysis"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      }
    ],
    "slug": "solutions-implementation-business-systems",
    "number": "10",
    "title": "Solutions / Implementation / Business Systems",
    "description": "Reporting systems, workflow improvements and client solutions, alongside the ProDose product work.",
    "pdf": "/resumes/Rishav_Chakravarty_Solutions_Implementation_Business_Systems.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Solutions_Implementation_Business_Systems.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Research Design",
      "Causal Inference",
      "Machine Learning for Social Scientists",
      "Text as Data",
      "Intro to Quantitative Analysis",
      "Applied Statistics",
      "Data Visualization",
      "Statistics for Social Science",
      "Human-Computer Interaction"
    ],
    "experience": [
      {
        "org": "Intercare Therapy, Inc.",
        "role": "Behavioral Health Technician",
        "dates": "Jan. 2025 - Jun. 2025",
        "place": "San Diego, CA",
        "bullets": [
          "Collected and reviewed behavioral data during ABA sessions and used client progress to inform session-level adjustments under clinical supervision.",
          "Implemented reinforcement schedules, prompt fading, and task analysis while maintaining HIPAA requirements and coordinating with caregivers."
        ]
      },
      {
        "org": "ProDose",
        "role": "Product Manager",
        "dates": "Sep. 2026 - Present",
        "place": "Amherst, MA",
        "bullets": [
          "Lead product development for a smart medication dispenser with a five-person UMass Mechanical & Industrial Engineering senior capstone team.",
          "Translate product requirements into CAD, 3D-printed prototypes, test plans, design refinements, and manufacturability decisions."
        ]
      },
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "Google Developer Student Clubs",
        "role": "Featured Speaker - AI for Mental Health",
        "dates": "Aug. 2023 - Nov. 2023",
        "place": "Blacksburg, VA",
        "bullets": [
          "Presented applications of machine learning for personalized mental-health interventions to 150+ participants.",
          "Built supporting Power BI visualizations and discussed the use of behavioral science and data-driven methods in health technology."
        ]
      }
    ],
    "projects": [
      {
        "name": "Mental Health Signal on Reddit",
        "tools": "Python, NLP, scikit-learn, Transformers, Plotly Dash",
        "context": "UMass Amherst",
        "bullets": [
          "Collected and analyzed 25,886 posts and comments from three mental-health communities; compared three sentiment methods and three classifiers, conducted topic analysis, and built an interactive dashboard."
        ]
      },
      {
        "name": "MeAsmi",
        "tools": "Clustering, Supervised Learning, Behavioral Analytics",
        "context": "Independent",
        "bullets": [
          "Co-led an interdisciplinary project exploring machine-learning methods for neurodivergent support and therapy-effectiveness analysis."
        ]
      },
      {
        "name": "CalendAI",
        "tools": "Predictive Modeling, A/B Testing, AWS, MongoDB, Node.js, React",
        "context": "Virginia Tech",
        "bullets": [
          "Applied behavioral modeling and experimentation to an intelligent scheduling concept; the project received a $500 KickStart VT seed grant."
        ]
      }
    ],
    "skills": [
      {
        "label": "Health / Behavior",
        "items": "Behavioral Measurement, ABA, HIPAA, Outcomes Tracking, Behavioral Analytics, User-Centered Health Technology"
      },
      {
        "label": "Analytics",
        "items": "Python, R, SQL, Statistical Analysis, Regression, Clustering, NLP, Machine Learning"
      },
      {
        "label": "Tools",
        "items": "scikit-learn, TensorFlow, Transformers, NLTK, Power BI, Plotly Dash"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      }
    ],
    "slug": "health-behavioral-analytics",
    "number": "11",
    "title": "Health / Behavioral Analytics",
    "description": "Behavioral and clinical data work, ABA experience under HIPAA and health technology projects.",
    "pdf": "/resumes/Rishav_Chakravarty_Health_Behavioral_Analytics.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Health_Behavioral_Analytics.docx"
  },
  {
    "header": {
      "name": "RISHAV CHAKRAVARTY",
      "location": "Amherst, MA 01002",
      "contact": [
        "443-214-4881",
        "rishavchakravarty18@gmail.com",
        "linkedin.com/in/rishav-dsc",
        "github.com/rishav-dev",
        "rishavchakravarty.com"
      ]
    },
    "education": [
      {
        "school": "University of Massachusetts Amherst",
        "dates": "Sep. 2025 - May 2027 (Expected)",
        "degree": "Master of Science in Data Analytics & Computational Social Science (DACSS)",
        "place": "Amherst, MA"
      },
      {
        "school": "The University of Texas at Austin",
        "dates": "Jan. 2024 - Sep. 2024",
        "degree": "Postgraduate Diploma in Data Science & Business Analytics",
        "place": "Austin, TX"
      },
      {
        "school": "Virginia Tech",
        "dates": "Aug. 2021 - May 2024",
        "degree": "Bachelor of Science in Psychology (Minor in Computer Science)",
        "place": "Blacksburg, VA"
      }
    ],
    "coursework": [
      "Intro to Quantitative Analysis",
      "Causal Inference",
      "Applied Statistics",
      "Regression & Predictive Modeling",
      "Time Series Forecasting",
      "Machine Learning",
      "SQL & Database Management",
      "Exploratory Data Analysis",
      "Data Visualization"
    ],
    "experience": [
      {
        "org": "Zad Holding Company Q.P.S.C.",
        "role": "Data Analytics Intern",
        "dates": "Mar. 2021 - Aug. 2021",
        "place": "Doha, Qatar",
        "bullets": [
          "Built datasets, database structures, and Power BI reporting workflows to support operational analysis and reduce manual reporting.",
          "Completed a client analytics project for Ooredoo Qatar using customer usage data, statistical inference, and Power BI to develop a mobile data-plan recommendation."
        ]
      },
      {
        "org": "Steve Fisher Consulting",
        "role": "Data Analytics & Strategy Consultant",
        "dates": "May 2025 - Apr. 2026",
        "place": "Menifee, CA",
        "bullets": [
          "Analyzed client engagement, retention, and conversion data to support business and digital strategy decisions.",
          "Built KPI dashboards and predictive models for marketing, operations, and customer behavior; improved client-facing workflows and reporting."
        ]
      },
      {
        "org": "Simple Coaching Inc.",
        "role": "Digital Strategy & Analytics Consultant",
        "dates": "Mar. 2025 - Aug. 2025",
        "place": "Remote",
        "bullets": [
          "Used customer journey, SEO, and performance analytics to improve service pages, digital strategy, and customer experience.",
          "Worked with leadership on new service offerings, digital audits, website improvements, and data-informed outreach."
        ]
      },
      {
        "org": "Virginia Tech Dining Services - Dietrick",
        "role": "Student Manager",
        "dates": "Aug. 2021 - Apr. 2024",
        "place": "Blacksburg, VA",
        "bullets": [
          "Managed daily operations in a high-volume dining facility while training, supervising, and providing performance feedback to staff.",
          "Maintained customer-service, food-safety, and operational standards across a fast-paced multi-function environment."
        ]
      }
    ],
    "projects": [
      {
        "name": "Dynamic Pricing Model for ReCell",
        "tools": "Python, Linear Regression, EDA",
        "context": "UT Austin",
        "bullets": [
          "Developed a regression-based pricing model on 20,000+ refurbished-device sales and identified key drivers of resale value."
        ]
      },
      {
        "name": "Stock Data Clustering",
        "tools": "Python, k-means, Hierarchical Clustering",
        "context": "UT Austin",
        "bullets": [
          "Clustered S&P 500 time-series data to identify equity groups with similar patterns and examine portfolio-diversification opportunities."
        ]
      },
      {
        "name": "Mental Health Signal on Reddit",
        "tools": "Python, NLP, scikit-learn, Transformers, Plotly Dash",
        "context": "UMass Amherst",
        "bullets": [
          "Collected and analyzed 25,886 posts and comments from three mental-health communities; compared three sentiment methods and three classifiers, conducted topic analysis, and built an interactive dashboard."
        ]
      }
    ],
    "skills": [
      {
        "label": "Quantitative",
        "items": "Regression, Forecasting, Statistical Inference, Clustering, Pricing Analysis, Cost-Benefit Analysis, Customer Segmentation"
      },
      {
        "label": "Tools",
        "items": "Python, R, SQL, Power BI, Pandas, NumPy, scikit-learn, Microsoft SQL Server"
      },
      {
        "label": "Business",
        "items": "Revenue Analytics, Decision Analysis, Customer Analytics, KPI Reporting, Data Visualization"
      }
    ],
    "honors": [
      {
        "name": "The Action Taker Award",
        "text": "Recognized by LISC Massachusetts & the IXL Center for digital strategy and analytics work completed through the LISC Digital Growth Accelerator."
      },
      {
        "name": "KickStart VT Seed Grant Winner - CalendAI",
        "text": "$500 seed grant from the Apex Center for Entrepreneurs at Virginia Tech."
      },
      {
        "name": "Future Founder Startup Award - Minute Pitch Competition",
        "text": "$300 award from the Berthiaume Center for Entrepreneurship at UMass Amherst."
      },
      {
        "name": "UPitch Spring 2026 Second Place - Karnah",
        "text": "Awarded second place and a $750 prize at UMass Amherst."
      }
    ],
    "slug": "pricing-revenue-financial-analytics",
    "number": "12",
    "title": "Pricing / Revenue / Financial Analytics",
    "description": "Pricing models, forecasting, cost-benefit analysis and customer usage analytics.",
    "pdf": "/resumes/Rishav_Chakravarty_Pricing_Revenue_Financial_Analytics.pdf",
    "docx": "/resumes/Rishav_Chakravarty_Pricing_Revenue_Financial_Analytics.docx"
  }
];

export const resumeBySlug = (slug: string) => RESUMES.find((r) => r.slug === slug);
